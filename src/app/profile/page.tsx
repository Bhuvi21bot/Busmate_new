"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { User, Wallet, Settings, Edit, Save, X, Loader2, Bell, Mail, Smartphone, Plus, Download, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, FileText, Bus, Star, MessageSquare, ThumbsUp } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ClickSpark from "@/components/ClickSpark"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CustomerProfile {
  id: number
  userId: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  emergencyContact: string | null
  emergencyContactName: string | null
  createdAt: string
  updatedAt: string
}

interface CustomerWallet {
  id: number
  userId: string
  balance: number
  totalSpent: number
  totalAdded: number
  status: string
  createdAt: string
  updatedAt: string
}

interface WalletTransaction {
  id: number
  userId: string
  walletId: number
  type: 'add_money' | 'ride_payment' | 'refund' | 'bonus'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string
  referenceNumber: string
  bookingId: number | null
  paymentMethod: string | null
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

interface CustomerSettings {
  id: number
  userId: string
  notificationsEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  rideReminders: boolean
  promotionalEmails: boolean
  language: string
  theme: string
  createdAt: string
  updatedAt: string
}

interface CustomerReview {
  id: number
  driverId: number
  rating: number
  comment: string | null
  rideId: number | null
  createdAt: string
  updatedAt: string
  driver: {
    name: string
    vehicle: string
    license: string
  }
}

interface Driver {
  id: number
  name: string
  vehicle: string
  license: string
  rating?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending } = useSession()

  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [wallet, setWallet] = useState<CustomerWallet | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [settings, setSettings] = useState<CustomerSettings | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(false)
  
