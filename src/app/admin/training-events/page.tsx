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
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  User,
  Users,
  Clock,
  Search,
  Filter
} from 'lucide-react'

interface TrainingEvent {
  id: string
  titleNe: string
  titleEn: string
  descriptionNe: string
  descriptionEn: string
  date: string
  time: string
  locationNe: string
  locationEn: string
  topic: string
  instructor: string
  maxParticipants?: number
  currentParticipants: number
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function TrainingEventsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  
  const [events, setEvents] = useState<TrainingEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(action === 'create')
  const [editingEvent, setEditingEvent] = useState<TrainingEvent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    titleNe: '',
    titleEn: '',
    descriptionNe: '',
    descriptionEn: '',
    date: '',
    time: '',
    locationNe: '',
    locationEn: '',
    topic: '',
    instructor: '',
    maxParticipants: '',
    status: 'upcoming',
    isActive: true
  })

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const commonTopics = [
    'Modern Farming Techniques',
    'Organic Agriculture',
    'Crop Management',
    'Irrigation Systems',
    'Pest Control',
    'Soil Management',
    'Seed Selection',
    'Fertilizer Application'
  ]

  useEffect(() => {
    checkAuth()
    fetchEvents()
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [currentPage, filterStatus])

  const checkAuth = () => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
    }
  }

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filterStatus !== 'all' && { status: filterStatus })
      })

      const response = await fetch(`/api/admin/training-events?${params}`)
      const data = await response.json()

      if (data.success) {
        setEvents(data.data)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      setError('Failed to fetch training events')
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
      descriptionNe: '',
      descriptionEn: '',
      date: '',
      time: '',
      locationNe: '',
      locationEn: '',
      topic: '',
      instructor: '',
      maxParticipants: '',
      status: 'upcoming',
      isActive: true
    })
    setEditingEvent(null)
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
      const url = editingEvent 
        ? `/api/admin/training-events/${editingEvent.id}`
        : '/api/admin/training-events'
      
      const method = editingEvent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(editingEvent ? 'Event updated successfully!' : 'Event created successfully!')
        resetForm()
        fetchEvents()
      } else {
        setError(data.error || 'Failed to save event')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (event: TrainingEvent) => {
    setEditingEvent(event)
    setFormData({
      titleNe: event.titleNe,
      titleEn: event.titleEn,
      descriptionNe: event.descriptionNe,
      descriptionEn: event.descriptionEn,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      locationNe: event.locationNe,
      locationEn: event.locationEn,
      topic: event.topic,
      instructor: event.instructor,
      maxParticipants: event.maxParticipants?.toString() || '',
      status: event.status,
      isActive: event.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training event?')) return

    try {
      const response = await fetch(`/api/admin/training-events/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Event deleted successfully!')
        fetchEvents()
      } else {
        setError(data.error || 'Failed to delete event')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const filteredEvents = events.filter(event =>
    event.titleNe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.topic.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training Events</h1>
            <p className="text-gray-600 mt-1">Manage agricultural training programs</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Event
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
                  {editingEvent ? 'Edit Training Event' : 'Create New Training Event'}
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
                      <Label htmlFor="descriptionNe" className="text-base font-medium">Description *</Label>
                      <Textarea
                        id="descriptionNe"
                        name="descriptionNe"
                        value={formData.descriptionNe}
                        onChange={handleInputChange}
                        placeholder="तालिमको विस्तृत विवरण"
                        required
                        rows={4}
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationNe" className="text-base font-medium">Location *</Label>
                      <Input
                        id="locationNe"
                        name="locationNe"
                        value={formData.locationNe}
                        onChange={handleInputChange}
                        placeholder="स्थान (नेपालीमा)"
                        required
                        className="text-base py-3"
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
                      <Label htmlFor="descriptionEn" className="text-base font-medium">Description *</Label>
                      <Textarea
                        id="descriptionEn"
                        name="descriptionEn"
                        value={formData.descriptionEn}
                        onChange={handleInputChange}
                        placeholder="Detailed training description"
                        required
                        rows={4}
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationEn" className="text-base font-medium">Location *</Label>
                      <Input
                        id="locationEn"
                        name="locationEn"
                        value={formData.locationEn}
                        onChange={handleInputChange}
                        placeholder="Location (in English)"
                        required
                        className="text-base py-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-base font-medium">Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="text-base py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-base font-medium">Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      placeholder="10:00 AM - 4:00 PM"
                      required
                      className="text-base py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor" className="text-base font-medium">Instructor *</Label>
                    <Input
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      placeholder="Instructor name"
                      required
                      className="text-base py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants" className="text-base font-medium">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      placeholder="Leave empty for unlimited"
                      className="text-base py-3"
                    />
                  </div>
                </div>

                {/* Topic and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-base font-medium">Topic *</Label>
                    <Select value={formData.topic} onValueChange={(value) => handleSelectChange('topic', value)}>
                      <SelectTrigger className="text-base py-3">
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
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
                    <Label className="text-base font-medium">Active</Label>
                    <div className="flex items-center space-x-2 mt-3">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                      />
                      <Label htmlFor="isActive" className="text-sm text-gray-600">
                        Show on website
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
                        {editingEvent ? 'Update' : 'Create'}
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
                    placeholder="Search events..."
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
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Training Events ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No training events found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {event.titleNe}
                          </h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                          {!event.isActive && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {event.descriptionNe.substring(0, 150) + '...'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {event.locationNe}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4" />
                            {event.instructor}
                          </div>
                        </div>
                        {event.maxParticipants && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <Users className="h-4 w-4" />
                            {event.currentParticipants} / {event.maxParticipants} participants
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
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