"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Bus, Ticket, Navigation } from "lucide-react"
import { VscHome } from "react-icons/vsc"
import { useSession } from "@/lib/auth-client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import ClickSpark from "@/components/ClickSpark"
import BusTracker from "@/components/BusTracker"
import GoogleMapTracker from "@/components/GoogleMapTracker"
import ShinyText from "@/components/ShinyText"

export default function TrackingPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Dock items
  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <Ticket size={20} />, label: 'Book Ticket', onClick: () => router.push('/booking') },
    { icon: <Navigation size={20} />, label: 'Vehicle Near By Me', onClick: () => router.push('/vehicles') },
  ]

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/tracking")
    }
  }, [session, isPending, router])

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="relative">
          {/* Simplified loading animation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 border-2 border-primary/30 border-t-primary rounded-full" />
          </motion.div>

          {/* Pulsing bus icon in center */}
          <motion.div
            className="relative z-10 flex items-center justify-center w-20 h-20"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bus className="h-10 w-10 text-primary" />
          </motion.div>
        </div>

        <div className="mt-8">
          <ShinyText 
            text="please wait.." 
            speed={3}
            className="text-2xl font-semibold"
          />
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!session?.user) {
    return null
  }

  return (
    <ClickSpark
      sparkColor="#4ade80"
      sparkSize={10}
      sparkRadius={20}
      sparkCount={8}
      duration={500}
    >
      <div className="min-h-screen bg-background">
        <Header />

        <section className="relative py-20 overflow-hidden">
          {/* Simplified background - static gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

          {/* Single animated circle for depth - reduced complexity */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="h-8 w-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent">
                  Live Bus Tracking
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Track buses near ABES Institute of Technology in real-time
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              {/* Google Map with Real Location */}
              <div className="mb-8">
                <GoogleMapTracker />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <BusTracker />
              </motion.div>
            </motion.div>
          </div>
        </section>

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