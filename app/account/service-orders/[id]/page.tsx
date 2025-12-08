'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { Home, MessageCircle, Phone, Upload, FileText, X, CheckCircle } from 'lucide-react'
import Navbar from '@/components/navbar'

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  // Required documents list
  const requiredDocuments = [
    { id: '1', name: 'National ID Card', required: true },
    { id: '2', name: 'Service Agreement', required: true },
    { id: '3', name: 'Property Ownership Document', required: false },
    { id: '4', name: 'Previous Service Receipt', required: false },
  ]

  const [documentUploads, setDocumentUploads] = useState<Record<string, { name: string; size: string; date: string } | null>>({})

  const order = {
    id: 'D-1108041',
    service: 'AC Servicing',
    serviceImage: '/plumbing.jpg',
    price: 765.25,
    schedule: {
      dateRange: '16 Nov - 20 Nov',
      day: 'Today',
      timeSlot: '9:00 AM - 10:00 AM',
    },
    customer: {
      name: 'Sharif H',
      phone: '+8801773241632',
      address: '105,5,H,6,Gulshan',
    },
    items: [
      { name: 'AC Check Up', details: '1 - 2.5 Ton - xl', price: 757.63 },
      { name: 'AC Check Up', details: '1 - 2.5 Ton - xl', price: 757.63 },
    ],
    subtotal: 1515.25,
    additionalCost: 0,
    deliveryCharge: 0,
    discount: 750,
    total: 765.25,
  }

  const timelineStages = [
    { label: 'Submitted', completed: true },
    { label: 'Confirmed', completed: true },
    { label: 'Assigned', completed: true },
    { label: 'In-Progress', completed: false },
    { label: 'Review', completed: false },
    { label: 'Delivered', completed: false },
    { label: 'Closed', completed: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--color-primary)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/account/service-orders" className="hover:text-[var(--color-primary)]">
              Service Order
            </Link>
            <span>/</span>
            <span className="text-gray-900">Order Details</span>
          </div>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Service</p>
              <p className="text-xl font-bold text-gray-900 mb-2">{order.service}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Price</p>
              <p className="text-2xl font-bold text-[var(--color-primary)]">৳{order.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 flex-1">
              {timelineStages.map((stage, index) => (
                <div key={index} className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        stage.completed
                          ? 'bg-gray-400 border-gray-400'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {stage.completed && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 whitespace-nowrap">{stage.label}</span>
                  </div>
                  {index < timelineStages.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
            <Link href="#" className="text-[var(--color-primary)] hover:opacity-80 font-medium ml-4">
              View More
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Bill & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Bill & Payment</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                  PAID
                </span>
              </div>

              {/* Itemized Breakdown */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-900 font-medium">৳{item.price.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-500 text-xs ml-2">{item.details}</div>
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
                  <span className="font-medium text-green-600">৳{order.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Paid</span>
                  <span>৳{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p>* Prices are VAT exclusive</p>
                <p>* Price may vary depending on product availability</p>
              </div>

              <button className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors">
                Cancel Order
              </button>
            </div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Schedule Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule</h3>
              <div className="space-y-2">
                <p className="text-gray-900 font-semibold">{order.schedule.dateRange}</p>
                <p className="text-gray-600">{order.schedule.day}</p>
                <p className="text-gray-600">{order.schedule.timeSlot}</p>
              </div>
            </div>

            {/* Ordered for Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ordered for</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 font-medium">{order.customer.name}</span>
                </div>
                <p className="text-gray-700">{order.customer.phone}</p>
                <p className="text-gray-700">{order.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Document Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Required Documents</h3>
              
              {/* Required Documents List */}
              <div className="space-y-3">
                {requiredDocuments.map((doc) => {
                  const uploadedFile = documentUploads[doc.id]
                  const isUploaded = !!uploadedFile
                  
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 border rounded-lg ${
                        isUploaded
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className={`w-4 h-4 flex-shrink-0 ${
                              isUploaded ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                            {doc.required && (
                              <span className="text-xs text-red-600 font-medium">*Required</span>
                            )}
                          </div>
                          
                          {isUploaded ? (
                            <div className="ml-6 space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-xs font-medium text-green-600">Uploaded</span>
                              </div>
                              <p className="text-xs text-gray-600 truncate">{uploadedFile.name}</p>
                              <p className="text-xs text-gray-500">{uploadedFile.size} • {uploadedFile.date}</p>
                            </div>
                          ) : (
                            <div className="ml-6">
                              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
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
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <label className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
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
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remove document"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <p className="text-gray-700 mb-4">Have any queries regarding this order?</p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat</span>
            </button>
            <button className="flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80">
              <Phone className="w-5 h-5" />
              <span className="font-medium">16516</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

