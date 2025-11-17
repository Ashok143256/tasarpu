'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import { Navigation } from '@/components/Navigation'
import { HomePage } from '@/components/HomePage'
import { AboutSection } from '@/components/AboutSection'
import { ServicesSection } from '@/components/ServicesSection'
import { NewsSection } from '@/components/NewsSection'
import { ContactSection } from '@/components/ContactSection'
import { LoanCalculatorSection } from '@/components/LoanCalculatorSection'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Navigation />
        <main>
          <HomePage />
          <AboutSection />
          <ServicesSection />
          <NewsSection />
          <ContactSection />
          <LoanCalculatorSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}