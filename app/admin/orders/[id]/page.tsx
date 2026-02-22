'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, X, Edit, Save } from 'lucide-react'
import Navbar from '@/components/navbar'
import { LogoSpinner } from '@/components/logo-spinner'
import { Button } from '@/components/ui/button'

interface OrderItem {
  id: string
  name: string
  details: string
  price: number
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  statusEnum: string
  service: string
  serviceImage: string
  price: number
  schedule: {
    dateRange: string
    day: string
    timeSlot: string
  }
  customer: {
    name: string
    phone: string
    address: string
  }
  vendor?: {
    id: string
    name: string
  }
  items: OrderItem[]
  subtotal: number
  additionalCost: number
  deliveryCharge: number
  discount: number
  total: number
  paymentStatus: string
  paymentMethod: string
  timelineStages: Array<{ label: string; completed: boolean }>
  requiredDocuments: Array<{ id: string; name: string; required: boolean }>
  scheduledDate?: string
  scheduledTime?: string
  address?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

type OrderStatus = 'Submitted' | 'Confirmed' | 'Assigned' | 'In-Progress' | 'Review' | 'Delivered' | 'Closed'

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vendors, setVendors] = useState<Array<{ id: string; name: string; status: string }>>([])
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Submitted')

  useEffect(() => {
    fetchOrder()
    fetchVendors()
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/orders/${id}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/signin')
          return
        }
        if (response.status === 404) {
          setError('Order not found')
          setLoading(false)
          return
        }
        throw new Error('Failed to fetch order')
      }

      const data = await response.json()
      
      if (data.success && data.order) {
        // Map status from API format to admin format
        const statusMap: Record<string, OrderStatus> = {
          'Initiated': 'Submitted',
          'In Progress': 'In-Progress',
          'Confirmed': 'Confirmed',
          'Assigned': 'Assigned',
          'Review': 'Review',
          'Delivered': 'Delivered',
          'Closed': 'Closed',
          'Cancelled': 'Closed',
        }
        
        const mappedStatus = statusMap[data.order.status] || data.order.statusEnum || 'Submitted'
        
        setOrder({
          ...data.order,
          status: mappedStatus,
        })
        setSelectedStatus(mappedStatus)
      } else {
        setError(data.error || 'Failed to load order')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/users?type=PARTNER&status=active')
      const data = await response.json()
      
      if (data.success && data.users) {
        setVendors(data.users)
      }
    } catch (err) {
      console.error('Error fetching vendors:', err)
    }
  }

  const handleAssignVendor = async () => {
    if (!selectedVendorId || !order) return

    try {
      // TODO: Implement vendor assignment API call
      // For now, just update local state
      const selectedVendor = vendors.find(v => v.id === selectedVendorId)
      if (selectedVendor) {
        setOrder({
          ...order,
          vendor: {
            id: selectedVendor.id,
            name: selectedVendor.name,
          },
          status: order.status === 'Submitted' ? 'Assigned' : order.status,
        })
        setShowVendorModal(false)
        setSelectedVendorId('')
        alert('Vendor assigned successfully')
      }
    } catch (err) {
      console.error('Error assigning vendor:', err)
      alert('Failed to assign vendor')
    }
  }

  const handleUpdateStatus = async () => {
    if (!order) return

    try {
      // Map frontend status to database enum format
      const statusMap: Record<OrderStatus, string> = {
        'Submitted': 'Submitted',
        'Confirmed': 'Confirmed',
        'Assigned': 'Assigned',
        'In-Progress': 'InProgress',
        'Review': 'Review',
        'Delivered': 'Delivered',
        'Closed': 'Closed',
      }
      
      const dbStatus = statusMap[selectedStatus] || selectedStatus

      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: dbStatus,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/signin')
          return
        }
        if (response.status === 403) {
          alert('You do not have permission to update order status')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update order status')
      }

      const data = await response.json()
      
      if (data.success && data.order) {
        // Map status from API format to admin format
        const apiStatusMap: Record<string, OrderStatus> = {
          'Initiated': 'Submitted',
          'In Progress': 'In-Progress',
          'Confirmed': 'Confirmed',
          'Assigned': 'Assigned',
          'Review': 'Review',
          'Delivered': 'Delivered',
          'Closed': 'Closed',
          'Cancelled': 'Closed',
        }
        
        const mappedStatus = apiStatusMap[data.order.status] || data.order.statusEnum || 'Submitted'
        
        setOrder({
          ...data.order,
          status: mappedStatus,
        })
        setSelectedStatus(mappedStatus)
        setShowStatusModal(false)
        alert('Order status updated successfully')
      } else {
        throw new Error(data.error || 'Failed to update order status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      alert(err instanceof Error ? err.message : 'Failed to update order status')
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; bg: string; color: string }> = {
      paid: { text: 'PAID', bg: 'bg-green-100', color: 'text-green-800' },
      pending: { text: 'PENDING', bg: 'bg-yellow-100', color: 'text-yellow-800' },
      refunded: { text: 'REFUNDED', bg: 'bg-red-100', color: 'text-red-800' },
      failed: { text: 'FAILED', bg: 'bg-red-100', color: 'text-red-800' },
    }
    
    const badge = statusMap[status.toLowerCase()] || { text: status.toUpperCase(), bg: 'bg-gray-100', color: 'text-gray-800' }
    
    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.color} text-xs font-bold rounded-full`}>
        {badge.text}
      </span>
    )
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { bg: string; color: string }> = {
      'Delivered': { bg: 'bg-green-100', color: 'text-green-800' },
      'Closed': { bg: 'bg-gray-100', color: 'text-gray-800' },
      'In-Progress': { bg: 'bg-blue-100', color: 'text-blue-800' },
      'Review': { bg: 'bg-yellow-100', color: 'text-yellow-800' },
      'Confirmed': { bg: 'bg-purple-100', color: 'text-purple-800' },
      'Assigned': { bg: 'bg-purple-100', color: 'text-purple-800' },
      'Submitted': { bg: 'bg-orange-100', color: 'text-orange-800' },
    }
    
    const badge = statusMap[status] || { bg: 'bg-gray-100', color: 'text-gray-800' }
    
    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.color} text-xs font-bold rounded-full`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LogoSpinner fullPage={false} message="Loading order details..." />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">{error || 'Order not found'}</p>
            <Link
              href="/admin"
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline inline-block"
            >
              Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--color-primary)] mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin Dashboard</span>
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {getStatusBadge(order.status as OrderStatus)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Payment</p>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowVendorModal(true)}
              variant="outline"
              className="text-sm"
            >
              {order.vendor ? 'Change Vendor' : 'Assign Vendor'}
            </Button>
            <Button
              onClick={() => setShowStatusModal(true)}
              variant="outline"
              className="text-sm"
            >
              Update Status
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Service Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="text-base font-semibold text-gray-900">{order.service}</p>
                </div>
                {order.vendor && (
                  <div>
                    <p className="text-sm text-gray-600">Assigned Vendor</p>
                    <p className="text-base font-semibold text-gray-900">{order.vendor.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-base text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h3>
              <div className="flex items-center gap-1">
                {order.timelineStages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-1 flex-1">
                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          stage.completed
                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-md'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {stage.completed ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <span className={`text-xs font-semibold text-center ${
                        stage.completed ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {stage.label}
                      </span>
                    </div>
                    {index < order.timelineStages.length - 1 && (
                      <div className={`flex-1 h-1 rounded-full ${
                        stage.completed ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-base font-semibold text-gray-900">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base text-gray-900">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-base text-gray-900">{order.customer.address}</p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            {order.schedule && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule</h3>
                <div className="space-y-2">
                  <p className="text-base text-gray-900 font-semibold">{order.schedule.dateRange}</p>
                  <p className="text-base text-gray-600">{order.schedule.day}</p>
                  {order.schedule.timeSlot && (
                    <p className="text-base text-gray-600">{order.schedule.timeSlot}</p>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
                <p className="text-base text-gray-700 whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Billing */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Details</h3>
              
              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-700 break-words flex-1">{item.name}</span>
                      <span className="text-gray-900 font-medium flex-shrink-0">৳{item.price.toFixed(2)}</span>
                    </div>
                    {item.details && (
                      <div className="text-gray-500 text-xs ml-2 break-words">{item.details}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">৳{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Additional Cost</span>
                  <span className="font-medium">৳{order.additionalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-medium">৳{order.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount</span>
                  <span className="font-medium text-green-600">-৳{order.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>৳{order.total.toFixed(2)}</span>
                </div>
                {order.paymentMethod && (
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Vendor Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Assign Vendor</h2>
              <button onClick={() => setShowVendorModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vendor</label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a vendor...</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={() => setShowVendorModal(false)}>Cancel</Button>
              <Button
                onClick={handleAssignVendor}
                className="bg-[var(--color-primary)] hover:opacity-90"
                disabled={!selectedVendorId}
              >
                Assign Vendor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Update Order Status</h2>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Review">Review</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={() => setShowStatusModal(false)}>Cancel</Button>
              <Button
                onClick={handleUpdateStatus}
                className="bg-[var(--color-primary)] hover:opacity-90"
              >
                Update Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

