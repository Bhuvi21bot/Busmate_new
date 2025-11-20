"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { useCustomer } from "autumn-js/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { PricingTable } from "@/components/autumn/pricing-table"
import { Check, Zap, Shield, Clock, Star, Users, Gift, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { customer, isLoading } = useCustomer()

  // Redirect authenticated users with plan selection
  useEffect(() => {
    if (session && window.location.search.includes('plan=')) {
      const planRedirect = new URLSearchParams(window.location.search).get('redirect')
      if (!planRedirect) {
        // User is authenticated and trying to select a plan
        // Let them proceed
      }
    }
  }, [session, router])

  const productDetails = [
    {
      id: "free",
      description: "Perfect for occasional travelers testing our platform",
      items: [
        {
          featureId: "bookings",
          primaryText: "10 bookings per month",
          secondaryText: "Book your rides with ease",
        },
        {
          primaryText: "Standard route search",
          secondaryText: "Find buses across all routes",
        },
        {
          primaryText: "View schedules & fares",
          secondaryText: "Real-time schedule information",
        },
        {
          primaryText: "Email support",
          secondaryText: "24-hour response time",
        },
      ],
    },
    {
      id: "premium",
      description: "Best for regular commuters who value convenience",
      recommendText: "Most Popular",
      price: {
        primaryText: "$14.99/month",
        secondaryText: "billed monthly",
      },
      items: [
        {
          featureId: "bookings",
          primaryText: "25 bookings per month",
          secondaryText: "More trips for regular commuters",
        },
        {
          featureId: "seat_selection",
          primaryText: "Seat choice available",
          secondaryText: "Choose your preferred seat",
        },
        {
          featureId: "third_booking_discount",
          primaryText: "10% discount on every 3rd booking",
          secondaryText: "Save money on frequent trips",
        },
        {
          featureId: "ad_free",
          primaryText: "Ad-free experience",
          secondaryText: "Clean, distraction-free interface",
        },
        {
          featureId: "priority_booking",
          primaryText: "Priority booking",
          secondaryText: "Book before other passengers",
        },
        {
          featureId: "real_time_tracking",
          primaryText: "Real-time bus tracking",
          secondaryText: "Live location updates",
        },
        {
          featureId: "live_chat",
          primaryText: "Live chat support",
          secondaryText: "Instant help when you need it",
        },
      ],
    },
    {
      id: "super_premium",
      description: "For frequent travelers who demand the best experience",
      price: {
        primaryText: "$29.99/month",
        secondaryText: "billed monthly",
      },
      items: [
        {
          featureId: "bookings",
          primaryText: "Unlimited bookings",
          secondaryText: "No monthly limits",
        },
        {
          featureId: "multi_passenger",
          primaryText: "Multiple bookings at a time",
          secondaryText: "Book for up to 10 passengers",
        },
        {
          featureId: "express_checkin",
          primaryText: "Express check-in & fast boarding",
          secondaryText: "Skip lines, save time",
        },
        {
          primaryText: "Everything in Premium, plus:",
          secondaryText: "",
        },
        {
          featureId: "early_route_access",
          primaryText: "Early access to new routes",
          secondaryText: "Be the first to try new routes",
        },
        {
          featureId: "concierge_service",
          primaryText: "Concierge booking service",
          secondaryText: "Personal booking assistance",
        },
        {
          featureId: "loyalty_rewards",
          primaryText: "Loyalty rewards & points",
          secondaryText: "Earn rewards on every trip",
        },
        {
          featureId: "flexible_cancellation",
          primaryText: "Flexible cancellation",
          secondaryText: "Full refund on cancellations",
        },
        {
          featureId: "priority_phone",
          primaryText: "Priority phone support",
          secondaryText: "Direct line to our team",
        },
        {
          featureId: "travel_insurance",
          primaryText: "Travel insurance included",
          secondaryText: "Peace of mind on every trip",
        },
      ],
    },
  ]

  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book your ride in seconds with our streamlined process",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Your payment information is always safe and encrypted",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get help whenever you need it with our support team",
    },
    {
      icon: Star,
      title: "Quality Service",
      description: "Verified drivers and well-maintained vehicles",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Choose Your <span className="bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent">Perfect Plan</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Flexible pricing for every traveler. Start free, upgrade anytime.
            </motion.p>

            {!isLoading && session && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              >
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Current Plan: <span className="text-primary">{customer?.products?.at(-1)?.name || "Free"}</span>
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <PricingTable productDetails={productDetails} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Bus Mate?</h2>
            <p className="text-lg text-muted-foreground">
              More than just a booking platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can I change my plan anytime?</h3>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, debit cards, and digital wallets through our secure payment processor.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Is there a long-term commitment?</h3>
                <p className="text-muted-foreground">
                  No! All plans are month-to-month with no long-term commitment. Cancel anytime.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">What happens when I reach my booking limit?</h3>
                <p className="text-muted-foreground">
                  Free plan users have 3 bookings per month, Plus users get 10. Premium users enjoy unlimited bookings. You'll be prompted to upgrade if you reach your limit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}