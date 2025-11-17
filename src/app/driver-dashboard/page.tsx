"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Wallet, User, Route, Upload, Loader2, Bus } from "lucide-react"
import { useSession } from "@/lib/auth-client"
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

interface DriverProfile {
  id: number
  name: string
  contact: string
  address: string
  city: string
  district: string
  license: string
  vehicle: string
  bloodGroup: string
  email: string | null
  status: string
  applicationNumber: string
  appliedDate: string
  approvedDate: string | null
}

interface DriverWallet {
  id: number
  driverId: number
  totalEarnings: number
  pendingPayouts: number
  lastPayoutAmount: number | null
  lastPayoutDate: string | null
  status: string
}

interface DriverRide {
  id: number
  driverId: number
  rideNumber: string
  date: string
  route: string
  fare: number
  passengerCount: number
  status: string
}

export default function DriverDashboard() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("apply")
  const [licenseNumber, setLicenseNumber] = useState("")
  
  // State for profile, wallet, and rides
  const [profile, setProfile] = useState<DriverProfile | null>(null)
  const [wallet, setWallet] = useState<DriverWallet | null>(null)
  const [rides, setRides] = useState<DriverRide[]>([])
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [loadingRides, setLoadingRides] = useState(false)

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/driver-dashboard")
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

  // Fetch profile data
  const fetchProfile = async (license: string) => {
    if (!license) return
    
    setLoadingProfile(true)
    try {
      const response = await fetch(`/api/drivers/profile?license=${encodeURIComponent(license)}`)
      const data = await response.json()
      
      if (response.ok) {
        setProfile(data)
        // If profile found, fetch wallet and rides
        if (data.id) {
          fetchWallet(data.id)
          fetchRides(data.id)
        }
      } else {
        toast.error(data.error || "Profile not found")
        setProfile(null)
      }
    } catch (error) {
      toast.error("Failed to fetch profile")
      setProfile(null)
    } finally {
      setLoadingProfile(false)
    }
  }

  // Fetch wallet data
  const fetchWallet = async (driverId: number) => {
    setLoadingWallet(true)
    try {
      const response = await fetch(`/api/drivers/wallet?driverId=${driverId}`)
      const data = await response.json()
      
      if (response.ok) {
        setWallet(data)
      } else {
        toast.error(data.error || "Wallet not found")
        setWallet(null)
      }
    } catch (error) {
      toast.error("Failed to fetch wallet data")
      setWallet(null)
    } finally {
      setLoadingWallet(false)
    }
  }

  // Fetch rides data
  const fetchRides = async (driverId: number) => {
    setLoadingRides(true)
    try {
      const response = await fetch(`/api/drivers/rides?driverId=${driverId}&limit=20`)
      const data = await response.json()
      
      if (response.ok) {
        setRides(data)
      } else {
        toast.error(data.error || "Failed to fetch rides")
        setRides([])
      }
    } catch (error) {
      toast.error("Failed to fetch ride history")
      setRides([])
    } finally {
      setLoadingRides(false)
    }
  }

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
        toast.info(`Your application number is: ${data.application.applicationNumber}`)
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

  const handleLicenseSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (licenseNumber.trim()) {
      fetchProfile(licenseNumber.trim())
    } else {
      toast.error("Please enter a license number")
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-500",
      approved: "bg-green-500/20 text-green-500",
      rejected: "bg-red-500/20 text-red-500",
      active: "bg-green-500/20 text-green-500",
      completed: "bg-green-500/20 text-green-500",
      cancelled: "bg-red-500/20 text-red-500"
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status as keyof typeof colors] || "bg-muted"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Animations */}
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
              Driver Dashboard
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Manage your driving career with ease
            </motion.p>
          </motion.div>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: UserPlus, title: "Join as Driver", desc: "Apply to become verified", tab: "apply" },
              { icon: Wallet, title: "My Wallet", desc: "Check earnings", tab: "wallet" },
              { icon: User, title: "My Profile", desc: "View driver details", tab: "profile" },
              { icon: Route, title: "My Rides", desc: "Review ride history", tab: "rides" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.6 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  transition: { type: "spring", stiffness: 400 }
                }}
                onClick={() => setActiveTab(item.tab)}
              >
                <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer relative overflow-hidden group h-full">
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <CardContent className="p-6 text-center relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tabs with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="apply" className="transition-all duration-300">Apply</TabsTrigger>
                <TabsTrigger value="wallet" className="transition-all duration-300">Wallet</TabsTrigger>
                <TabsTrigger value="profile" className="transition-all duration-300">Profile</TabsTrigger>
                <TabsTrigger value="rides" className="transition-all duration-300">Rides</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="apply">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                      <CardHeader>
                        <CardTitle>Become a Verified Bus Mate Driver</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            {[
                              { id: "name", label: "Full Name", type: "text" },
                              { id: "contact", label: "Contact Number", type: "tel" },
                            ].map((field, index) => (
                              <motion.div
                                key={field.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Label htmlFor={field.id}>{field.label}</Label>
                                <Input 
                                  id={field.id} 
                                  name={field.id} 
                                  type={field.type}
                                  required 
                                  className="transition-all duration-300 focus:scale-[1.02]"
                                />
                              </motion.div>
                            ))}

                            <motion.div 
                              className="md:col-span-2"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Label htmlFor="address">Address</Label>
                              <Textarea 
                                id="address" 
                                name="address" 
                                rows={3} 
                                required 
                                className="transition-all duration-300 focus:scale-[1.01]"
                              />
                            </motion.div>

                            {[
                              { id: "city", label: "City" },
                              { id: "district", label: "District" },
                              { id: "license", label: "License Number" },
                            ].map((field, index) => (
                              <motion.div
                                key={field.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                              >
                                <Label htmlFor={field.id}>{field.label}</Label>
                                <Input 
                                  id={field.id} 
                                  name={field.id} 
                                  required 
                                  className="transition-all duration-300 focus:scale-[1.02]"
                                />
                              </motion.div>
                            ))}

                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 }}
                            >
                              <Label htmlFor="vehicle">Vehicle Type</Label>
                              <Select name="vehicle" required>
                                <SelectTrigger className="transition-all duration-300 hover:border-primary/50">
                                  <SelectValue placeholder="Select vehicle type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bus">Bus</SelectItem>
                                  <SelectItem value="e-rickshaw">E-Rickshaw</SelectItem>
                                </SelectContent>
                              </Select>
                            </motion.div>

                            {[
                              { id: "bloodGroup", label: "Blood Group" },
                              { id: "email", label: "Email (Optional)", type: "email" },
                            ].map((field, index) => (
                              <motion.div
                                key={field.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                              >
                                <Label htmlFor={field.id}>{field.label}</Label>
                                <Input 
                                  id={field.id} 
                                  name={field.id} 
                                  type={field.type || "text"}
                                  required={field.id !== "email"}
                                  className="transition-all duration-300 focus:scale-[1.02]"
                                />
                              </motion.div>
                            ))}

                            <motion.div 
                              className="md:col-span-2"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.9 }}
                            >
                              <Label htmlFor="idUpload">Upload Vehicle ID/License</Label>
                              <Input 
                                id="idUpload" 
                                name="idUpload" 
                                type="file" 
                                accept="image/*,.pdf" 
                                required 
                                className="transition-all duration-300 hover:border-primary/50"
                              />
                            </motion.div>
                          </div>

                          <motion.div 
                            className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 }}
                          >
                            <p className="text-sm">
                              <strong>Verification Notice:</strong> All drivers are verified through government ID and local authority checks. Your application will be reviewed within 24-48 hours.
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                          >
                            <Button 
                              type="submit" 
                              className="w-full hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/50" 
                              disabled={isLoading}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {isLoading ? "Submitting..." : "Submit for Verification"}
                            </Button>
                          </motion.div>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="wallet">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                      <CardHeader>
                        <CardTitle>My Wallet</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!profile && (
                          <motion.form 
                            onSubmit={handleLicenseSearch} 
                            className="mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Label htmlFor="walletLicense">Enter License Number to View Wallet</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id="walletLicense"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                placeholder="e.g., DL1420180012345"
                                className="transition-all duration-300 focus:scale-[1.01]"
                              />
                              <Button 
                                type="submit" 
                                disabled={loadingProfile}
                                className="hover:scale-105 transition-transform"
                              >
                                {loadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                              </Button>
                            </div>
                          </motion.form>
                        )}

                        {loadingWallet ? (
                          <div className="flex justify-center items-center py-12">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 className="h-8 w-8 text-primary" />
                            </motion.div>
                          </div>
                        ) : wallet ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            {[
                              { label: "Total Earnings", value: formatCurrency(wallet.totalEarnings) },
                              { label: "Pending Payouts", value: formatCurrency(wallet.pendingPayouts) },
                              { 
                                label: "Last Payout", 
                                value: wallet.lastPayoutAmount ? formatCurrency(wallet.lastPayoutAmount) : "N/A",
                                extra: wallet.lastPayoutDate ? `on ${formatDate(wallet.lastPayoutDate)}` : null
                              },
                              { label: "Status", value: wallet.status, isBadge: true },
                            ].map((item, index) => (
                              <motion.div
                                key={item.label}
                                className="bg-muted/50 rounded-lg p-4 relative overflow-hidden group"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                                  initial={{ x: "-100%" }}
                                  whileHover={{ x: "100%" }}
                                  transition={{ duration: 0.6 }}
                                />
                                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                                <p className="text-lg font-bold">
                                  {item.isBadge ? getStatusBadge(item.value) : item.value}
                                  {item.extra && (
                                    <span className="text-sm font-normal text-muted-foreground block">
                                      {item.extra}
                                    </span>
                                  )}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        ) : profile ? (
                          <motion.p 
                            className="text-center text-muted-foreground py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            No wallet found for this driver. Wallet will be created after first approved ride.
                          </motion.p>
                        ) : (
                          <motion.p 
                            className="text-center text-muted-foreground py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Enter your license number to view wallet information
                          </motion.p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="profile">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                      <CardHeader>
                        <CardTitle>My Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!profile && (
                          <motion.form 
                            onSubmit={handleLicenseSearch} 
                            className="mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Label htmlFor="profileLicense">Enter License Number to View Profile</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id="profileLicense"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                placeholder="e.g., DL1420180012345"
                                className="transition-all duration-300 focus:scale-[1.01]"
                              />
                              <Button 
                                type="submit" 
                                disabled={loadingProfile}
                                className="hover:scale-105 transition-transform"
                              >
                                {loadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                              </Button>
                            </div>
                          </motion.form>
                        )}

                        {loadingProfile ? (
                          <div className="flex justify-center items-center py-12">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 className="h-8 w-8 text-primary" />
                            </motion.div>
                          </div>
                        ) : profile ? (
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-1">Name</p>
                                <p className="font-semibold">{profile.name}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-1">License Number</p>
                                <p className="font-semibold">{profile.license}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-1">Vehicle Type</p>
                                <p className="font-semibold capitalize">{profile.vehicle}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-1">Contact</p>
                                <p className="font-semibold">{profile.contact}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-1">Blood Group</p>
                                <p className="font-semibold">{profile.bloodGroup}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-1">Status</p>
                                <p className="font-semibold">{getStatusBadge(profile.status)}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-4 md:col-span-2">
                                <p className="text-sm text-muted-foreground mb-1">Address</p>
                                <p className="font-semibold">{profile.address}, {profile.city}, {profile.district}</p>
                              </div>
                              {profile.email && (
                                <div className="bg-muted/50 rounded-lg p-4 md:col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                                  <p className="font-semibold">{profile.email}</p>
                                </div>
                              )}
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-1">Application Number</p>
                                <p className="font-semibold">{profile.applicationNumber}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-1">Applied Date</p>
                                <p className="font-semibold">{formatDate(profile.appliedDate)}</p>
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => {
                                setProfile(null)
                                setWallet(null)
                                setRides([])
                                setLicenseNumber("")
                              }}
                              variant="outline"
                              className="w-full"
                            >
                              Search Another Driver
                            </Button>
                          </div>
                        ) : (
                          <motion.p 
                            className="text-center text-muted-foreground py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Enter your license number to view your profile
                          </motion.p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="rides">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                      <CardHeader>
                        <CardTitle>My Rides</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!profile && (
                          <motion.form 
                            onSubmit={handleLicenseSearch} 
                            className="mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Label htmlFor="ridesLicense">Enter License Number to View Rides</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id="ridesLicense"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                placeholder="e.g., DL1420180012345"
                                className="transition-all duration-300 focus:scale-[1.01]"
                              />
                              <Button 
                                type="submit" 
                                disabled={loadingProfile}
                                className="hover:scale-105 transition-transform"
                              >
                                {loadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                              </Button>
                            </div>
                          </motion.form>
                        )}

                        {loadingRides ? (
                          <div className="flex justify-center items-center py-12">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 className="h-8 w-8 text-primary" />
                            </motion.div>
                          </div>
                        ) : rides.length > 0 ? (
                          <div className="space-y-4">
                            {rides.map((ride) => (
                              <div key={ride.id} className="bg-muted/50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <p className="font-semibold">Ride #{ride.rideNumber}</p>
                                      {getStatusBadge(ride.status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      <strong>Date:</strong> {formatDate(ride.date)}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      <strong>Route:</strong> {ride.route}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Passengers:</strong> {ride.passengerCount}
                                    </p>
                                  </div>
                                  <p className="font-bold text-primary text-lg">{formatCurrency(ride.fare)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : profile ? (
                          <motion.p 
                            className="text-center text-muted-foreground py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            No rides found. Start driving to see your ride history here!
                          </motion.p>
                        ) : (
                          <motion.p 
                            className="text-center text-muted-foreground py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Enter your license number to view your ride history
                          </motion.p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}