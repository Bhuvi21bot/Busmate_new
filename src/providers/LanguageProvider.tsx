"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "hi"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    home: "Home",
    vehicles: "Vehicles",
    bookRide: "Book Ride",
    liveTracking: "Live Tracking",
    contact: "Contact",
    login: "Login",
    signUp: "Sign Up",
    signOut: "Sign Out",
    driverDashboard: "Driver Dashboard",
    trackMyRide: "Track My Ride",
    bookNow: "Book Now",
    pleaseWait: "please wait..",
    innovativeTravel: "Innovative Travel",
    heroDescription: "Your neighborhood ride just got smarter! Track your route, book a seat, and move around your city with confidence and comfort.",
    startJourney: "Start Your Journey",
    viewPricing: "View Pricing",
    becomeDriver: "Become a Driver",
    aboutBusMate: "About Bus Mate",
    aboutDescription: "Fast and cheapest way for traveling",
    ourServices: "Our Services",
    servicesDescription: "The best ride that suits you",
    howToBook: "How to Book Your Ride",
    bookingDescription: "Simple steps to get you moving",
    customerReviews: "What Our Customers Say",
    reviewsDescription: "Real experiences from real travelers",
    availableDrivers: "Available Drivers Near You",
    driversDescription: "Verified and ready to serve you",
    readyToStart: "Ready to Start Your Journey?",
    ctaDescription: "Book your ride now and experience seamless, affordable, and eco-friendly travel.",
    bookYourRide: "Book Your Ride Now",
    viewPlans: "View Plans & Pricing",
  },
  hi: {
    home: "होम",
    vehicles: "वाहन",
    bookRide: "सवारी बुक करें",
    liveTracking: "लाइव ट्रैकिंग",
    contact: "संपर्क",
    login: "लॉगिन",
    signUp: "साइन अप",
    signOut: "साइन आउट",
    driverDashboard: "ड्राइवर डैशबोर्ड",
    trackMyRide: "मेरी सवारी ट्रैक करें",
    bookNow: "अभी बुक करें",
    pleaseWait: "कृपया प्रतीक्षा करें..",
    innovativeTravel: "नवीन यात्रा",
    heroDescription: "आपकी पड़ोस की सवारी और भी स्मार्ट हो गई है! अपना मार्ग ट्रैक करें, सीट बुक करें, और अपने शहर में आत्मविश्वास और आराम के साथ घूमें।",
    startJourney: "अपनी यात्रा शुरू करें",
    viewPricing: "मूल्य देखें",
    becomeDriver: "ड्राइवर बनें",
    aboutBusMate: "बस मेट के बारे में",
    aboutDescription: "यात्रा का सबसे तेज़ और सस्ता तरीका",
    ourServices: "हमारी सेवाएं",
    servicesDescription: "सबसे अच्छी सवारी जो आपके लिए उपयुक्त है",
    howToBook: "अपनी सवारी कैसे बुक करें",
    bookingDescription: "आपको चलने के लिए सरल कदम",
    customerReviews: "हमारे ग्राहक क्या कहते हैं",
    reviewsDescription: "वास्तविक यात्रियों से वास्तविक अनुभव",
    availableDrivers: "आपके पास उपलब्ध ड्राइवर",
    driversDescription: "सत्यापित और आपकी सेवा के लिए तैयार",
    readyToStart: "अपनी यात्रा शुरू करने के लिए तैयार हैं?",
    ctaDescription: "अभी अपनी सवारी बुक करें और निर्बाध, किफायती और पर्यावरण के अनुकूल यात्रा का अनुभव करें।",
    bookYourRide: "अभी अपनी सवारी बुक करें",
    viewPlans: "योजनाएं और मूल्य देखें",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("language", language)
  }, [language, mounted])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"))
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
