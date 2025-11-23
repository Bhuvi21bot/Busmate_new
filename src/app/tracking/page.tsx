"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Bus, Wallet, Ticket, Navigation } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import { useSession } from "@/lib/auth-client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import ClickSpark from "@/components/ClickSpark"
import BusTracker from "@/components/BusTracker"

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

          {/* Animated circles for depth */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.div 
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <MapPin className="h-8 w-8 text-primary" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent">
                  Live Bus Tracking
                </h1>
              </motion.div>
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Track your bus in real-time and never miss your ride
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Map Placeholder with Animation */}
              <motion.div 
                className="mb-8 h-96 bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border/50 flex items-center justify-center relative overflow-hidden group"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                />

                {/* Pulsing location markers */}
                <motion.div
                  className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                
                <div className="text-center relative z-10">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <p className="text-lg font-semibold">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">
                    Real-time bus locations would appear here
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
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