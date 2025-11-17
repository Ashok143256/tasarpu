'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Save, 
  X, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  Search,
  Filter
} from 'lucide-react'

interface Announcement {
  id: string
  titleNe: string
  titleEn: string
  contentNe: string
  contentEn: string
  excerptNe?: string
  excerptEn?: string
  category: string
  status: string
  isFeatured: boolean
  author: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export default function AnnouncementsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(action === 'create')
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    titleNe: '',
    titleEn: '',
    contentNe: '',
    contentEn: '',
    excerptNe: '',
    excerptEn: '',
    category: 'General',
    status: 'draft',
    isFeatured: false,
    author: ''
  })

  const categories = ['Training', 'Finance', 'Seeds', 'Meeting', 'General']
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' }
  ]

  useEffect(() => {
    checkAuth()
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    fetchAnnouncements()
  }, [currentPage, filterStatus, filterCategory])

  const checkAuth = () => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
    }
  }

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterCategory !== 'all' && { category: filterCategory })
      })

      const response = await fetch(`/api/admin/announcements?${params}`)
      const data = await response.json()

      if (data.success) {
        setAnnouncements(data.data)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      setError('Failed to fetch announcements')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      titleNe: '',
      titleEn: '',
      contentNe: '',
      contentEn: '',
      excerptNe: '',
      excerptEn: '',
      category: 'General',
      status: 'draft',
      isFeatured: false,
      author: ''
    })
    setEditingAnnouncement(null)
    setShowForm(false)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const url = editingAnnouncement 
        ? `/api/admin/announcements/${editingAnnouncement.id}`
        : '/api/admin/announcements'
      
      const method = editingAnnouncement ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(editingAnnouncement ? 'Announcement updated successfully!' : 'Announcement created successfully!')
        resetForm()
        fetchAnnouncements()
      } else {
        setError(data.error || 'Failed to save announcement')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      titleNe: announcement.titleNe,
      titleEn: announcement.titleEn,
      contentNe: announcement.contentNe,
      contentEn: announcement.contentEn,
      excerptNe: announcement.excerptNe || '',
      excerptEn: announcement.excerptEn || '',
      category: announcement.category,
      status: announcement.status,
      isFeatured: announcement.isFeatured,
      author: announcement.author
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Announcement deleted successfully!')
        fetchAnnouncements()
      } else {
        setError(data.error || 'Failed to delete announcement')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.titleNe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-1">Manage news and meeting notices</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Announcement
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetForm}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nepali Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">नेपाली (Nepali)</h3>
                    <div className="space-y-2">
                      <Label htmlFor="titleNe" className="text-base font-medium">Title *</Label>
                      <Input
                        id="titleNe"
                        name="titleNe"
                        value={formData.titleNe}
                        onChange={handleInputChange}
                        placeholder="शीर्षक राख्नुहोस्"
                        required
                        className="text-base py-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerptNe" className="text-base font-medium">Excerpt</Label>
                      <Input
                        id="excerptNe"
                        name="excerptNe"
                        value={formData.excerptNe}
                        onChange={handleInputChange}
                        placeholder="छोटो विवरण"
                        className="text-base py-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentNe" className="text-base font-medium">Content *</Label>
                      <Textarea
                        id="contentNe"
                        name="contentNe"
                        value={formData.contentNe}
                        onChange={handleInputChange}
                        placeholder="पूरा सामग्री यहाँ लेख्नुहोस्"
                        required
                        rows={8}
                        className="text-base"
                      />
                    </div>
                  </div>

                  {/* English Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">English</h3>
                    <div className="space-y-2">
                      <Label htmlFor="titleEn" className="text-base font-medium">Title *</Label>
                      <Input
                        id="titleEn"
                        name="titleEn"
                        value={formData.titleEn}
                        onChange={handleInputChange}
                        placeholder="Enter title"
                        required
                        className="text-base py-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerptEn" className="text-base font-medium">Excerpt</Label>
                      <Input
                        id="excerptEn"
                        name="excerptEn"
                        value={formData.excerptEn}
                        onChange={handleInputChange}
                        placeholder="Brief description"
                        className="text-base py-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentEn" className="text-base font-medium">Content *</Label>
                      <Textarea
                        id="contentEn"
                        name="contentEn"
                        value={formData.contentEn}
                        onChange={handleInputChange}
                        placeholder="Enter full content here"
                        required
                        rows={8}
                        className="text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-base font-medium">Author *</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Author name"
                      required
                      className="text-base py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-medium">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger className="text-base py-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-base font-medium">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                      <SelectTrigger className="text-base py-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Featured</Label>
                    <div className="flex items-center space-x-2 mt-3">
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                      />
                      <Label htmlFor="isFeatured" className="text-sm text-gray-600">
                        Show on homepage
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingAnnouncement ? 'Update' : 'Create'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-base py-3"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48 text-base py-3">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48 text-base py-3">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <Card>
          <CardHeader>
            <CardTitle>Announcements ({filteredAnnouncements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No announcements found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {announcement.titleNe}
                          </h3>
                          <Badge variant={announcement.status === 'published' ? 'default' : 'secondary'}>
                            {announcement.status}
                          </Badge>
                          {announcement.isFeatured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                          <Badge variant="outline">{announcement.category}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {announcement.excerptNe || announcement.contentNe.substring(0, 150) + '...'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {announcement.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(announcement.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}