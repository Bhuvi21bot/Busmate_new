"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Bus, Users, DollarSign, CheckCircle, Zap, ArrowRight, Sparkles, Wallet } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import { useSession } from "@/lib/auth-client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function BookingPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  // Dock items
  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <VscCalendar size={20} />, label: 'Booking', onClick: () => router.push('/booking') },
    { icon: <Wallet size={20} />, label: 'My Wallet', onClick: () => router.push('/driver-dashboard?tab=wallet') },
  ]

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
  if (isPending) {
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

    // Proceed with booking
    setIsLoading(true)
    try {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const seatVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.02,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }),
    hover: {
      scale: 1.1,
      transition: { type: "spring", stiffness: 400 }
    },
    tap: {
      scale: 0.95
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,136,112,0.1),transparent)]" />
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Smart Booking System</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-green-300 to-primary bg-clip-text text-transparent">
              Book Your Ride
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose your destination and let's get you moving
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
              />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ 
                      x: [0, 5, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Bus className="h-6 w-6 text-primary" />
                  </motion.div>
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    className="grid md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
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
                        className="transition-all focus:scale-[1.02]"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
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
                        className="transition-all focus:scale-[1.02]"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
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
                        <SelectTrigger className="transition-all focus:scale-[1.02]">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="government-bus">Government Bus</SelectItem>
                          <SelectItem value="private-bus">Private Bus</SelectItem>
                          <SelectItem value="chartered-bus">Chartered Bus</SelectItem>
                          <SelectItem value="e-rickshaw">E-Rickshaw</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div variants={itemVariants}>
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
                        className="transition-all focus:scale-[1.02]"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEstimateFare}
                      disabled={isLoading}
                      className="flex-1 group hover:bg-primary/10 hover:border-primary/50 transition-all"
                    >
                      <DollarSign className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Estimate Fare
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSeatSelection(!showSeatSelection)}
                      className="flex-1 group hover:bg-primary/10 hover:border-primary/50 transition-all"
                    >
                      <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Select Seats
                    </Button>
                  </motion.div>

                  <AnimatePresence>
                    {estimatedFare && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg text-center border border-primary/30 relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "linear"
                          }}
                        />
                        <motion.p 
                          className="text-2xl font-bold text-primary relative z-10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          Estimated Fare: ₹{estimatedFare}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showSeatSelection && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <motion.h3 
                          className="text-lg font-semibold flex items-center gap-2"
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                        >
                          <Sparkles className="h-5 w-5 text-primary" />
                          Select Your Seats
                        </motion.h3>
                        <motion.div 
                          className="grid grid-cols-5 gap-2"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {seats.map((seat, index) => (
                            <motion.div
                              key={seat}
                              custom={index}
                              variants={seatVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                type="button"
                                variant={
                                  selectedSeats.includes(seat) ? "default" : "outline"
                                }
                                onClick={() => handleSeatSelection(seat)}
                                className={`h-12 w-full transition-all ${
                                  selectedSeats.includes(seat) 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" 
                                    : "hover:border-primary/50 hover:bg-primary/10"
                                }`}
                              >
                                {seat}
                              </Button>
                            </motion.div>
                          ))}
                        </motion.div>
                        {selectedSeats.length > 0 && (
                          <motion.p 
                            className="text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Selected seats: <span className="text-primary font-medium">{selectedSeats.join(", ")}</span>
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 group relative overflow-hidden"
                      disabled={isLoading || !estimatedFare || selectedSeats.length === 0}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "linear"
                        }}
                      />
                      <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      {isLoading ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />

      <Dock 
        items={dockItems}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
    </div>
  )
}