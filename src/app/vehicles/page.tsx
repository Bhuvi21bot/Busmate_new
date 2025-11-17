"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Info, Sparkles } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VehiclesPage() {
  const [activeTab, setActiveTab] = useState("all")

  const vehicles = [
    {
      id: 1,
      name: "UPSRTC Bus",
      category: "government",
      description: "Serving only the UP region and its neighboring borders.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
      route: "City Center - Airport",
      fare: "₹50-80",
    },
    {
      id: 2,
      name: "MetroWay Bus",
      category: "private",
      description: "Connecting Metro cities with comfort and speed",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800",
      route: "Downtown - Suburb",
      fare: "₹60-100",
    },
    {
      id: 3,
      name: "Private Booking",
      category: "chartered",
      description: "Exclusive bus rentals for private events",
      image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800",
      route: "Custom Routes",
      fare: "₹2000+",
    },
    {
      id: 4,
      name: "E-Rickshaw",
      category: "e-rickshaw",
      description: "Eco-friendly urban transport solution",
      image: "https://images.unsplash.com/photo-1583486882634-82e9dece3ea0?w=800",
      route: "Short Distance",
      fare: "₹20-50",
    },
    {
      id: 5,
      name: "Haryana Roadways",
      category: "government",
      description: "State-owned bus service in Haryana",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800",
      route: "Haryana Region",
      fare: "₹40-70",
    },
    {
      id: 6,
      name: "CityLink Travels",
      category: "private",
      description: "Connecting urban centers with daily services",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
      route: "Multiple Routes",
      fare: "₹55-90",
    },
  ]

  const filteredVehicles =
    activeTab === "all"
      ? vehicles
      : vehicles.filter((v) => v.category === activeTab)

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
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Available Vehicles
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your ride, ready when you are—fast, reliable, and just a click away!
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5">
                <TabsTrigger value="all" className="transition-all duration-300">All</TabsTrigger>
                <TabsTrigger value="government" className="transition-all duration-300">Government</TabsTrigger>
                <TabsTrigger value="private" className="transition-all duration-300">Private</TabsTrigger>
                <TabsTrigger value="chartered" className="transition-all duration-300">Chartered</TabsTrigger>
                <TabsTrigger value="e-rickshaw" className="transition-all duration-300">E-Rickshaw</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  y: -15,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden relative group">
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Image with zoom effect */}
                  <div className="relative h-48 overflow-hidden">
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
                    
                    {/* Overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <CardContent className="p-6 relative">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-bold mb-2">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {vehicle.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm">
                          <span className="font-semibold">Route:</span> {vehicle.route}
                        </p>
                        <motion.p 
                          className="text-sm"
                          whileHover={{ scale: 1.05, x: 5 }}
                        >
                          <span className="font-semibold">Fare:</span> <span className="text-primary font-bold">{vehicle.fare}</span>
                        </motion.p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full hover:scale-[1.02] transition-all duration-300"
                          >
                            <Info className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </Link>
                        <Link href="/booking" className="flex-1">
                          <Button className="w-full bg-primary hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Book
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}