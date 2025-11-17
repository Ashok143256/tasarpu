'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowRight, Megaphone } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function NewsSection() {
  const { t } = useLanguage()

  // Sample news data - in a real app, this would come from an API
  const newsItems = [
    {
      id: 1,
      title: 'New Agricultural Training Program Launch',
      titleNe: 'नयाँ कृषि तालिम कार्यक्रम सुरु',
      excerpt: 'We are excited to announce our comprehensive training program on modern farming techniques starting next month.',
      excerptNe: 'आगामी महिनादेखि आधुनिक खेती प्रविधिमा व्यापक तालिम कार्यक्रम सुरु गर्न उत्साहित छौं।',
      date: '2024-01-15',
      author: 'Cooperative Management',
      category: 'Training',
      featured: true
    },
    {
      id: 2,
      title: 'Special Loan Scheme for Vegetable Farmers',
      titleNe: 'तरकारी किसानहरूका लागि विशेष कर्जा योजना',
      excerpt: 'Special low-interest loans available for farmers interested in vegetable cultivation this season.',
      excerptNe: 'यो सिजन तरकारी खेतीमा रुचि राख्ने किसानहरूका लागि विशेष कम ब्याज कर्जा उपलब्ध छ।',
      date: '2024-01-10',
      author: 'Loan Department',
      category: 'Finance',
      featured: false
    },
    {
      id: 3,
      title: 'Quality Seeds Distribution Program',
      titleNe: 'गुणस्तरीय बिउ वितरण कार्यक्रम',
      excerpt: 'High-quality wheat and maize seeds now available at subsidized rates for our member farmers.',
      excerptNe: 'हाम्रा सदस्य किसानहरूका लागि अनुदानित दरमा उच्च गुणस्तरको गहुँ र मकैको बिउ अहिले उपलब्ध छ।',
      date: '2024-01-05',
      author: 'Agriculture Department',
      category: 'Seeds',
      featured: false
    },
    {
      id: 4,
      title: 'Annual General Meeting Notice',
      titleNe: 'वार्षिक साधारण सभा सूचना',
      excerpt: 'The 15th Annual General Meeting will be held on Magh 15, 2080 B.S. All members are requested to attend.',
      excerptNe: '१५औं वार्षिक साधारण सभा माघ १५, २०८० बि.स. मा हुनेछ। सबै सदस्यहरूलाई उपस्थित हुन अनुरोध गरिन्छ।',
      date: '2024-01-01',
      author: 'Management Committee',
      category: 'Meeting',
      featured: true
    }
  ]

  const categories = ['All', 'Training', 'Finance', 'Seeds', 'Meeting']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredNews = selectedCategory === 'All' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const { language } = useLanguage()

  return (
    <section id="news" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Megaphone className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('news.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest announcements, training programs, and important notices from our cooperative.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured News */}
          {filteredNews.filter(item => item.featured).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Featured Announcements</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredNews.filter(item => item.featured).map((item) => (
                  <Card key={item.id} className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {item.category}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(item.date)}
                        </div>
                      </div>
                      <CardTitle className="text-xl">
                        {language === 'ne' ? item.titleNe : item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 mb-4">
                        {language === 'ne' ? item.excerptNe : item.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {item.author}
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          {t('news.read.more')}
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular News Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Latest Updates</h3>
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.filter(item => !item.featured).map((item) => (
                  <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          {item.category}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(item.date)}
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {language === 'ne' ? item.titleNe : item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm mb-4">
                        {language === 'ne' ? item.excerptNe : item.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {item.author}
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          {t('news.read.more')}
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t('news.no.news')}</p>
              </div>
            )}
          </div>

          {/* Load More */}
          {filteredNews.length > 6 && (
            <div className="text-center pt-4">
              <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                Load More News
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}