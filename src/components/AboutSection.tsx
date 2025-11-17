'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText, Target, Eye, Heart, Handshake, Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function AboutSection() {
  const { t } = useLanguage()

  const values = [
    {
      icon: Eye,
      title: t('about.values.transparency'),
      description: 'Complete transparency in all our operations and financial dealings.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Handshake,
      title: t('about.values.cooperation'),
      description: 'Working together with farmers for mutual growth and prosperity.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Heart,
      title: t('about.values.sustainability'),
      description: 'Promoting sustainable agricultural practices for future generations.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Users,
      title: t('about.values.empowerment'),
      description: 'Empowering small farmers with knowledge and resources.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('about.title')}
            </h2>
            <p className="text-lg text-gray-600">
              Learn about our mission, vision, and commitment to serving small farmers.
            </p>
          </div>

          {/* Registration Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-green-600" />
                <span>{t('about.registration')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold">{t('about.registration.date')}</div>
                    <div className="text-sm text-gray-600">Officially registered with the government</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold">{t('about.registration.number')}</div>
                    <div className="text-sm text-gray-600">Cooperative registration number</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Location:</strong> थाक्रे -४ बहुनस्थन, धादिङ्ग, नेपाल (Thakre-4 Bahunasthan, Dhading, Nepal)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  <span>{t('about.mission')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {t('about.mission.text')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-6 w-6 text-purple-600" />
                  <span>{t('about.vision')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {t('about.vision.text')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.values')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${value.bgColor} flex-shrink-0`}>
                        <value.icon className={`h-6 w-6 ${value.color}`} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">{value.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-green-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Become part of our cooperative and benefit from our comprehensive agricultural services, 
              training programs, and financial support designed specifically for small farmers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us Today
              </button>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Learn About Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}