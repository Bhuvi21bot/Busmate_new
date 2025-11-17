"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Users, Shield, Star, ArrowLeft, Check } from "lucide-react"
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

      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/vehicles">
              <Button 
                variant="ghost" 
                className="mb-4 hover:scale-105 transition-transform"
              >
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
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.div 
                className="relative h-96 rounded-2xl overflow-hidden mb-6 group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {vehicle.category}
                  </Badge>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                      <span className="text-xl">{vehicle.name}</span>
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        <span className="font-normal text-lg">
                          {vehicle.rating} ({vehicle.reviews} reviews)
                        </span>
                      </motion.div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{vehicle.description}</p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                      >
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">Route</p>
                          <p className="text-sm text-muted-foreground">{vehicle.route}</p>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ x: 5 }}
                      >
                        <Users className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">Capacity</p>
                          <p className="text-sm text-muted-foreground">{vehicle.seats} seats</p>
                        </div>
                      </motion.div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <motion.p 
                        className="text-2xl font-bold text-primary mb-4"
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {vehicle.fare}
                      </motion.p>
                      <Link href="/booking">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/50" 
                          size="lg"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                          Book This Vehicle
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-6"
            >
              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Shield className="h-5 w-5 text-primary" />
                      </motion.div>
                      Features & Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {vehicle.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                        >
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
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
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                          whileHover={{ 
                            scale: 1.02,
                            x: 5,
                            transition: { type: "spring", stiffness: 400 }
                          }}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors relative overflow-hidden group"
                        >
                          {/* Shimmer on hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                          />
                          
                          <div className="relative z-10">
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
              </motion.div>

              {/* Safety Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="border-primary/50 bg-primary/5 backdrop-blur-sm relative overflow-hidden group">
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <CardContent className="pt-6 relative z-10">
                    <div className="flex items-start gap-3">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      </motion.div>
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
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}