  // Review states
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    driverId: "",
    rating: 5,
    comment: ""
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  // Edit mode states
  const [editMode, setEditMode] = useState(false)
  const [profileForm, setProfileForm] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyContactName: ""
  })
  const [savingProfile, setSavingProfile] = useState(false)

  // Add money dialog state
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false)
  const [addMoneyAmount, setAddMoneyAmount] = useState("")
  const [addingMoney, setAddingMoney] = useState(false)
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false)

  // Set active tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'wallet', 'settings', 'reviews'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/profile")
    }
  }, [session, isPending, router])

  // Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      setRazorpayScriptLoaded(true)
    }
    script.onerror = () => {
      toast.error("Failed to load payment gateway")
    }
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  // Fetch all data when session is ready
  useEffect(() => {
    if (session?.user) {
      fetchProfile()
      fetchWallet()
      fetchTransactions()
      fetchSettings()
      fetchReviews()
      fetchDrivers()
    }
  }, [session])

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
  const fetchProfile = async () => {
    setLoadingProfile(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (response.ok) {
        setProfile(data)
        setProfileForm({
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          emergencyContact: data.emergencyContact || "",
          emergencyContactName: data.emergencyContactName || ""
        })
      } else {
        if (data.code === 'PROFILE_NOT_FOUND') {
          // Profile doesn't exist yet - this is okay for new users
          setProfile(null)
        } else {
          toast.error(data.error || "Failed to fetch profile")
        }
      }
    } catch (error) {
      toast.error("Failed to fetch profile")
    } finally {
      setLoadingProfile(false)
    }
  }

  const fetchWallet = async () => {
    setLoadingWallet(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setWallet(data)
      }
    } catch (error) {
      console.error("Failed to fetch wallet")
    } finally {
      setLoadingWallet(false)
    }
  }

  const fetchTransactions = async () => {
    setLoadingTransactions(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/wallet/transactions?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setTransactions(data)
      }
    } catch (error) {
      console.error("Failed to fetch transactions")
    } finally {
      setLoadingTransactions(false)
    }
  }

  const fetchSettings = async () => {
    setLoadingSettings(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch settings")
    } finally {
      setLoadingSettings(false)
    }
  }

  // Fetch customer reviews
  const fetchReviews = async () => {
    setLoadingReviews(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setReviews(data.reviews)
      } else {
        console.error("Failed to fetch reviews:", data.error)
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setLoadingReviews(false)
    }
  }

  // Fetch approved drivers
  const fetchDrivers = async () => {
    setLoadingDrivers(true)
    try {
      const response = await fetch('/api/drivers?status=approved&limit=100')
      const data = await response.json()
      if (response.ok && data.success) {
        setDrivers(data.drivers)
      } else {
        console.error("Failed to fetch drivers:", data.error)
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error)
    } finally {
      setLoadingDrivers(false)
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Profile updated successfully!")
        setProfile(data)
        setEditMode(false)
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred while updating profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAddMoney = async () => {
    const amount = parseFloat(addMoneyAmount)
    if (isNaN(amount) || amount < 100) {
      toast.error("Please enter a valid amount (minimum ₹100)")
      return
    }

    if (!razorpayScriptLoaded) {
      toast.error("Payment gateway is loading. Please try again.")
      return
    }

    setAddingMoney(true)
    try {
      const token = localStorage.getItem("bearer_token")
      
      // Create Razorpay order
      const orderResponse = await fetch('/api/razorpay/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          notes: {
            userId: session?.user?.id,
            description: 'Wallet recharge'
          }
        })
      })

      const orderData = await orderResponse.json()
      
      if (!orderResponse.ok || !orderData.success) {
        toast.error(orderData.error || "Failed to create payment order")
        setAddingMoney(false)
        return
      }

      // Configure Razorpay checkout
      const options = {
        key: orderData.keyId,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bus Mate",
        description: "Add money to wallet",
        image: "/logo.png",
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#4ade80"
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Add money to wallet after successful payment verification
              const walletResponse = await fetch('/api/customers/wallet/add-money', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  amount,
                  description: `Added via Razorpay - Payment ID: ${response.razorpay_payment_id}`,
                  paymentMethod: 'razorpay'
                })
              })

              const walletData = await walletResponse.json()
              
              if (walletResponse.ok) {
                toast.success(`₹${amount} added successfully!`)
                setShowAddMoneyDialog(false)
                setAddMoneyAmount("")
                fetchWallet()
                fetchTransactions()
              } else {
                toast.error(walletData.error || "Failed to update wallet")
              }
            } else {
              toast.error("Payment verification failed")
            }
          } catch (error) {
            toast.error("An error occurred while processing payment")
          } finally {
            setAddingMoney(false)
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled")
            setAddingMoney(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error("An error occurred while initiating payment")
      setAddingMoney(false)
    }
  }

  const handleUpdateSettings = async (updatedSettings: Partial<CustomerSettings>) => {
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedSettings)
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Settings updated successfully!")
        setSettings(data)
      } else {
        toast.error(data.error || "Failed to update settings")
      }
    } catch (error) {
      toast.error("An error occurred while updating settings")
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewForm.driverId) {
      toast.error("Please select a driver")
      return
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast.error("Rating must be between 1 and 5")
      return
    }

    setSubmittingReview(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/drivers/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          driverId: parseInt(reviewForm.driverId),
          customerId: session?.user?.id,
          customerName: session?.user?.name || "Anonymous",
          rating: reviewForm.rating,
          comment: reviewForm.comment || null,
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Review submitted successfully!")
        setReviewForm({ driverId: "", rating: 5, comment: "" })
        fetchReviews() // Refresh reviews list
      } else {
        toast.error(data.error || "Failed to submit review")
      }
    } catch (error) {
      toast.error("An error occurred while submitting review")
    } finally {
      setSubmittingReview(false)
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-500",
      completed: "bg-green-500/20 text-green-500",
      failed: "bg-red-500/20 text-red-500",
      active: "bg-green-500/20 text-green-500"
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status as keyof typeof colors] || "bg-muted"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'add_money':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case 'ride_payment':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />
      case 'bonus':
        return <TrendingUp className="h-4 w-4 text-primary" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <ClickSpark
      sparkColor="#4ade80"
      sparkSize={12}
      sparkRadius={25}
      sparkCount={12}
      duration={600}
    >
      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">My Account</h1>

              <div className="space-y-6">
                {/* Profile Header Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`} />
                        <AvatarFallback className="text-2xl">{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">{session.user.name}</h2>
                        <p className="text-muted-foreground mb-1">{session.user.email}</p>
                        {profile?.phone && (
                          <p className="text-sm text-muted-foreground">{profile.phone}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">
                      <User className="h-4 w-4 mr-2" />
                      Personal Details
                    </TabsTrigger>
                    <TabsTrigger value="wallet">
                      <Wallet className="h-4 w-4 mr-2" />
                      My Wallet
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                    <TabsTrigger value="reviews">
                      <Star className="h-4 w-4 mr-2" />
                      Reviews
                    </TabsTrigger>
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Personal Information</CardTitle>
                          {!editMode ? (
                            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => {
                                setEditMode(false)
                                if (profile) {
                                  setProfileForm({
                                    phone: profile.phone || "",
                                    address: profile.address || "",
                                    city: profile.city || "",
                                    state: profile.state || "",
                                    pincode: profile.pincode || "",
                                    emergencyContact: profile.emergencyContact || "",
                                    emergencyContactName: profile.emergencyContactName || ""
                                  })
                                }
                              }}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile}>
                                {savingProfile ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4 mr-2" />
                                )}
                                Save
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {loadingProfile ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input value={session.user.name || ""} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input value={session.user.email || ""} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone Number</Label>
                              <Input
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                disabled={!editMode}
                                placeholder="Enter your phone number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>PIN Code</Label>
                              <Input
                                value={profileForm.pincode}
                                onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                                disabled={!editMode}
                                placeholder="Enter PIN code"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Address</Label>
                              <Textarea
                                value={profileForm.address}
                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                disabled={!editMode}
                                rows={3}
                                placeholder="Enter your complete address"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                disabled={!editMode}
                                placeholder="Enter city"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Input
                                value={profileForm.state}
                                onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                                disabled={!editMode}
                                placeholder="Enter state"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Emergency Contact</Label>
                              <Input
                                value={profileForm.emergencyContact}
                                onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                                disabled={!editMode}
                                placeholder="Emergency contact number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Emergency Contact Name</Label>
                              <Input
                                value={profileForm.emergencyContactName}
                                onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                                disabled={!editMode}
                                placeholder="Emergency contact person name"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Wallet Tab */}
                  <TabsContent value="wallet" className="space-y-6">
                    {/* Wallet Balance Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(wallet?.balance || 0)}</div>
                          <p className="text-xs text-muted-foreground mt-2">Available for rides</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-orange-500">
                            {formatCurrency(wallet?.totalSpent || 0)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Lifetime spending</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Added</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-500">
                            {formatCurrency(wallet?.totalAdded || 0)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Lifetime deposits</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button onClick={() => setShowAddMoneyDialog(true)} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Money
                      </Button>
                    </div>

                    {/* Transaction History */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Your recent wallet transactions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingTransactions ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : transactions.length === 0 ? (
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No transactions yet</p>
                            <p className="text-sm text-muted-foreground mt-2">Add money to get started</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {transactions.map((transaction) => (
                              <div
                                key={transaction.id}
                                className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-1">{getTransactionIcon(transaction.type)}</div>
                                  <div>
                                    <p className="font-medium">{transaction.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {formatDateTime(transaction.createdAt)}
                                    </p>
                                    {transaction.bookingId && (
                                      <p className="text-xs text-primary mt-1">
                                        Booking ID: #{transaction.bookingId}
                                      </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Ref: {transaction.referenceNumber}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold ${
                                    transaction.type === 'add_money' || transaction.type === 'refund' || transaction.type === 'bonus'
                                      ? 'text-green-500'
                                      : 'text-red-500'
                                  }`}>
                                    {transaction.type === 'add_money' || transaction.type === 'refund' || transaction.type === 'bonus' ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Balance: {formatCurrency(transaction.balanceAfter)}
                                  </p>
                                  {getStatusBadge(transaction.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6">
                    {loadingSettings ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        {/* Notifications Settings */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage your notification preferences</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Push Notifications</p>
                                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.notificationsEnabled}
                                onCheckedChange={(checked) => handleUpdateSettings({ notificationsEnabled: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Email Notifications</p>
                                  <p className="text-sm text-muted-foreground">Receive email updates</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.emailNotifications}
                                onCheckedChange={(checked) => handleUpdateSettings({ emailNotifications: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">SMS Notifications</p>
                                  <p className="text-sm text-muted-foreground">Receive SMS alerts</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.smsNotifications}
                                onCheckedChange={(checked) => handleUpdateSettings({ smsNotifications: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Ride Reminders</p>
                                  <p className="text-sm text-muted-foreground">Get reminders for upcoming rides</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.rideReminders}
                                onCheckedChange={(checked) => handleUpdateSettings({ rideReminders: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Promotional Emails</p>
                                  <p className="text-sm text-muted-foreground">Receive offers and promotions</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.promotionalEmails}
                                onCheckedChange={(checked) => handleUpdateSettings({ promotionalEmails: checked })}
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Appearance Settings */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize your app appearance</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <Label>Theme</Label>
                              <Select
                                value={settings?.theme}
                                onValueChange={(value) => handleUpdateSettings({ theme: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Language</Label>
                              <Select
                                value={settings?.language}
                                onValueChange={(value) => handleUpdateSettings({ language: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="hi">Hindi</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="space-y-6">
                    {/* Submit New Review */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Rate a Driver</CardTitle>
                        <CardDescription>Share your experience with our drivers</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>Select Driver</Label>
                          <Select
                            value={reviewForm.driverId}
                            onValueChange={(value) => setReviewForm({ ...reviewForm, driverId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a driver..." />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingDrivers ? (
                                <div className="p-4 text-center">
                                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                </div>
                              ) : drivers.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  No drivers available
                                </div>
                              ) : (
                                drivers.map((driver) => (
                                  <SelectItem key={driver.id} value={driver.id.toString()}>
                                    {driver.name} - {driver.vehicle}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Your Rating</Label>
                          <div className="flex items-center gap-3">
                            {renderStars(reviewForm.rating, true, (rating) => 
                              setReviewForm({ ...reviewForm, rating })
                            )}
                            <span className="text-sm text-muted-foreground">
                              ({reviewForm.rating} out of 5 stars)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Your Review (Optional)</Label>
                          <Textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Share your experience with this driver..."
                            rows={4}
                          />
                        </div>

                        <Button 
                          onClick={handleSubmitReview} 
                          disabled={submittingReview || !reviewForm.driverId}
                          className="w-full"
                        >
                          {submittingReview ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Submit Review
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* My Reviews History */}
                    <Card>
                      <CardHeader>
                        <CardTitle>My Reviews</CardTitle>
                        <CardDescription>Your previously submitted driver reviews</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingReviews ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : reviews.length === 0 ? (
                          <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No reviews submitted yet</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Rate a driver above to share your experience
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {reviews.map((review) => (
                              <div
                                key={review.id}
                                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                                      <AvatarFallback>
                                        {review.driver.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h4 className="font-semibold">{review.driver.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {review.driver.vehicle}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    {renderStars(review.rating)}
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {formatDateTime(review.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                
                                {review.comment && (
                                  <div className="bg-muted/30 rounded-lg p-3 mt-3">
                                    <p className="text-sm italic">"{review.comment}"</p>
                                  </div>
                                )}
                                
                                {review.rideId && (
                                  <p className="text-xs text-primary mt-2">
                                    Ride ID: #{review.rideId}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Add Money Dialog */}
        <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
              <DialogDescription>
                Enter the amount you want to add. Payment will be processed securely via Razorpay.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (min ₹100)"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  min="100"
                  disabled={addingMoney}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum amount: ₹100
                </p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <p className="text-sm font-medium">Payment Methods Available:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✓ UPI (Google Pay, PhonePe, Paytm)</p>
                  <p>✓ Credit/Debit Cards</p>
                  <p>✓ Net Banking</p>
                  <p>✓ Wallets</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddMoneyDialog(false)
                  setAddMoneyAmount("")
                }}
                disabled={addingMoney}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddMoney} 
                disabled={addingMoney || !razorpayScriptLoaded}
              >
                {addingMoney ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : !razorpayScriptLoaded ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Gateway...
                  </>
                ) : (
                  "Proceed to Pay"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </ClickSpark>
  )
}