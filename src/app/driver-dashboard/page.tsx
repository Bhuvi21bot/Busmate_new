"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, Wallet, User, Route, Upload } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function DriverDashboard() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch("/api/drivers/register", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Application submitted successfully! We'll review it within 24-48 hours.")
        e.currentTarget.reset()
      } else {
        toast.error(data.error || "Failed to submit application")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Driver Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Manage your driving career with ease
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: UserPlus, title: "Join as Driver", desc: "Apply to become verified" },
              { icon: Wallet, title: "My Wallet", desc: "Check earnings" },
              { icon: User, title: "My Profile", desc: "View driver details" },
              { icon: Route, title: "My Rides", desc: "Review ride history" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <item.icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="apply" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="apply">Apply</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="rides">Rides</TabsTrigger>
            </TabsList>

            <TabsContent value="apply">
              <Card>
                <CardHeader>
                  <CardTitle>Become a Verified Bus Mate Driver</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required />
                      </div>

                      <div>
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input id="contact" name="contact" type="tel" required />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" name="address" rows={3} required />
                      </div>

                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" required />
                      </div>

                      <div>
                        <Label htmlFor="district">District</Label>
                        <Input id="district" name="district" required />
                      </div>

                      <div>
                        <Label htmlFor="license">License Number</Label>
                        <Input id="license" name="license" required />
                      </div>

                      <div>
                        <Label htmlFor="vehicle">Vehicle Type</Label>
                        <Select name="vehicle" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bus">Bus</SelectItem>
                            <SelectItem value="e-rickshaw">E-Rickshaw</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input id="bloodGroup" name="bloodGroup" required />
                      </div>

                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input id="email" name="email" type="email" />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="idUpload">Upload Vehicle ID/License</Label>
                        <Input id="idUpload" name="idUpload" type="file" accept="image/*,.pdf" required />
                      </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm">
                        <strong>Verification Notice:</strong> All drivers are verified through government ID and local authority checks. Your application will be reviewed within 24-48 hours.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      <Upload className="h-4 w-4 mr-2" />
                      {isLoading ? "Submitting..." : "Submit for Verification"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet">
              <Card>
                <CardHeader>
                  <CardTitle>My Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: "Total Earnings", value: "₹1,250.00" },
                      { label: "Pending Payouts", value: "₹300.00" },
                      { label: "Last Payout", value: "₹200.00 on 2024-06-15" },
                      { label: "Status", value: "Active" },
                    ].map((item) => (
                      <div key={item.label} className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-lg font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: "Name", value: "Ramesh Kumar" },
                      { label: "License Number", value: "UP16XX5566" },
                      { label: "Vehicle Type", value: "Bus" },
                      { label: "Contact", value: "+91XXXXXXXXXX" },
                      { label: "Blood Group", value: "B+" },
                      { label: "Status", value: "Verified" },
                    ].map((item) => (
                      <div key={item.label} className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        <p className="font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rides">
              <Card>
                <CardHeader>
                  <CardTitle>My Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "001", date: "2024-06-10", route: "A to B", fare: "₹15.00" },
                      { id: "002", date: "2024-06-12", route: "C to D", fare: "₹20.00" },
                      { id: "003", date: "2024-06-14", route: "E to F", fare: "₹25.00" },
                    ].map((ride) => (
                      <div key={ride.id} className="bg-muted/50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">Ride #{ride.id}</p>
                            <p className="text-sm text-muted-foreground">
                              Date: {ride.date} | Route: {ride.route}
                            </p>
                          </div>
                          <p className="font-bold text-primary">{ride.fare}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
