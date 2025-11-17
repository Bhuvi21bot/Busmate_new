"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Calendar, Bus, Users, DollarSign, CheckCircle, AlertCircle, Zap, Crown } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { useCustomer } from "autumn-js/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function BookingPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const { customer, check, track, refetch, isLoading: isLoadingCustomer } = useCustomer()
  
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    vehicleType: "",
    datetime: "",
    passengers: "1",
  })
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [showSeatSelection, setShowSeatSelection] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/booking")
    }
  }, [session, isPending, router])

  // Show loading while checking auth
  if (isPending || isLoadingCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Bus className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!session?.user) {
    return null
  }

  // Get booking limits
  const bookingFeature = customer?.features?.bookings
  const currentPlan = customer?.products?.at(-1)
  const planName = currentPlan?.name || "Free"
  const isUnlimited = bookingFeature?.unlimited || bookingFeature?.included_usage === -1
  const bookingsRemaining = isUnlimited ? "Unlimited" : (bookingFeature?.balance || 0)
  const bookingsUsed = bookingFeature?.usage || 0
  const bookingsTotal = bookingFeature?.included_usage || 0
  const bookingPercentage = isUnlimited ? 0 : Math.min(100, (bookingsUsed / bookingsTotal) * 100)

  // Check if user can access advanced seat selection
  const hasSeatSelection = customer?.features?.seat_selection !== undefined
  const hasPriorityBooking = customer?.features?.priority_booking !== undefined

  const handleEstimateFare = async () => {
    if (!formData.pickup || !formData.dropoff || !formData.vehicleType) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch("/api/fare-estimate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setEstimatedFare(data.fare)
      toast.success(`Estimated fare: ₹${data.fare}`)
    } catch (error) {
      toast.error("Failed to estimate fare")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeatSelection = async (seat: string) => {
    // Check if user has seat selection feature
    if (!hasSeatSelection) {
      toast.error("Advanced seat selection is only available for Plus and Premium members")
      return
    }

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!estimatedFare || selectedSeats.length === 0) {
      toast.error("Please estimate fare and select seats")
      return
    }

    // CRITICAL: Check booking allowance before submission
    setIsLoading(true)
    try {
      const { data: checkData } = await check({ 
        featureId: "bookings", 
        requiredBalance: 1 
      })
      
      if (!checkData?.allowed) {
        toast.error(
          `You've reached your booking limit (${bookingsTotal} per month). Please upgrade your plan to continue.`,
          { duration: 5000 }
        )
        setIsLoading(false)
        return
      }

      // Proceed with booking
      const token = localStorage.getItem("bearer_token")
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...formData,
          seats: selectedSeats,
          fare: estimatedFare,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Track the booking usage
        await track({ 
          featureId: "bookings", 
          value: 1, 
          idempotencyKey: `booking-${Date.now()}-${data.id}` 
        })
        
        // Refresh customer data to update usage
        await refetch()
        
        toast.success("Booking confirmed!")
        
        // Reset form
        setFormData({
          pickup: "",
          dropoff: "",
          vehicleType: "",
          datetime: "",
          passengers: "1",
        })
        setSelectedSeats([])
        setEstimatedFare(null)
        setShowSeatSelection(false)
      } else {
        toast.error(data.error || "Booking failed")
      }
    } catch (error) {
      toast.error("Booking failed")
    } finally {
      setIsLoading(false)
    }
  }

  const seats = Array.from({ length: 20 }, (_, i) => {
    const row = Math.floor(i / 5) + 1
    const col = String.fromCharCode(65 + (i % 5))
    return `${row}${col}`
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Ride</h1>
            <p className="text-xl text-muted-foreground">
              Choose your destination and let's get you moving
            </p>
          </motion.div>

          {/* Usage Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Your Plan: {planName}</h3>
                  </div>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm" className="text-xs">
                      {planName === "Free" ? "Upgrade" : "Manage Plan"}
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {/* Bookings meter */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Monthly Bookings</span>
                      <span className="font-mono text-sm font-medium">
                        {isUnlimited ? "Unlimited" : `${bookingsUsed}/${bookingsTotal}`}
                      </span>
                    </div>
                    {!isUnlimited && (
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            bookingPercentage > 90 ? "bg-destructive" : 
                            bookingPercentage > 75 ? "bg-yellow-500" : "bg-primary"
                          }`}
                          style={{ width: `${bookingPercentage}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {hasPriorityBooking && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        ⚡ Priority Booking
                      </span>
                    )}
                    {hasSeatSelection && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        🎯 Advanced Seats
                      </span>
                    )}
                    {customer?.features?.real_time_tracking && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        📍 Live Tracking
                      </span>
                    )}
                  </div>
                </div>

                {/* Warning if low on bookings */}
                {!isUnlimited && bookingsRemaining === 0 && (
                  <Alert className="mt-4 border-destructive/50 bg-destructive/5">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertTitle className="text-destructive">Booking Limit Reached</AlertTitle>
                    <AlertDescription className="text-destructive/80">
                      You've used all {bookingsTotal} bookings this month. 
                      <Link href="/pricing" className="underline font-medium ml-1">
                        Upgrade to Plus or Premium
                      </Link> for more bookings.
                    </AlertDescription>
                  </Alert>
                )}
                {!isUnlimited && bookingsRemaining > 0 && bookingsRemaining <= 1 && (
                  <Alert className="mt-4 border-yellow-500/50 bg-yellow-500/5">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-600">Almost at Limit</AlertTitle>
                    <AlertDescription className="text-yellow-600/80">
                      Only {bookingsRemaining} booking remaining this month.
                      <Link href="/pricing" className="underline font-medium ml-1">
                        Upgrade for unlimited bookings
                      </Link>.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bus className="h-6 w-6 text-primary" />
                  Booking Details
                  {hasPriorityBooking && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary ml-auto">
                      Priority Access
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="pickup" className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Pickup Location
                      </Label>
                      <Input
                        id="pickup"
                        placeholder="Enter pickup location"
                        value={formData.pickup}
                        onChange={(e) =>
                          setFormData({ ...formData, pickup: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="dropoff" className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Drop-off Location
                      </Label>
                      <Input
                        id="dropoff"
                        placeholder="Enter drop-off location"
                        value={formData.dropoff}
                        onChange={(e) =>
                          setFormData({ ...formData, dropoff: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="vehicleType" className="flex items-center gap-2 mb-2">
                        <Bus className="h-4 w-4 text-primary" />
                        Vehicle Type
                      </Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, vehicleType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="government-bus">Government Bus</SelectItem>
                          <SelectItem value="private-bus">Private Bus</SelectItem>
                          <SelectItem value="chartered-bus">Chartered Bus</SelectItem>
                          <SelectItem value="e-rickshaw">E-Rickshaw</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="datetime" className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Date & Time
                      </Label>
                      <Input
                        id="datetime"
                        type="datetime-local"
                        value={formData.datetime}
                        onChange={(e) =>
                          setFormData({ ...formData, datetime: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEstimateFare}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Estimate Fare
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!hasSeatSelection) {
                          toast.error("Advanced seat selection requires Plus or Premium plan", {
                            duration: 4000,
                            action: {
                              label: "Upgrade",
                              onClick: () => router.push("/pricing")
                            }
                          })
                          return
                        }
                        setShowSeatSelection(!showSeatSelection)
                      }}
                      className="flex-1"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Select Seats
                      {!hasSeatSelection && (
                        <Crown className="h-3 w-3 ml-1 text-primary" />
                      )}
                    </Button>
                  </div>

                  {estimatedFare && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-primary/10 rounded-lg text-center"
                    >
                      <p className="text-lg font-semibold text-primary">
                        Estimated Fare: ₹{estimatedFare}
                      </p>
                    </motion.div>
                  )}

                  {showSeatSelection && hasSeatSelection && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold">Select Your Seats</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {seats.map((seat) => (
                          <Button
                            key={seat}
                            type="button"
                            variant={
                              selectedSeats.includes(seat) ? "default" : "outline"
                            }
                            onClick={() => handleSeatSelection(seat)}
                            className="h-12"
                          >
                            {seat}
                          </Button>
                        ))}
                      </div>
                      {selectedSeats.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Selected seats: {selectedSeats.join(", ")}
                        </p>
                      )}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading || !estimatedFare || selectedSeats.length === 0 || (!isUnlimited && bookingsRemaining === 0)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isLoading ? "Processing..." : "Confirm Booking"}
                  </Button>

                  {!isUnlimited && bookingsRemaining === 0 && (
                    <p className="text-center text-sm text-destructive">
                      Upgrade your plan to make more bookings this month
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}