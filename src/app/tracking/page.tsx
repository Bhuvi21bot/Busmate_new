"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BusTracker from "@/components/BusTracker"
import { MapPin } from "lucide-react"

export default function TrackingPage() {
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
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Live Bus Tracking</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Track your bus in real-time and never miss your ride
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Map Placeholder */}
            <div className="mb-8 h-96 bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border/50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  Real-time bus locations would appear here
                </p>
              </div>
            </div>

            <BusTracker />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
