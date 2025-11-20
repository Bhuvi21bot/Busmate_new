"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bus, Users, Zap, TrendingUp, CheckCircle2, Lightbulb, Trophy, ArrowRight, Crown, Star, Gift, Home as HomeIcon, Wallet } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import ScrollToTop from "@/components/ScrollToTop"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()

  // Dock items configuration
  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <VscCalendar size={20} />, label: 'Booking', onClick: () => router.push('/booking') },
    { icon: <Wallet size={20} />, label: 'My Wallet', onClick: () => router.push('/driver-dashboard?tab=wallet') },
  ]

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

  const membershipPlans = [
    {
      id: "free",
      name: "Free",
      icon: Gift,
      price: "₹0",
      period: "forever",
      description: "Perfect for occasional travelers",
      features: [
        "10 bookings per month",
        "Standard route search",
        "View schedules & fares",
        "Email support",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      id: "premium",
      name: "Premium",
      icon: Star,
      price: "₹1,249",
      period: "per month",
      description: "Best for regular commuters",
      features: [
        "25 bookings per month",
        "Seat choice available",
        "10% discount on every 3rd booking",
        "Ad-free experience",
        "Priority booking",
        "Real-time bus tracking",
        "Live chat support",
      ],
      buttonText: "Go Premium",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      id: "super_premium",
      name: "Super Premium",
      icon: Crown,
      price: "₹2,499",
      period: "per month",
      description: "For frequent travelers",
      features: [
        "Unlimited bookings",
        "Multiple bookings at a time (up to 10)",
        "Express check-in & fast boarding",
        "Everything in Premium",
        "Early access to new routes",
        "Concierge booking service",
        "Loyalty rewards & points",
        "Flexible cancellation",
        "Priority phone support",
        "Travel insurance included",
      ],
      buttonText: "Go Super Premium",
      buttonVariant: "default" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Animated Radial Gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, var(--color-primary) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

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
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-lg px-8 hover:scale-105 transition-transform duration-300"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 hover:scale-105 transition-transform duration-300 hover:border-primary/50"
                >
                  View Pricing
                </Button>
              </Link>
              <Link href="/driver-dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 hover:scale-105 transition-transform duration-300 hover:border-primary/50 bg-primary/5"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Become a Driver
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
                transition={{ 
                  delay: 0.9 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15 
                }}
                whileHover={{ 
                  scale: 1.08,
                  transition: { type: "spring", stiffness: 400 }
                }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center relative overflow-hidden group"
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                </motion.div>
                <div className="text-3xl font-bold text-heading mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Choose Your <span className="bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent">Membership Plan</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Flexible plans for every type of traveler
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <Card className={`h-full relative overflow-hidden ${
                  plan.popular 
                    ? "border-primary/50 bg-gradient-to-br from-primary/10 to-card shadow-lg shadow-primary/20" 
                    : "bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50"
                } transition-all duration-300`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    <plan.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href="/pricing" className="block">
                      <Button 
                        variant={plan.buttonVariant}
                        className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="hover:border-primary/50">
                View Detailed Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              About Bus Mate
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Fast and cheapest way for traveling
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  <CardContent className="p-6 relative z-10">
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
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Services
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              The best ride that suits you
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  y: -15,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
                  <CardContent className="p-6 text-center relative z-10">
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
      <section id="contact" className="py-20 bg-gradient-to-br from-primary/20 to-background relative overflow-hidden">
        {/* Animated circles */}
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
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-green-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Book your ride now and experience seamless, affordable, and eco-friendly travel.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/booking">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-lg px-12 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Book Your Ride Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-12 hover:scale-105 transition-all duration-300 hover:border-primary/50"
                >
                  View Plans & Pricing
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Dock Component */}
      <Dock 
        items={dockItems}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
        distance={200}
      />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}