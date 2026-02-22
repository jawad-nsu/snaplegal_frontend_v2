'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronDown, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import Navbar from '@/components/navbar'
import { LogoSpinner } from '@/components/logo-spinner'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  orderNumber: string
  status: string
  statusEnum?: string
  service: string
  serviceImage: string
  schedule: string
  duePrice: number
  total?: number
  subtotal?: number
  createdAt?: string
  paymentStatus?: string
  paymentMethod?: string
  requiredDocuments?: Array<{ id: string; name: string; required: boolean }>
}

interface ApiOrder {
  id: string
  orderNumber?: string
  status?: string
  statusEnum?: string
  service?: string
  serviceImage?: string
  schedule?: string
  duePrice?: number
  total?: number
  subtotal?: number
  createdAt?: string
  paymentStatus?: string
  paymentMethod?: string
  requiredDocuments?: Array<{ id: string; name: string; required: boolean }>
}

export default function ServiceOrdersPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (filter !== 'All') {
        params.append('status', filter)
      }

      const response = await fetch(`/api/orders?${params.toString()}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/signin')
          return
        }
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      
      if (data.success && data.orders) {
        // Ensure all orders have the required fields with proper defaults
        const mappedOrders = data.orders.map((order: ApiOrder) => ({
          id: order.id,
          orderNumber: order.orderNumber || 'N/A',
          status: order.status || 'Unknown',
          statusEnum: order.statusEnum,
          service: order.service || 'Service',
          serviceImage: order.serviceImage || '/legal_service_image.jpg',
          schedule: order.schedule || 'Not scheduled',
          duePrice: order.duePrice || order.total || 0,
          total: order.total,
          subtotal: order.subtotal,
          createdAt: order.createdAt,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          requiredDocuments: order.requiredDocuments || [],
        }))
        setOrders(mappedOrders)
        setTotalPages(data.pagination?.totalPages || 1)
        setTotal(data.pagination?.total || 0)
      } else {
        setOrders([])
        if (data.error) {
          setError(data.error)
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Client-side search filtering
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(query) ||
      order.service.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    )
  })

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setPage(1) // Reset to first page when filter changes
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const startIndex = (page - 1) * limit + 1
  const endIndex = Math.min(page * limit, total)

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
                    placeholder="Search by order ID, service, or status"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option>All</option>
                    <option>Initiated</option>
                    <option>Confirmed</option>
                    <option>Assigned</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Delivered</option>
                    <option>Closed</option>
                    <option>Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <LogoSpinner fullPage={false} size="sm" message="Loading orders..." />
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                  <button
                    onClick={fetchOrders}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-sm">No orders found</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-2 text-[var(--color-primary)] hover:opacity-80 text-sm font-medium underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

              {/* Orders Table - Desktop View */}
              {!loading && !error && filteredOrders.length > 0 && (
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Service</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Schedule</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Required Docs</th>
                        <th className="text-left py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-2">
                              <span className="text-gray-900 font-medium text-sm">{order.orderNumber}</span>
                              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                <Image
                                  src={order.serviceImage || '/legal_service_image.jpg'}
                                  alt={order.service || 'Service'}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <span className="text-gray-900 font-medium text-sm">{order.service}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700 text-sm">{order.schedule}</td>
                          <td className="py-4 px-4 text-gray-900 font-medium text-sm">৳{order.duePrice.toFixed(2)}</td>
                          <td className="py-4 px-4">
                            {order.requiredDocuments && order.requiredDocuments.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>{order.requiredDocuments.length} document{order.requiredDocuments.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {order.requiredDocuments.slice(0, 2).map((doc) => (
                                    <span key={doc.id} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                      {doc.name}
                                    </span>
                                  ))}
                                  {order.requiredDocuments.length > 2 && (
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                      +{order.requiredDocuments.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">No documents required</span>
                            )}
                          </td>
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
              )}

              {/* Orders Cards - Mobile View */}
              {!loading && !error && filteredOrders.length > 0 && (
                <div className="md:hidden space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-900 font-semibold text-sm">{order.orderNumber}</span>
                            <span className="inline-block px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          <Image
                            src={order.serviceImage || '/legal_service_image.jpg'}
                            alt={order.service || 'Service'}
                            fill
                            className="object-cover"
                            unoptimized
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
                        {order.requiredDocuments && order.requiredDocuments.length > 0 && (
                          <div className="flex flex-col gap-1.5 pt-2">
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-gray-500" />
                              <span className="text-gray-600 text-xs font-medium">Required Documents ({order.requiredDocuments.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 ml-5">
                              {order.requiredDocuments.map((doc) => (
                                <span key={doc.id} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                  {doc.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
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
              )}

              {/* Pagination */}
              {!loading && !error && total > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6 pt-4 border-t">
                  <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                    {total > 0 ? `Showing ${startIndex} - ${endIndex} of ${total}` : 'No orders'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900 font-medium order-1 sm:order-2">
                    page {page} {totalPages > 1 && `of ${totalPages}`}
                  </div>
                  <div className="flex items-center gap-2 order-3">
                    <button
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

