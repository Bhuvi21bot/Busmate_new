"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Bus, Users, Zap, TrendingUp, CheckCircle2, Lightbulb, Trophy } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const stats = [
    { icon: Trophy, label: "Bus Operators", value: "25+" },
    { icon: Users, label: "Active Buses", value: "850+" },
    { icon: Zap, label: "Tickets Today", value: "7,456+" },
    { icon: TrendingUp, label: "On-Time", value: "98.56%" },
  ]

  const services = [
    {
      title: "Government Bus",
      description: "Affordable and reliable state-owned bus services with fixed schedules and extensive route coverage.",
      icon: Bus,
    },
    {
      title: "Private Bus",
      description: "Comfort and flexibility with better amenities, direct routes, and personalized services.",
      icon: Bus,
    },
    {
      title: "Chartered Bus",
      description: "Tailored transportation for groups, events, and special occasions with flexible scheduling.",
      icon: Bus,
    },
    {
      title: "E-Rickshaw",
      description: "Eco-friendly electric transport for short distances, zero emissions, affordable rates.",
      icon: Zap,
    },
  ]

  const features = [
    {
      icon: CheckCircle2,
      title: "Seamless Connectivity",
      description: "Digitizing local travel to bring reliable, affordable, and eco-friendly rides to everyone.",
    },
    {
      icon: Lightbulb,
      title: "Smart Mobility",
      description: "Real-time tracking, verified drivers, and easy seat booking for safe transparent journeys.",
    },
    {
      icon: TrendingUp,
      title: "Sustainable Growth",
      description: "Supporting a greener urban future through innovation and community-focused design.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Innovative Travel
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your neighborhood ride just got smarter! Track your route, book a seat, and move around your city with confidence and comfort.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/vehicles">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-heading mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">About Bus Mate</h2>
            <p className="text-xl text-muted-foreground">Fast and cheapest way for traveling</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground">The best ride that suits you</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <service.icon className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-primary/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book your ride now and experience seamless, affordable, and eco-friendly travel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-12">
                  Book Your Ride Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-12">
                  View Plans & Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}