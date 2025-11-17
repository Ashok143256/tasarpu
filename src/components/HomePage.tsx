'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Leaf, Users, BookOpen, Package, ArrowRight, HandHeart, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function HomePage() {
  const { t } = useLanguage()

  const services = [
    {
      icon: Leaf,
      title: t('home.services.loans'),
      description: 'Low-interest agricultural loans for small farmers',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: BookOpen,
      title: t('home.services.training'),
      description: 'Modern farming techniques and best practices',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Package,
      title: t('home.services.seeds'),
      description: 'Quality seeds and agricultural tools distribution',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const stats = [
    {
      icon: Users,
      value: '500+',
      label: 'Farmer Members',
      description: 'Growing farming community'
    },
    {
      icon: HandHeart,
      value: '15+',
      label: 'Years of Service',
      description: 'Since 2066 B.S.'
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Satisfaction Rate',
      description: 'Happy farmers'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        {/* Hero Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/hero-farming.jpg" 
            alt="Terraced agricultural fields in Dhading, Nepal with farmers working"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                {t('home.subtitle')}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                {t('home.title')}
              </h1>
              <p className="text-xl md:text-2xl text-green-700 font-semibold">
                {t('home.motto')}
              </p>
            </div>
            
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t('home.welcome')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('home.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('nav.contact')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <stat.icon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('home.services.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive agricultural services designed to empower small farmers and promote sustainable farming practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center space-y-4">
                  <div className={`mx-auto p-4 rounded-full ${service.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    variant="ghost" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => document.getElementById('services-detail')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {t('home.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold">Why Farmers Trust Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-green-400">15+</div>
                <div className="text-green-100">Years of Experience</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-green-400">500+</div>
                <div className="text-green-100">Happy Farmers</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-green-400">100%</div>
                <div className="text-green-100">Transparent</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-green-400">24/7</div>
                <div className="text-green-100">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}