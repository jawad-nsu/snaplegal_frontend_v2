'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ShoppingCart, User, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'

export default function ServiceOrdersPage() {
  const [filter, setFilter] = useState('All')

  const orders = [
    {
      id: 'D-1108041',
      status: 'Initiated',
      service: 'AC Servicing',
      serviceImage: '/plumbing.jpg',
      schedule: '10:00 AM, 17/11/2025',
      duePrice: 765.25,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1">
            {/* Breadcrumb */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-pink-600 text-gray-900">
                  Home
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="text-gray-900">Service Order</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-lg shadow-sm">
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-900 relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600"></div>
                  Service Order
                </h2>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Search and Filter */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option>All</option>
                    <option>Initiated</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Schedule</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Price</th>
                      <th className="text-left py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <span className="text-gray-900 font-medium">{order.id}</span>
                            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={order.serviceImage}
                                alt={order.service}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-gray-900 font-medium">{order.service}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{order.schedule}</td>
                        <td className="py-4 px-4 text-gray-900 font-medium">৳{order.duePrice.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <Link href={`/account/service-orders/${order.id}`} className="text-pink-600 hover:text-pink-700 font-medium">
                            Details &gt;
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing 1 - 10
                </div>
                <div className="text-sm text-gray-900 font-medium">
                  page 1
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

