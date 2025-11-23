"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bus, Users, Zap, TrendingUp, CheckCircle2, Lightbulb, Trophy, ArrowRight, Wallet, Search, MapPin, Star, Verified } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import ScrollToTop from "@/components/ScrollToTop"
import ClickSpark from "@/components/ClickSpark"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

  const bookingSteps = [
    {
      number: "01",
      icon: Search,
      title: "Search Your Route",
      description: "Enter your pickup and drop location to find available buses and e-rickshaws on your route.",
    },
    {
      number: "02",
      icon: CheckCircle2,
      title: "Select Your Ride",
      description: "Choose from government, private, or chartered options. View real-time availability and fares.",
    },
    {
      number: "03",
      icon: Verified,
      title: "Confirm Booking",
      description: "Review your selection, choose your seat, and complete payment securely through our platform.",
    },
    {
      number: "04",
      icon: MapPin,
      title: "Track & Travel",
      description: "Get live updates on your ride location, estimated arrival time, and driver details for a safe journey.",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Daily Commuter",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      rating: 5,
      review: "Bus Mate has transformed my daily commute! Real-time tracking and easy booking make traveling stress-free. Highly recommended!",
    },
    {
      name: "Priya Sharma",
      role: "College Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      rating: 5,
      review: "As a student, affordability matters. Bus Mate offers the best rates with verified drivers. I feel safe and save money!",
    },
    {
      name: "Amit Patel",
      role: "Business Professional",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      rating: 5,
      review: "The chartered bus service for our corporate events is exceptional. Professional drivers, clean vehicles, and punctual service every time.",
    },
    {
      name: "Sneha Reddy",
      role: "Freelancer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
      rating: 5,
      review: "E-rickshaw booking feature is a game changer! Quick, eco-friendly, and perfect for short distances. Love the convenience!",
    },
  ]

  const availableDrivers = [
    {
      id: 1,
      name: "Vikram Singh",
      vehicle: "UPSRTC Government Bus",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
      rating: 4.8,
      trips: 1250,
      distance: "0.8 km away",
      verified: true,
      available: true,
    },
    {
      id: 2,
      name: "Mohammad Ali",
      vehicle: "Private AC Bus",
      image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200",
      rating: 4.9,
      trips: 980,
      distance: "1.2 km away",
      verified: true,
      available: true,
    },
    {
      id: 3,
      name: "Suresh Yadav",
      vehicle: "E-Rickshaw",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200",
      rating: 4.7,
      trips: 2340,
      distance: "0.5 km away",
      verified: true,
      available: true,
    },
    {
      id: 4,
      name: "Ramesh Gupta",
      vehicle: "Chartered Bus (45 Seater)",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
      rating: 4.9,
      trips: 567,
      distance: "2.1 km away",
      verified: true,
      available: true,
    },
  ]

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

        {/* Booking Steps Section */}
        <section className="py-20 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
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
                How to Book Your Ride
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Simple steps to get you moving
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {bookingSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                        <div className="bg-primary/10 rounded-full p-3 mt-2">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-20 relative overflow-hidden">
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
                What Our Customers Say
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Real experiences from real travelers
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-6 flex-grow italic">
                        "{testimonial.review}"
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Drivers Section */}
        <section className="py-20 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
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
                Available Drivers Near You
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Verified and ready to serve you
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {availableDrivers.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
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
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                          <AvatarImage src={driver.image} alt={driver.name} />
                          <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {driver.verified && (
                          <div className="bg-primary/10 rounded-full p-1">
                            <Verified className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold mb-1">{driver.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{driver.vehicle}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-semibold">{driver.rating}</span>
                          <span className="text-muted-foreground">({driver.trips} trips)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{driver.distance}</span>
                        </div>
                      </div>
                      
                      <Link href="/booking">
                        <Button className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Book Now
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
              transition={{ delay: 0.4 }}
              className="text-center mt-8"
            >
              <Link href="/vehicles">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="hover:scale-105 transition-all duration-300 hover:border-primary/50"
                >
                  View All Available Drivers
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-primary/20 to-background relative overflow-hidden">
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

        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
          distance={200}
        />

        <ScrollToTop />
      </div>
    </ClickSpark>
  )
}