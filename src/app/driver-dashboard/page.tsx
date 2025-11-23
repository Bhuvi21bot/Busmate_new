"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Wallet, User, Route, Upload, Loader2, Bus, DollarSign, Clock, CreditCard, CheckCircle, FileText } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import { useSession } from "@/lib/auth-client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import ClickSpark from "@/components/ClickSpark"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// All existing interfaces and types are preserved as in initial code

export default function DriverDashboard() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Dock items
  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <VscCalendar size={20} />, label: 'Booking', onClick: () => router.push('/booking') },
    { icon: <Wallet size={20} />, label: 'My Wallet', onClick: () => router.push('/driver-dashboard?tab=wallet') },
  ]

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("apply")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [rcFile, setRcFile] = useState<File | null>(null)

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
        setShowSuccess(true)
        toast.success("Application submitted successfully!")
        toast.info(`Your application number is: ${data.application.applicationNumber}`)
        e.currentTarget.reset()
        setLicenseFile(null)
        setRcFile(null)

        // Scroll to success message
        setTimeout(() => {
          document.getElementById('successMessage')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
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
    <ClickSpark
      sparkColor="#4ade80"
      sparkSize={12}
      sparkRadius={25}
      sparkCount={12}
      duration={600}
    >
      <div className="min-h-screen bg-background">
        <Header />

        {/* ... rest of the page content stays the same ... */}

        <Footer />

        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </ClickSpark>
  )
}