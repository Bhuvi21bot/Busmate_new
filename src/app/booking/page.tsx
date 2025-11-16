"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, Bus, Users, DollarSign, CheckCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function BookingPage() {
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

  const handleEstimateFare = async () => {
    if (!formData.pickup || !formData.dropoff || !formData.vehicleType) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/fare-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const handleSeatSelection = (seat: string) => {
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

    setIsLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          seats: selectedSeats,
          fare: estimatedFare,
        }),
      })
      const data = await response.json()
      toast.success("Booking confirmed!")
      // Reset form or redirect
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
                      onClick={() => setShowSeatSelection(!showSeatSelection)}
                      className="flex-1"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Select Seats
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

                  {showSeatSelection && (
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
                    disabled={isLoading || !estimatedFare || selectedSeats.length === 0}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </Button>
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
