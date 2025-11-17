"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, User, Wallet, Settings, MapPin, LogOut, LogIn, UserPlus } from "lucide-react"
import { authClient, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Vehicles", href: "/vehicles" },
    { label: "Book Ride", href: "/booking" },
    { label: "Live Tracking", href: "/tracking" },
    { label: "Contact", href: "/#contact" },
  ]

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token")

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    if (error?.code) {
      toast.error("Failed to sign out. Please try again.")
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      toast.success("Signed out successfully")
      router.push("/")
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent"
          >
            Bus Mate
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary hover:underline underline-offset-4"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isPending ? (
            <div className="h-9 w-24 bg-muted/50 animate-pulse rounded-md" />
          ) : session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/driver-dashboard" className="cursor-pointer">
                      <Wallet className="mr-2 h-4 w-4" />
                      Driver Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tracking" className="cursor-pointer">
                      <MapPin className="mr-2 h-4 w-4" />
                      Track My Ride
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/booking">
                <Button className="bg-primary hover:bg-primary/90">
                  Book Now
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-card"
          >
            <nav className="container mx-auto flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground/80 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              
              {isPending ? (
                <div className="h-9 w-full bg-muted/50 animate-pulse rounded-md" />
              ) : session?.user ? (
                <>
                  <div className="pt-2 border-t border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                  <Link href="/driver-dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <Wallet className="mr-2 h-4 w-4" />
                      Driver Dashboard
                    </Button>
                  </Link>
                  <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary">Book Now</Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}