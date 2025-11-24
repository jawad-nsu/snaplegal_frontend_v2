'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ShoppingCart, User, Home, MessageCircle, Phone, Download, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState('overview')

  const order = {
    id: 'D-1108041',
    service: 'AC Servicing',
    serviceImage: '/plumbing.jpg',
    price: 765.25,
    schedule: {
      date: '16 Nov',
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
    { label: 'Order Placed', completed: true },
    { label: 'Order Confirmed', completed: true },
    { label: 'Order Processing', completed: false },
    { label: 'Order Completed', completed: false },
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
            <Link href="/" className="hover:text-pink-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/account/service-orders" className="hover:text-pink-600">
              Service Order
            </Link>
            <span>/</span>
            <span className="text-gray-900">Order Details</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-6 border-b">
            {['Overview', 'Details', 'FAQ', 'How to Order', 'Review'].map((tab) => {
              const tabKey = tab.toLowerCase().replace(/\s+/g, '-')
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabKey)}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === tabKey
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
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
            <Link href="#" className="text-pink-600 hover:text-pink-700 font-medium ml-4">
              View More
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                <Image
                  src={order.serviceImage}
                  alt={order.service}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-md font-bold text-gray-900 mb-2">{order.id}</p>
                <p className="text-lg font-bold text-gray-900 mb-2">{order.service}</p>
                <p className="text-lg font-bold text-pink-600">৳{order.price.toFixed(2)}</p>
              </div>
              <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors">
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
                <p className="text-gray-900 font-semibold">{order.schedule.date}</p>
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

          {/* Right Column - Bill & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Bill & Payment</h3>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                  DUE
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
                  <span>Amount to be paid</span>
                  <span>৳{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p>* Prices are VAT exclusive</p>
                <p>* Price may vary depending on product availability</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors">
                  Pay Now
                </button>
                <button className="w-full border-2 border-pink-600 text-pink-600 py-3 rounded-lg font-medium hover:bg-pink-50 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Quotation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <p className="text-gray-700 mb-4">Have any queries regarding this order?</p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat</span>
            </button>
            <button className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
              <Phone className="w-5 h-5" />
              <span className="font-medium">16516</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

