'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, MessageCircle, Phone, Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react'
import Navbar from '@/components/navbar'

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
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [documentUploads, setDocumentUploads] = useState<Record<string, { name: string; size: string; date: string } | null>>({})

  useEffect(() => {
    fetchOrder()
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
        setOrder(data.order)
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

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; bg: string; color: string }> = {
      Paid: { text: 'PAID', bg: 'bg-green-100', color: 'text-green-800' },
      Pending: { text: 'PENDING', bg: 'bg-yellow-100', color: 'text-yellow-800' },
      Refunded: { text: 'REFUNDED', bg: 'bg-red-100', color: 'text-red-800' },
      Failed: { text: 'FAILED', bg: 'bg-red-100', color: 'text-red-800' },
    }
    
    const badge = statusMap[status] || { text: status.toUpperCase(), bg: 'bg-gray-100', color: 'text-gray-800' }
    
    return (
      <span className={`px-2 sm:px-3 py-1 ${badge.bg} ${badge.color} text-xs font-bold rounded`}>
        {badge.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            <span className="ml-3 text-gray-600">Loading order details...</span>
          </div>
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
            <button
              onClick={() => router.push('/account/service-orders')}
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
            <Link href="/" className="hover:text-[var(--color-primary)] whitespace-nowrap">
              Home
            </Link>
            <span>/</span>
            <Link href="/account/service-orders" className="hover:text-[var(--color-primary)] whitespace-nowrap">
              Service Order
            </Link>
            <span>/</span>
            <span className="text-gray-900 whitespace-nowrap">Order Details</span>
          </div>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{order.orderNumber}</p>
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Service</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{order.service}</p>
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Price</p>
              <p className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">৳{order.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Mobile: Vertical Timeline */}
            <div className="w-full lg:hidden">
              <div className="relative pl-8">
                {/* Vertical line background */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                
                {/* Progress line - fills up to last completed stage */}
                {(() => {
                  let lastCompletedIndex = -1
                  for (let i = order.timelineStages.length - 1; i >= 0; i--) {
                    if (order.timelineStages[i].completed) {
                      lastCompletedIndex = i
                      break
                    }
                  }
                  if (lastCompletedIndex >= 0 && lastCompletedIndex < order.timelineStages.length - 1) {
                    const progressPercent = (lastCompletedIndex / (order.timelineStages.length - 1)) * 100
                    return (
                      <div 
                        className="absolute left-3 top-0 w-0.5 bg-[var(--color-primary)] transition-all duration-500"
                        style={{ height: `${progressPercent}%` }}
                      ></div>
                    )
                  } else if (lastCompletedIndex === order.timelineStages.length - 1) {
                    return (
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[var(--color-primary)]"></div>
                    )
                  }
                  return null
                })()}
                
                {order.timelineStages.map((stage, index) => (
                  <div key={index} className="relative pb-5 last:pb-0">
                    <div className="absolute left-0 top-0 transform -translate-x-1/2 z-10">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          stage.completed
                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-md scale-110'
                            : 'bg-white border-gray-300 shadow-sm'
                        }`}
                      >
                        {stage.completed && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="ml-6">
                      <span className={`text-sm font-semibold ${
                        stage.completed ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {stage.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Horizontal Timeline */}
            <div className="hidden lg:flex items-center gap-1 flex-1">
              {order.timelineStages.map((stage, index) => (
                <div key={index} className="flex items-center gap-1 flex-1">
                  <div className="flex flex-col items-center gap-2.5 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        stage.completed
                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-md scale-110'
                          : 'bg-white border-gray-300 shadow-sm'
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
                    <span className={`text-xs font-semibold text-center leading-tight ${
                      stage.completed ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {stage.label}
                    </span>
                  </div>
                  {index < order.timelineStages.length - 1 && (
                    <div className={`flex-1 h-1 rounded-full transition-all ${
                      stage.completed 
                        ? 'bg-[var(--color-primary)]' 
                        : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            
            <Link href="#" className="text-[var(--color-primary)] hover:opacity-80 font-medium text-sm sm:text-base whitespace-nowrap lg:ml-6 mt-2 lg:mt-0">
              View More
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Bill & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Bill & Payment</h3>
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>

              {/* Itemized Breakdown */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="text-xs sm:text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-700 break-words flex-1">{item.name}</span>
                      <span className="text-gray-900 font-medium flex-shrink-0">৳{item.price.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-500 text-xs ml-0 sm:ml-2 break-words">{item.details?.replace(/1-2\.5\s*Ton/gi, '').trim()}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">৳{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Additional Cost</span>
                  <span className="font-medium">৳{order.additionalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-medium">৳{order.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-600">Discount</span>
                  <span className="font-medium text-green-600">৳{order.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>৳{order.total.toFixed(2)}</span>
                </div>
                {order.paymentMethod && (
                  <div className="flex justify-between text-xs sm:text-sm pt-2">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p>* Prices are VAT exclusive</p>
                <p>* Price may vary depending on product availability</p>
              </div>

              <button className="w-full bg-[var(--color-primary)] text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:opacity-90 transition-colors">
                Cancel Order
              </button>
            </div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Schedule Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Schedule</h3>
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-gray-900 font-semibold">{order.schedule.dateRange}</p>
                <p className="text-sm sm:text-base text-gray-600">{order.schedule.day}</p>
                <p className="text-sm sm:text-base text-gray-600">{order.schedule.timeSlot}</p>
              </div>
            </div>

            {/* Ordered for Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Ordered for</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-900 font-medium">{order.customer.name}</span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 break-words">{order.customer.phone}</p>
                <p className="text-sm sm:text-base text-gray-700 break-words">{order.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Document Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Required Documents</h3>
              
              {/* Required Documents List */}
              <div className="space-y-3">
                {order.requiredDocuments && order.requiredDocuments.length > 0 ? (
                  order.requiredDocuments.map((doc) => {
                  const uploadedFile = documentUploads[doc.id]
                  const isUploaded = !!uploadedFile
                  
                  return (
                    <div
                      key={doc.id}
                      className={`p-3 sm:p-4 border rounded-lg ${
                        isUploaded
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <FileText className={`w-4 h-4 flex-shrink-0 ${
                              isUploaded ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">{doc.name}</span>
                            {doc.required && (
                              <span className="text-xs text-red-600 font-medium whitespace-nowrap">*Required</span>
                            )}
                          </div>
                          
                          {isUploaded ? (
                            <div className="ml-0 sm:ml-6 space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-xs font-medium text-green-600">Uploaded</span>
                              </div>
                              <p className="text-xs text-gray-600 truncate">{uploadedFile.name}</p>
                              <p className="text-xs text-gray-500">{uploadedFile.size} • {uploadedFile.date}</p>
                            </div>
                          ) : (
                            <div className="ml-0 sm:ml-6">
                              <label className="inline-flex items-center gap-2 px-3 py-2 sm:py-1.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors touch-manipulation">
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      setDocumentUploads({
                                        ...documentUploads,
                                        [doc.id]: {
                                          name: file.name,
                                          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                                          date: new Date().toLocaleDateString(),
                                        },
                                      })
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        
                        {isUploaded && (
                          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                            <label className="px-3 py-1.5 sm:px-2 sm:py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors touch-manipulation">
                              Replace
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setDocumentUploads({
                                      ...documentUploads,
                                      [doc.id]: {
                                        name: file.name,
                                        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                                        date: new Date().toLocaleDateString(),
                                      },
                                    })
                                  }
                                }}
                              />
                            </label>
                            <button
                              onClick={() => {
                                setDocumentUploads({
                                  ...documentUploads,
                                  [doc.id]: null,
                                })
                              }}
                              className="p-1.5 sm:p-1 text-red-600 hover:bg-red-50 rounded transition-colors touch-manipulation"
                              title="Remove document"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No documents required for this order</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-4 sm:mt-6">
          <p className="text-sm sm:text-base text-gray-700 mb-4">Have any queries regarding this order?</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <button className="flex items-center justify-center gap-2 text-[var(--color-primary)] hover:opacity-80 py-2 sm:py-0 touch-manipulation">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">Chat</span>
            </button>
            <button className="flex items-center justify-center gap-2 text-[var(--color-primary)] hover:opacity-80 py-2 sm:py-0 touch-manipulation">
              <Phone className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">16516</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

