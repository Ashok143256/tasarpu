'use client'

import { Leaf, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/cooperative-logo.png" 
                alt="Shri Tasarpoo Cooperative Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="font-bold text-lg">{t('home.title')}</span>
            </div>
            <p className="text-green-100 text-sm">
              {t('home.motto')}
            </p>
            <div className="space-y-2 text-sm text-green-100">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{t('footer.address')}</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('contact.title')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <a href="mailto:tasarpusfacl2066@gmail.com" className="text-green-100 hover:text-white transition-colors">
                  tasarpusfacl2066@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="tel:+9779860775160" className="text-green-100 hover:text-white transition-colors">
                  +977-9860775160
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="https://wa.me/9779860775160" target="_blank" rel="noopener noreferrer" className="text-green-100 hover:text-white transition-colors">
                  WhatsApp: +977-9860775160
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="#home" className="block text-green-100 hover:text-white transition-colors">
                {t('nav.home')}
              </a>
              <a href="#about" className="block text-green-100 hover:text-white transition-colors">
                {t('nav.about')}
              </a>
              <a href="#services" className="block text-green-100 hover:text-white transition-colors">
                {t('nav.services')}
              </a>
              <a href="#contact" className="block text-green-100 hover:text-white transition-colors">
                {t('nav.contact')}
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm text-green-100">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}