'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MapPin, Mail, Phone, MessageSquare, Clock, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function ContactSection() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    setFormData({ name: '', email: '', message: '' })
    setIsSubmitting(false)
    
    // Show success message (in real app, you'd use a toast notification)
    alert('Message sent successfully! We will contact you soon.')
  }

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.address'),
      value: 'थाक्रे -४ बहुनस्थन, धादिङ्ग, नेपाल',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: 'tasarpusfacl2066@gmail.com',
      href: 'mailto:tasarpusfacl2066@gmail.com',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: '+977-9860775160',
      href: 'tel:+9779860775160',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const workingHours = [
    { day: 'Sunday - Friday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 2:00 PM' },
    { day: 'Emergency', hours: '24/7 Available' }
  ]

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('contact.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get in touch with us for any inquiries about our services, membership, or agricultural support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                    <span>Get in Touch</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${info.bgColor} flex-shrink-0`}>
                        <info.icon className={`h-5 w-5 ${info.color}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">{info.label}</div>
                        {info.href ? (
                          <a 
                            href={info.href}
                            className="text-gray-600 hover:text-green-600 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-gray-600">{info.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <span>Office Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-900">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* WhatsApp Quick Contact */}
              <Card className="border-0 shadow-lg bg-green-50">
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-green-800">Need Quick Help?</div>
                    <p className="text-green-700">
                      Chat with us on WhatsApp for immediate assistance
                    </p>
                    <a
                      href="https://wa.me/9779860775160"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form & Map */}
            <div className="space-y-6">
              {/* Contact Form */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>{t('contact.form.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.form.name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.form.message')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('contact.form.submit')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-6 w-6 text-red-600" />
                    <span>{t('contact.map')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gray-100">
                    <iframe
                      src="https://maps.app.goo.gl/rzZcDxXQQXesvUEx8"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Map showing location of Shri Tasarpoo Small Farmers Agricultural Cooperative Ltd."
                      className="absolute inset-0"
                    />
                  </div>
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-600 text-center">
                      <strong>थाक्रे -४ बहुनस्थन, धादिङ्ग</strong><br />
                      Thakre-4 Bahunasthan, Dhading, Nepal
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emergency Contact */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Badge variant="destructive" className="bg-red-600">
                  Emergency Contact
                </Badge>
                <h3 className="text-xl font-bold text-red-900">
                  Need Immediate Agricultural Assistance?
                </h3>
                <p className="text-red-700">
                  For urgent farming-related queries or emergency support, call us directly.
                </p>
                <a
                  href="tel:+9779860775160"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Now: +977-9860775160</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}