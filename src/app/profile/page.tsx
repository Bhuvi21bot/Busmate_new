"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { User, Wallet, Settings, Edit, Save, X, Loader2, Bell, Mail, Smartphone, Shield, Plus, Download, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, FileText, Bus } from "lucide-react"
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
  createdAt: string
  updatedAt: string
}

interface DriverWallet {
  id: number
  driverId: number
  totalEarnings: number
  pendingPayouts: number
  lastPayoutAmount: number | null
  lastPayoutDate: string | null
  status: string
  createdAt: string
  updatedAt: string
}

interface WalletTransaction {
  id: number
  driverId: number
  walletId: number
  type: 'credit' | 'debit' | 'withdrawal' | 'refund' | 'ride_earning'
  amount: number
  balanceAfter: number
  description: string
  referenceNumber: string
  rideId: number | null
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  ride: {
    rideNumber: string
    date: string
    route: string
    fare: number
    passengerCount: number
    status: string
  } | null
}

interface DriverSettings {
  id: number
  driverId: number
  notificationsEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  autoAcceptRides: boolean
  availabilityStatus: 'available' | 'busy' | 'offline'
  preferredRoutes: string[] | null
  language: string
  theme: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending } = useSession()

  const [activeTab, setActiveTab] = useState("profile")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [profile, setProfile] = useState<DriverProfile | null>(null)
  const [wallet, setWallet] = useState<DriverWallet | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [settings, setSettings] = useState<DriverSettings | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(false)

  // Edit mode states
  const [editMode, setEditMode] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    district: ""
  })
  const [savingProfile, setSavingProfile] = useState(false)

  // Add money dialog state
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false)
  const [addMoneyAmount, setAddMoneyAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [addingMoney, setAddingMoney] = useState(false)

  // Withdraw money dialog state
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: ""
  })
  const [withdrawing, setWithdrawing] = useState(false)

  // Set active tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'wallet', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/profile")
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
        setProfileForm({
          name: data.name,
          contact: data.contact,
          email: data.email || "",
          address: data.address,
          city: data.city,
          district: data.district
        })
        if (data.id) {
          fetchWallet(data.id)
          fetchTransactions(data.id)
          fetchSettings(data.id)
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

  const fetchWallet = async (driverId: number) => {
    setLoadingWallet(true)
    try {
      const response = await fetch(`/api/drivers/wallet?driverId=${driverId}`)
      const data = await response.json()
      if (response.ok) {
        setWallet(data)
      } else {
        setWallet(null)
      }
    } catch (error) {
      setWallet(null)
    } finally {
      setLoadingWallet(false)
    }
  }

  const fetchTransactions = async (driverId: number) => {
    setLoadingTransactions(true)
    try {
      const response = await fetch(`/api/drivers/wallet/transactions?driverId=${driverId}&limit=50`)
      const data = await response.json()
      if (response.ok) {
        setTransactions(data)
      } else {
        setTransactions([])
      }
    } catch (error) {
      setTransactions([])
    } finally {
      setLoadingTransactions(false)
    }
  }

  const fetchSettings = async (driverId: number) => {
    setLoadingSettings(true)
    try {
      const response = await fetch(`/api/drivers/settings?driverId=${driverId}`)
      const data = await response.json()
      if (response.ok) {
        setSettings(data)
      } else {
        setSettings(null)
      }
    } catch (error) {
      setSettings(null)
    } finally {
      setLoadingSettings(false)
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

  const handleSaveProfile = async () => {
    if (!profile?.id) return

    setSavingProfile(true)
    try {
      const response = await fetch('/api/drivers/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: profile.id,
          ...profileForm
        })
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
    if (!profile?.id) return
    
    const amount = parseFloat(addMoneyAmount)
    if (isNaN(amount) || amount < 100) {
      toast.error("Please enter a valid amount (minimum ₹100)")
      return
    }

    setAddingMoney(true)
    try {
      const response = await fetch('/api/drivers/wallet/add-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: profile.id,
          amount,
          description: `Added money via ${paymentMethod.toUpperCase()}`,
          paymentMethod
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(`₹${amount} added successfully!`)
        setShowAddMoneyDialog(false)
        setAddMoneyAmount("")
        fetchWallet(profile.id)
        fetchTransactions(profile.id)
      } else {
        toast.error(data.error || "Failed to add money")
      }
    } catch (error) {
      toast.error("An error occurred while adding money")
    } finally {
      setAddingMoney(false)
    }
  }

  const handleWithdraw = async () => {
    if (!profile?.id) return
    
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount < 500) {
      toast.error("Please enter a valid amount (minimum ₹500)")
      return
    }

    if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
      toast.error("Please fill in all bank details")
      return
    }

    setWithdrawing(true)
    try {
      const response = await fetch('/api/drivers/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: profile.id,
          amount,
          bankDetails
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Withdrawal request submitted successfully!")
        toast.info("Your withdrawal will be processed within 2-3 business days")
        setShowWithdrawDialog(false)
        setWithdrawAmount("")
        setBankDetails({ accountNumber: "", ifscCode: "", accountHolderName: "", bankName: "" })
        fetchWallet(profile.id)
        fetchTransactions(profile.id)
      } else {
        toast.error(data.error || "Failed to process withdrawal")
      }
    } catch (error) {
      toast.error("An error occurred while processing withdrawal")
    } finally {
      setWithdrawing(false)
    }
  }

  const handleUpdateSettings = async (updatedSettings: Partial<DriverSettings>) => {
    if (!profile?.id) return

    try {
      const response = await fetch('/api/drivers/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: profile.id,
          settings: updatedSettings
        })
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
      approved: "bg-green-500/20 text-green-500",
      rejected: "bg-red-500/20 text-red-500",
      active: "bg-green-500/20 text-green-500",
      completed: "bg-green-500/20 text-green-500",
      cancelled: "bg-red-500/20 text-red-500",
      failed: "bg-red-500/20 text-red-500"
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status as keyof typeof colors] || "bg-muted"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case 'debit':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />
      case 'ride_earning':
        return <TrendingUp className="h-4 w-4 text-primary" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
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
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">My Profile</h1>

              {/* Search Profile Section */}
              {!profile && (
                <Card className="max-w-2xl mx-auto mb-8">
                  <CardHeader>
                    <CardTitle>Search Your Profile</CardTitle>
                    <CardDescription>Enter your license number to view your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLicenseSearch} className="flex gap-4">
                      <Input
                        placeholder="Enter license number"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={loadingProfile}>
                        {loadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Profile Content */}
              {profile && (
                <div className="space-y-6">
                  {/* Profile Header Card */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                          <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold">{profile.name}</h2>
                            {getStatusBadge(profile.status)}
                          </div>
                          <p className="text-muted-foreground mb-1">{profile.vehicle} Driver</p>
                          <p className="text-sm text-muted-foreground">License: {profile.license}</p>
                          <p className="text-sm text-muted-foreground">Application: {profile.applicationNumber}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProfile(null)
                            setWallet(null)
                            setTransactions([])
                            setSettings(null)
                            setLicenseNumber("")
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Change Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger value="wallet">
                        <Wallet className="h-4 w-4 mr-2" />
                        Wallet
                      </TabsTrigger>
                      <TabsTrigger value="settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
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
                                  setProfileForm({
                                    name: profile.name,
                                    contact: profile.contact,
                                    email: profile.email || "",
                                    address: profile.address,
                                    city: profile.city,
                                    district: profile.district
                                  })
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
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                disabled={!editMode}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Contact Number</Label>
                              <Input
                                value={profileForm.contact}
                                onChange={(e) => setProfileForm({ ...profileForm, contact: e.target.value })}
                                disabled={!editMode}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                disabled={!editMode}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Blood Group</Label>
                              <Input value={profile.bloodGroup} disabled />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Address</Label>
                              <Textarea
                                value={profileForm.address}
                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                disabled={!editMode}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                disabled={!editMode}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>District</Label>
                              <Input
                                value={profileForm.district}
                                onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                                disabled={!editMode}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Wallet Tab */}
                    <TabsContent value="wallet" className="space-y-6">
                      {/* Wallet Balance Cards */}
                      <div className="grid md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">{formatCurrency(wallet?.totalEarnings || 0)}</div>
                            {wallet?.lastPayoutDate && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Last payout: {formatDate(wallet.lastPayoutDate)}
                              </p>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-orange-500">
                              {formatCurrency(wallet?.pendingPayouts || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Processing withdrawals</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Last Payout</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-green-500">
                              {formatCurrency(wallet?.lastPayoutAmount || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Previous withdrawal</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <Button onClick={() => setShowAddMoneyDialog(true)} className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Money
                        </Button>
                        <Button onClick={() => setShowWithdrawDialog(true)} variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Withdraw
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
                                      {transaction.ride && (
                                        <p className="text-xs text-primary mt-1">
                                          Ride: {transaction.ride.rideNumber} - {transaction.ride.route}
                                        </p>
                                      )}
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Ref: {transaction.referenceNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className={`font-bold ${
                                      transaction.type === 'credit' || transaction.type === 'refund' || transaction.type === 'ride_earning'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }`}>
                                      {transaction.type === 'credit' || transaction.type === 'refund' || transaction.type === 'ride_earning' ? '+' : '-'}
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
                            </CardContent>
                          </Card>

                          {/* Ride Settings */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Ride Preferences</CardTitle>
                              <CardDescription>Configure your ride settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Shield className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">Auto Accept Rides</p>
                                    <p className="text-sm text-muted-foreground">Automatically accept incoming rides</p>
                                  </div>
                                </div>
                                <Switch
                                  checked={settings?.autoAcceptRides}
                                  onCheckedChange={(checked) => handleUpdateSettings({ autoAcceptRides: checked })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Availability Status</Label>
                                <Select
                                  value={settings?.availabilityStatus}
                                  onValueChange={(value) => handleUpdateSettings({ availabilityStatus: value as any })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="busy">Busy</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                  </SelectContent>
                                </Select>
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
                  </Tabs>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Add Money Dialog */}
        <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
              <DialogDescription>Enter the amount you want to add to your wallet</DialogDescription>
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
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddMoneyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMoney} disabled={addingMoney}>
                {addingMoney ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Add Money"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Money Dialog */}
        <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Money</DialogTitle>
              <DialogDescription>Enter withdrawal details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (₹)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount (min ₹500)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  placeholder="Enter account number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc-code">IFSC Code</Label>
                <Input
                  id="ifsc-code"
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-holder">Account Holder Name</Label>
                <Input
                  id="account-holder"
                  placeholder="Enter account holder name"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name (Optional)</Label>
                <Input
                  id="bank-name"
                  placeholder="Enter bank name"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleWithdraw} disabled={withdrawing}>
                {withdrawing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Withdraw"
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