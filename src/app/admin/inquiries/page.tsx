'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Eye, 
  Trash2, 
  Mail, 
  Phone, 
  MessageSquare,
  Calendar,
  User,
  Search,
  Filter,
  Edit,
  Save,
  X
} from 'lucide-react'

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: string
  priority: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function InquiriesPage() {
  const router = useRouter()
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editFormData, setEditFormData] = useState({
    status: '',
    priority: '',
    notes: ''
  })

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'read', label: 'Read', color: 'bg-blue-100 text-blue-800' },
    { value: 'responded', label: 'Responded', color: 'bg-green-100 text-green-800' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    checkAuth()
    fetchInquiries()
  }, [])

  useEffect(() => {
    fetchInquiries()
  }, [currentPage, filterStatus, filterPriority])

  const checkAuth = () => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
    }
  }

  const fetchInquiries = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterPriority !== 'all' && { priority: filterPriority })
      })

      const response = await fetch(`/api/admin/inquiries?${params}`)
      const data = await response.json()

      if (data.success) {
        setInquiries(data.data)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      setError('Failed to fetch inquiries')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const viewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setEditFormData({
      status: inquiry.status,
      priority: inquiry.priority,
      notes: inquiry.notes || ''
    })
    setShowDetails(true)
    
    // Auto-update status to 'read' if it's 'pending'
    if (inquiry.status === 'pending') {
      updateInquiryStatus(inquiry.id, { status: 'read' })
    }
  }

  const updateInquiryStatus = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (data.success) {
        fetchInquiries()
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, ...updates } : null)
        }
      }
    } catch (error) {
      setError('Failed to update inquiry')
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInquiry) return

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Inquiry updated successfully!')
        setShowEditDialog(false)
        setShowDetails(false)
        fetchInquiries()
      } else {
        setError(data.error || 'Failed to update inquiry')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Inquiry deleted successfully!')
        setShowDetails(false)
        fetchInquiries()
      } else {
        setError(data.error || 'Failed to delete inquiry')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const priorityOption = priorityOptions.find(p => p.value === priority)
    return priorityOption ? priorityOption.color : 'bg-gray-100 text-gray-800'
  }

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
            <p className="text-gray-600 mt-1">Manage contact form submissions</p>
          </div>
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

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search inquiries..."
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
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-48 text-base py-3">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries List */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiries ({filteredInquiries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No inquiries found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => viewInquiry(inquiry)}>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {inquiry.subject}
                          </h3>
                          <Badge className={getStatusColor(inquiry.status)}>
                            {inquiry.status}
                          </Badge>
                          <Badge className={getPriorityColor(inquiry.priority)}>
                            {inquiry.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {inquiry.message.substring(0, 150)}...
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4" />
                            {inquiry.name}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            {inquiry.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              {inquiry.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            viewInquiry(inquiry)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(inquiry.id)
                          }}
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

        {/* Inquiry Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Inquiry Details</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowEditDialog(true)
                      setShowDetails(false)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedInquiry && handleDelete(selectedInquiry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-medium">Name</Label>
                    <p className="text-gray-900 mt-1">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <Label className="text-base font-medium">Email</Label>
                    <p className="text-gray-900 mt-1">{selectedInquiry.email}</p>
                  </div>
                  {selectedInquiry.phone && (
                    <div>
                      <Label className="text-base font-medium">Phone</Label>
                      <p className="text-gray-900 mt-1">{selectedInquiry.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-base font-medium">Date</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Subject and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-base font-medium">Subject</Label>
                    <p className="text-gray-900 mt-1">{selectedInquiry.subject}</p>
                  </div>
                  <div>
                    <Label className="text-base font-medium">Status</Label>
                    <div className="mt-2">
                      <Badge className={getStatusColor(selectedInquiry.status)}>
                        {selectedInquiry.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium">Priority</Label>
                    <div className="mt-2">
                      <Badge className={getPriorityColor(selectedInquiry.priority)}>
                        {selectedInquiry.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label className="text-base font-medium">Message</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedInquiry.notes && (
                  <div>
                    <Label className="text-base font-medium">Admin Notes</Label>
                    <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Inquiry Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Inquiry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-medium">Status</Label>
                  <Select value={editFormData.status} onValueChange={(value) => handleSelectChange('status', value)}>
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
                  <Label htmlFor="priority" className="text-base font-medium">Priority</Label>
                  <Select value={editFormData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                    <SelectTrigger className="text-base py-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base font-medium">Admin Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleInputChange}
                  placeholder="Add internal notes about this inquiry..."
                  rows={4}
                  className="text-base"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
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
                      Update
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}