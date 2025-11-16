"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Users, Shield, Star, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function VehicleDetailPage() {
  const params = useParams()
  const id = params.id

  // Mock data - in a real app, this would be fetched from an API
  const vehicle = {
    id,
    name: "UPSRTC Government Bus",
    category: "Government Bus",
    description: "Comfortable and affordable government bus service serving the UP region and neighboring borders with reliable schedules.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200",
    route: "City Center - Airport - Suburban Areas",
    fare: "₹50-80",
    rating: 4.5,
    reviews: 234,
    seats: 40,
    features: [
      "Real-time GPS tracking",
      "Verified drivers",
      "Online booking",
      "AC facility",
      "Emergency support 24/7",
      "Clean and sanitized",
    ],
    schedule: [
      { time: "06:00 AM", route: "City Center → Airport", seats: 15 },
      { time: "08:30 AM", route: "Airport → Suburban", seats: 8 },
      { time: "11:00 AM", route: "City Center → Airport", seats: 22 },
      { time: "02:00 PM", route: "Airport → Downtown", seats: 18 },
      { time: "05:30 PM", route: "Downtown → City Center", seats: 12 },
      { time: "08:00 PM", route: "City Center → Airport", seats: 25 },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/vehicles">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vehicles
              </Button>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Image and Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-primary">
                  {vehicle.category}
                </Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{vehicle.name}</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-normal text-lg">
                        {vehicle.rating} ({vehicle.reviews} reviews)
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{vehicle.description}</p>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Route</p>
                        <p className="text-sm text-muted-foreground">{vehicle.route}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Capacity</p>
                        <p className="text-sm text-muted-foreground">{vehicle.seats} seats</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-2xl font-bold text-primary mb-4">{vehicle.fare}</p>
                    <Link href="/booking">
                      <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                        Book This Vehicle
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Features & Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {vehicle.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vehicle.schedule.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <div>
                          <p className="font-semibold">{item.time}</p>
                          <p className="text-sm text-muted-foreground">{item.route}</p>
                        </div>
                        <Badge variant={item.seats > 10 ? "default" : "secondary"}>
                          {item.seats} seats
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Safety Notice */}
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-2">Safety First</p>
                      <p className="text-sm text-muted-foreground">
                        All our drivers are government-verified with valid licenses. Vehicles are regularly inspected and maintained for your safety and comfort.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
