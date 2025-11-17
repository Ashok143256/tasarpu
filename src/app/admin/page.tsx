'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Megaphone, 
  Calendar, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Eye
} from 'lucide-react'

interface DashboardStats {
  totalAnnouncements: number
  publishedAnnouncements: number
  totalEvents: number
  upcomingEvents: number
  totalInquiries: number
  pendingInquiries: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalAnnouncements: 0,
    publishedAnnouncements: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalInquiries: 0,
    pendingInquiries: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
      return
    }

    fetchDashboardStats()
  }, [router])

  const fetchDashboardStats = async () => {
    try {
      // Fetch announcements stats
      const announcementsResponse = await fetch('/api/admin/announcements?limit=1000')
      const announcementsData = await announcementsResponse.json()
      
      // Fetch events stats
      const eventsResponse = await fetch('/api/admin/training-events?limit=1000')
      const eventsData = await eventsResponse.json()
      
      // Fetch inquiries stats
      const inquiriesResponse = await fetch('/api/admin/inquiries?limit=1000')
      const inquiriesData = await inquiriesResponse.json()

      if (announcementsData.success && eventsData.success && inquiriesData.success) {
        const announcements = announcementsData.data
        const events = eventsData.data
        const inquiries = inquiriesData.data

        setStats({
          totalAnnouncements: announcements.length,
          publishedAnnouncements: announcements.filter((a: any) => a.status === 'published').length,
          totalEvents: events.length,
          upcomingEvents: events.filter((e: any) => e.status === 'upcoming').length,
          totalInquiries: inquiries.length,
          pendingInquiries: inquiries.filter((i: any) => i.status === 'pending').length
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Create Announcement',
      description: 'Add news or meeting notice',
      icon: Megaphone,
      href: '/admin/announcements?action=create',
      color: 'bg-blue-500',
      count: stats.pendingInquiries
    },
    {
      title: 'Schedule Training',
      description: 'Add new training event',
      icon: Calendar,
      href: '/admin/training-events?action=create',
      color: 'bg-green-500',
      count: null
    },
    {
      title: 'View Inquiries',
      description: 'Check contact form submissions',
      icon: MessageSquare,
      href: '/admin/inquiries',
      color: 'bg-orange-500',
      count: stats.pendingInquiries
    }
  ]

  const statCards = [
    {
      title: 'Total Announcements',
      value: stats.totalAnnouncements,
      subtitle: `${stats.publishedAnnouncements} published`,
      icon: Megaphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/announcements'
    },
    {
      title: 'Training Events',
      value: stats.totalEvents,
      subtitle: `${stats.upcomingEvents} upcoming`,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/training-events'
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      subtitle: `${stats.pendingInquiries} pending`,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/admin/inquiries'
    }
  ]

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your cooperative.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card 
              key={index} 
              className="backdrop-blur-sm bg-white/70 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200/30 hover:border-green-300/50 card-hover animate-fade-in-up"
              onClick={() => router.push(stat.href)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-sm bg-white/70 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200/30 hover:border-green-300/50 group"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`mx-auto w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform animate-float`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  {action.count !== null && action.count > 0 && (
                    <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {action.count} pending
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="backdrop-blur-sm bg-white/70 border border-gray-200/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Activity will appear here as you manage your content</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}