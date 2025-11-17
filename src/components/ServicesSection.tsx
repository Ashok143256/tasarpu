'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Leaf, BookOpen, Package, CheckCircle, TrendingUp, Award, Clock, DollarSign } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function ServicesSection() {
  const { t } = useLanguage()

  const services = [
    {
      id: 'loans',
      icon: Leaf,
      title: t('services.loans.title'),
      description: t('services.loans.description'),
      features: [
        t('services.loans.feature1'),
        t('services.loans.feature2'),
        t('services.loans.feature3')
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      stats: [
        { icon: DollarSign, label: 'Interest Rate', value: '8-12%' },
        { icon: Clock, label: 'Processing Time', value: '3-5 days' },
        { icon: TrendingUp, label: 'Loan Amount', value: '₹10K - ₹5L' }
      ]
    },
    {
      id: 'training',
      icon: BookOpen,
      title: t('services.training.title'),
      description: t('services.training.description'),
      features: [
        t('services.training.feature1'),
        t('services.training.feature2'),
        t('services.training.feature3')
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      stats: [
        { icon: Award, label: 'Certification', value: 'Available' },
        { icon: Clock, label: 'Duration', value: '1-7 days' },
        { icon: Package, label: 'Batch Size', value: '20-30 farmers' }
      ]
    },
    {
      id: 'seeds',
      icon: Package,
      title: t('services.seeds.title'),
      description: t('services.seeds.description'),
      features: [
        t('services.seeds.feature1'),
        t('services.seeds.feature2'),
        t('services.seeds.feature3')
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      stats: [
        { icon: CheckCircle, label: 'Quality', value: 'Certified' },
        { icon: TrendingUp, label: 'Yield Increase', value: '20-40%' },
        { icon: Package, label: 'Delivery', value: 'Door to door' }
      ]
    }
  ]

  return (
    <section id="services-detail" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('services.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive agricultural services designed to support small farmers 
              throughout their farming journey with affordable, reliable, and sustainable solutions.
            </p>
          </div>

          {/* Services Grid */}
          <div className="space-y-8">
            {services.map((service, index) => (
              <Card key={service.id} className={`border-2 ${service.borderColor} shadow-lg overflow-hidden`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Service Icon and Title */}
                  <div className={`${service.bgColor} p-8 flex flex-col items-center justify-center text-center`}>
                    <div className={`p-4 bg-white rounded-full mb-4`}>
                      <service.icon className={`h-12 w-12 ${service.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>

                  {/* Features */}
                  <div className="p-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      {t('services.loans.features')}
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="p-8 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-4">Quick Facts</h4>
                    <div className="space-y-4">
                      {service.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="flex items-center space-x-3">
                          <div className={`p-2 ${service.bgColor} rounded-full`}>
                            <stat.icon className={`h-4 w-4 ${service.color}`} />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                            <div className="font-semibold text-gray-900">{stat.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Benefits */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Why Choose Our Services?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">15+</div>
                    <div className="text-gray-700">Years of Experience</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">500+</div>
                    <div className="text-gray-700">Satisfied Farmers</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">100%</div>
                    <div className="text-gray-700">Commitment</div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Started Today
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Overview */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-gray-900">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Apply', description: 'Submit your application' },
                { step: '2', title: 'Review', description: 'We review your requirements' },
                { step: '3', title: 'Approve', description: 'Quick approval process' },
                { step: '4', title: 'Support', description: 'Ongoing assistance' }
              ].map((item, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}