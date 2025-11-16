"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Info } from "lucide-react"
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

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Available Vehicles</h1>
            <p className="text-xl text-muted-foreground">
              Your ride, ready when you are—fast, reliable, and just a click away!
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="government">Government</TabsTrigger>
              <TabsTrigger value="private">Private</TabsTrigger>
              <TabsTrigger value="chartered">Chartered</TabsTrigger>
              <TabsTrigger value="e-rickshaw">E-Rickshaw</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {vehicle.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-semibold">Route:</span> {vehicle.route}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Fare:</span> {vehicle.fare}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Info className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </Link>
                      <Link href="/booking" className="flex-1">
                        <Button className="w-full bg-primary">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Book
                        </Button>
                      </Link>
                    </div>
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
