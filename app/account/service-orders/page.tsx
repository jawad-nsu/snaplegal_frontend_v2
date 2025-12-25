'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1">
            {/* Breadcrumb */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                <Link href="/" className="hover:text-[var(--color-primary)] text-gray-900">
                  Home
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="text-gray-900">Service Order</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-lg shadow-sm">
              <div className="p-3 sm:p-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 relative pl-3 sm:pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600"></div>
                  Service Order
                </h2>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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

              {/* Orders Table - Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Schedule</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Price</th>
                      <th className="text-left py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <span className="text-gray-900 font-medium text-sm">{order.id}</span>
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
                            <span className="text-gray-900 font-medium text-sm">{order.service}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700 text-sm">{order.schedule}</td>
                        <td className="py-4 px-4 text-gray-900 font-medium text-sm">৳{order.duePrice.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <Link href={`/account/service-orders/${order.id}`} className="text-[var(--color-primary)] hover:opacity-80 font-medium text-sm">
                            Details &gt;
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Orders Cards - Mobile View */}
              <div className="md:hidden space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-900 font-semibold text-sm">{order.id}</span>
                          <span className="inline-block px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={order.serviceImage}
                          alt={order.service}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900 font-medium text-sm block">{order.service}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xs">Schedule</span>
                        <span className="text-gray-900 text-sm font-medium">{order.schedule}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xs">Price</span>
                        <span className="text-gray-900 text-sm font-semibold">৳{order.duePrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <Link 
                      href={`/account/service-orders/${order.id}`} 
                      className="block text-center text-[var(--color-primary)] hover:opacity-80 font-medium text-sm py-2"
                    >
                      View Details &gt;
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6 pt-4 border-t">
                <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                  Showing 1 - 10
                </div>
                <div className="text-xs sm:text-sm text-gray-900 font-medium order-1 sm:order-2">
                  page 1
                </div>
                <div className="flex items-center gap-2 order-3">
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

