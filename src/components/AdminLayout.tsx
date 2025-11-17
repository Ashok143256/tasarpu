'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  LayoutDashboard, 
  Megaphone, 
  Calendar, 
  MessageSquare, 
  Menu, 
  LogOut,
  Settings,
  User
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: pathname === '/admin'
    },
    {
      name: 'Announcements',
      href: '/admin/announcements',
      icon: Megaphone,
      current: pathname.startsWith('/admin/announcements')
    },
    {
      name: 'Training Events',
      href: '/admin/training-events',
      icon: Calendar,
      current: pathname.startsWith('/admin/training-events')
    },
    {
      name: 'Inquiries',
      href: '/admin/inquiries',
      icon: MessageSquare,
      current: pathname.startsWith('/admin/inquiries')
    }
  ]

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('admin')
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 animate-gradient-shift">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-lg sticky top-0 z-50 animate-slide-down">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center px-3 py-3 rounded-lg text-lg font-medium transition-all duration-300 sidebar-item ${
                            item.current
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <item.icon className="mr-3 h-6 w-6" />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="flex items-center">
                  <img 
                    src="/cooperative-logo.png" 
                    alt="Shri Tasarpoo Cooperative Logo"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="ml-3 text-xl font-bold text-gray-900">Admin Panel</span>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
                title="Profile"
              >
                <User className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow backdrop-blur-md bg-white/80 border-r border-gray-200/50 pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-lg font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="backdrop-blur-sm bg-white/60 rounded-lg shadow-xl border border-gray-200/50">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}