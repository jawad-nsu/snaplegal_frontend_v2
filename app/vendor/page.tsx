'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, FileText, DollarSign, Settings, Phone, Search, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import Navbar from '@/components/navbar'

type ServiceStatus = 'submitted' | 'under-review' | 'approved' | 'rejected'
type OrderStatus = 'Submitted' | 'Confirmed' | 'Assigned' | 'In-Progress' | 'Review' | 'Delivered' | 'Closed'

interface Service {
  id: string
  name: string
  category: string
  status: ServiceStatus
  submittedDate: string
  reviewDate?: string
  approvedDate?: string
}

interface OngoingService {
  id: string
  serialNumber: string
  serviceName: string
  status: OrderStatus
  clientName: string
  clientPhone: string
  clientEmail: string
  orderDate: string
}

const serviceCategories = [
  {
    id: 'ac-repair',
    title: 'AC Repair Services',
    icon: '🔧',
    services: [
      { title: 'AC Servicing', slug: 'ac-servicing' },
      { title: 'AC Doctor', slug: 'ac-doctor' },
      { title: 'AC Combo Packages', slug: 'ac-combo-packages' },
      { title: 'AC Cooling Problem', slug: 'ac-cooling-problem' },
      { title: 'AC Installation & Uninstallation', slug: 'ac-installation-uninstallation' },
      { title: 'VRF AC Service', slug: 'vrf-ac-service' },
    ],
  },
  {
    id: 'appliance-repair',
    title: 'Appliance Repair',
    icon: '🔌',
    subCategories: [
      {
        id: 'fridge-repair',
        title: 'Fridge Repair',
        icon: '🧊',
        services: [
          { title: 'Fridge Servicing', slug: 'fridge-servicing' },
          { title: 'Fridge Gas Refill', slug: 'fridge-gas-refill' },
          { title: 'Fridge Not Cooling', slug: 'fridge-not-cooling' },
          { title: 'Fridge Compressor Repair', slug: 'fridge-compressor-repair' },
          { title: 'Fridge Installation', slug: 'fridge-installation' },
        ],
      },
      {
        id: 'microwave-repair',
        title: 'Microwave Repair',
        icon: '🍽️',
        services: [
          { title: 'Microwave Servicing', slug: 'microwave-servicing' },
          { title: 'Microwave Installation', slug: 'microwave-installation' },
          { title: 'Microwave Not Heating', slug: 'microwave-not-heating' },
          { title: 'Microwave Door Repair', slug: 'microwave-door-repair' },
          { title: 'Microwave Panel Replacement', slug: 'microwave-panel-replacement' },
        ],
      },
    ],
    services: [
      { title: 'Refrigerator Services', slug: 'refrigerator-services' },
      { title: 'Washing Machine Services', slug: 'washing-machine-services' },
      { title: 'Kitchen Hood Services', slug: 'kitchen-hood-services' },
      { title: 'IPS Services', slug: 'ips-services' },
      { title: 'Treadmill Services', slug: 'treadmill-services' },
      { title: 'Water Purifier Services', slug: 'water-purifier-services' },
      { title: 'Geyser Services', slug: 'geyser-services' },
      { title: 'Gas Stove/Burner Services', slug: 'gas-stove-burner-services' },
      { title: 'Generator Services', slug: 'generator-services' },
    ],
  },
  {
    id: 'cleaning-solution',
    title: 'Cleaning Solution',
    icon: '🧹',
    services: [
      { title: 'Home Cleaning', slug: 'home-cleaning' },
      { title: 'Cleaning Combo', slug: 'cleaning-combo' },
      { title: 'Furniture & Carpet Cleaning', slug: 'furniture-carpet-cleaning' },
      { title: 'Outdoor Cleaning', slug: 'outdoor-cleaning' },
      { title: 'Appliance Cleaning', slug: 'appliance-cleaning' },
      { title: 'Tank & Pipe Cleaning', slug: 'tank-pipe-cleaning' },
      { title: 'Special Cleaning Combo', slug: 'special-cleaning-combo' },
    ],
  },
  {
    id: 'beauty-wellness',
    title: 'Beauty & Wellness',
    icon: '💅',
    services: [
      { title: 'Nail Extension', slug: 'nail-extension' },
      { title: 'Salon Care', slug: 'salon-care' },
      { title: 'At-home Hair Studio', slug: 'at-home-hair-studio' },
      { title: 'Makeup', slug: 'makeup' },
      { title: 'Spa & Massage', slug: 'spa-massage' },
      { title: 'Hair Care', slug: 'hair-care' },
      { title: 'Skin Care', slug: 'skin-care' },
      { title: 'Nail Care', slug: 'nail-care' },
      { title: 'Bridal Package', slug: 'bridal-package' },
      { title: 'Body Treatment', slug: 'body-treatment' },
      { title: 'Waxing', slug: 'waxing' },
    ],
  },
  {
    id: 'shifting-moving',
    title: 'Shifting & Moving',
    icon: '📦',
    services: [
      { title: 'House Shifting', slug: 'house-shifting' },
      { title: 'Office Shifting', slug: 'office-shifting' },
      { title: 'Local Shifting', slug: 'local-shifting' },
      { title: 'Packing Service', slug: 'packing-service' },
      { title: 'Inter-city Shifting', slug: 'inter-city-shifting' },
      { title: 'International Shifting', slug: 'international-shifting' },
    ],
  },
  {
    id: 'home-repair',
    title: 'Home Repair',
    icon: '🏠',
    services: [
      { title: 'Plumbing Services', slug: 'plumbing-services' },
      { title: 'Electrical Services', slug: 'electrical-services' },
      { title: 'Painting Services', slug: 'painting-services' },
      { title: 'Carpentry Services', slug: 'carpentry-services' },
      { title: 'Sanitary Services', slug: 'sanitary-services' },
      { title: 'Interior Design', slug: 'interior-design' },
      { title: 'Door & Lock Services', slug: 'door-lock-services' },
      { title: 'Welding Services', slug: 'welding-services' },
      { title: 'Glass & Glazing', slug: 'glass-glazing' },
    ],
  },
]

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState('my-services')
  const [myServicesTab, setMyServicesTab] = useState('my-segments')
  const [selectedCategory, setSelectedCategory] = useState<string>('ac-repair')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [submittedServices, setSubmittedServices] = useState<Service[]>([])
  const [approvedServices, setApprovedServices] = useState<Service[]>([])
  const [ongoingServices, setOngoingServices] = useState<OngoingService[]>([
    { id: '1', serialNumber: 'ORD-001', serviceName: 'AC Servicing', status: 'In-Progress', clientName: 'Ahmed Rahman', clientPhone: '+8801712345678', clientEmail: 'ahmed@example.com', orderDate: '2024-01-15' },
    { id: '2', serialNumber: 'ORD-002', serviceName: 'Home Cleaning', status: 'Confirmed', clientName: 'Fatima Khan', clientPhone: '+8801723456789', clientEmail: 'fatima@example.com', orderDate: '2024-01-16' },
    { id: '3', serialNumber: 'ORD-003', serviceName: 'Plumbing Services', status: 'Assigned', clientName: 'Karim Uddin', clientPhone: '+8801734567890', clientEmail: 'karim@example.com', orderDate: '2024-01-17' },
    { id: '4', serialNumber: 'ORD-004', serviceName: 'Electrical Services', status: 'Review', clientName: 'Sadia Rahman', clientPhone: '+8801745678901', clientEmail: 'sadia@example.com', orderDate: '2024-01-18' },
    { id: '5', serialNumber: 'ORD-005', serviceName: 'House Shifting', status: 'Delivered', clientName: 'Hasan Ali', clientPhone: '+8801756789012', clientEmail: 'hasan@example.com', orderDate: '2024-01-19' },
    { id: '6', serialNumber: 'ORD-006', serviceName: 'Salon Care', status: 'Submitted', clientName: 'Nadia Islam', clientPhone: '+8801767890123', clientEmail: 'nadia@example.com', orderDate: '2024-01-20' },
    { id: '7', serialNumber: 'ORD-007', serviceName: 'Fridge Repair', status: 'Closed', clientName: 'Rashid Ahmed', clientPhone: '+8801778901234', clientEmail: 'rashid@example.com', orderDate: '2024-01-21' },
    { id: '8', serialNumber: 'ORD-008', serviceName: 'AC Servicing', status: 'In-Progress', clientName: 'Sara Khan', clientPhone: '+8801789012345', clientEmail: 'sara@example.com', orderDate: '2024-01-22' },
    { id: '9', serialNumber: 'ORD-009', serviceName: 'Home Cleaning', status: 'Confirmed', clientName: 'Tariq Hassan', clientPhone: '+8801790123456', clientEmail: 'tariq@example.com', orderDate: '2024-01-23' },
    { id: '10', serialNumber: 'ORD-010', serviceName: 'Plumbing Services', status: 'Assigned', clientName: 'Zara Ahmed', clientPhone: '+8801701234567', clientEmail: 'zara@example.com', orderDate: '2024-01-24' },
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const menuItems = [
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'ongoing-services', label: 'All Orders', icon: Settings },
    { id: 'my-services', label: 'Service Management', icon: CheckCircle },
  ]

  const getBreadcrumbLabel = () => {
    const activeItem = menuItems.find(item => item.id === activeTab)
    return activeItem?.label || 'Vendor Dashboard'
  }

  const handleServiceToggle = (serviceSlug: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceSlug)
        ? prev.filter(id => id !== serviceSlug)
        : [...prev, serviceSlug]
    )
  }

  const handleSubmitServices = () => {
    if (selectedServices.length === 0) return

    const newServices: Service[] = selectedServices.map(serviceSlug => {
      // Find the service in categories
      let serviceName = serviceSlug
      let categoryName = ''
      
      for (const cat of serviceCategories) {
        const found = cat.services?.find(s => s.slug === serviceSlug)
        if (found) {
          serviceName = found.title
          categoryName = cat.title
          break
        }
        if (cat.subCategories) {
          for (const subCat of cat.subCategories) {
            const found = subCat.services?.find(s => s.slug === serviceSlug)
            if (found) {
              serviceName = found.title
              categoryName = cat.title
              break
            }
          }
        }
      }

      const timestamp = new Date().getTime()
      return {
        id: `${timestamp}-${serviceSlug}`,
        name: serviceName,
        category: categoryName,
        status: 'submitted' as ServiceStatus,
        submittedDate: new Date().toISOString().split('T')[0],
      }
    })

    setSubmittedServices(prev => [...prev, ...newServices])
    setSelectedServices([])
    // Switch to requested services tab
    setMyServicesTab('requested-services')
  }

  const getCurrentCategoryServices = () => {
    const category = serviceCategories.find(cat => cat.id === selectedCategory)
    if (!category) return []

    // If category has subcategories, find the selected subcategory
    if (category.subCategories) {
      // For now, show all subcategory services
      const allSubServices: { title: string; slug: string }[] = []
      category.subCategories.forEach(subCat => {
        if (subCat.services) {
          allSubServices.push(...subCat.services)
        }
      })
      // Also include main category services
      if (category.services) {
        allSubServices.push(...category.services)
      }
      return allSubServices
    }

    return category.services || []
  }


  const getStatusBadge = (status: ServiceStatus) => {
    const styles = {
      submitted: 'bg-gray-100 text-gray-700 border-gray-300',
      'under-review': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-300',
    }

    const labels = {
      submitted: 'Submitted',
      'under-review': 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  // Simulate admin approval (for demo purposes)
  const handleApproveService = (serviceId: string) => {
    const service = submittedServices.find(s => s.id === serviceId)
    if (service) {
      const approvedService: Service = {
        ...service,
        status: 'approved',
        reviewDate: new Date().toISOString().split('T')[0],
        approvedDate: new Date().toISOString().split('T')[0],
      }
      setSubmittedServices(prev => prev.filter(s => s.id !== serviceId))
      setApprovedServices(prev => [...prev, approvedService])
    }
  }


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
                <Link href="/" className="hover:text-[var(--color-primary)]">
                  Home
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
                <span className="text-gray-900">{getBreadcrumbLabel()}</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-lg shadow-sm">
              <ul className="space-y-1 p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors relative flex items-center gap-3 ${
                          activeTab === item.id
                            ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                        {activeTab === item.id && (
                          <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-[var(--color-primary)]"></div>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {/* Service Management Tab */}
            {activeTab === 'my-services' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Management</h1>

                {/* Tabs */}
                <div className="border-b mb-6">
                  <div className="flex gap-6">
                    {[
                      { id: 'my-segments', label: 'My Segments' },
                      { id: 'all-segments', label: 'All Segments' },
                      { id: 'requested-services', label: 'Requested Services' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setMyServicesTab(tab.id)}
                        className={`py-3 px-1 font-medium transition-colors border-b-2 ${
                          myServicesTab === tab.id
                            ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                            : 'text-gray-600 border-transparent hover:text-gray-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* My Segments Tab */}
                {myServicesTab === 'my-segments' && (
                  <div>
                    {approvedServices.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No approved services yet. Services will appear here once approved by admin.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {approvedServices.map((service) => (
                          <div
                            key={service.id}
                            className="border-2 border-green-200 rounded-lg p-6 bg-green-50/30 hover:border-green-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                                  {getStatusBadge(service.status)}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Category: {service.category}</p>
                                <p className="text-xs text-gray-500">
                                  Approved: {service.approvedDate}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium">
                                  Manage
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* All Segments Tab */}
                {myServicesTab === 'all-segments' && (
                  <div className="flex gap-8">
                    {/* Left Sidebar - Categories */}
                    <aside className="w-64 flex-shrink-0">
                      <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
                        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                        <nav className="space-y-1">
                          {serviceCategories.map((category) => (
                            <div key={category.id}>
                              <button
                                onClick={() => setSelectedCategory(category.id)}
                                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                  selectedCategory === category.id
                                    ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-semibold'
                                    : 'text-gray-700 hover:bg-[var(--color-neutral)] hover:text-[var(--color-primary)]'
                                }`}
                              >
                                <span className="text-xl">{category.icon}</span>
                                <span>{category.title}</span>
                              </button>
                              {category.subCategories && (
                                <div className="ml-8 mt-1 space-y-1">
                                  {category.subCategories.map((subCategory) => {
                                    const isPrimary = subCategory.id === 'fridge-repair' || subCategory.id === 'microwave-repair'
                                    return (
                                      <button
                                        key={subCategory.id}
                                        onClick={() => setSelectedCategory(subCategory.id)}
                                        className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                          selectedCategory === subCategory.id
                                            ? isPrimary
                                              ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-semibold'
                                              : 'bg-blue-100 text-blue-600 font-semibold'
                                            : isPrimary
                                            ? 'text-gray-600 hover:bg-[var(--color-neutral)] hover:text-[var(--color-primary)]'
                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                      >
                                        {subCategory.icon && <span className="text-lg">{subCategory.icon}</span>}
                                        <span>{subCategory.title}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </nav>
                      </div>
                    </aside>

                    {/* Right Content - Services */}
                    <div className="flex-1">
                      {/* Submit Button */}
                      {selectedServices.length > 0 && (
                        <div className="flex justify-end mb-6">
                          <button
                            onClick={handleSubmitServices}
                            className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Submit {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} for Review
                          </button>
                        </div>
                      )}

                      {/* Services List */}
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                          {serviceCategories.find(cat => cat.id === selectedCategory)?.title || 
                           serviceCategories.find(cat => cat.subCategories?.some(sub => sub.id === selectedCategory))?.subCategories?.find(sub => sub.id === selectedCategory)?.title ||
                           'Services'}
                        </h2>
                        <div className="space-y-4">
                          {getCurrentCategoryServices().map((service) => {
                            return (
                              <div
                                key={service.slug}
                                className={`border-2 rounded-lg p-4 bg-white transition-colors ${
                                  selectedServices.includes(service.slug)
                                    ? 'border-[var(--color-primary)]/50'
                                    : 'border-gray-200 hover:border-[var(--color-primary)]/30'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-base font-semibold text-gray-900">{service.title}</h3>
                                      {selectedServices.includes(service.slug) && (
                                        <CheckCircle className="w-4 h-4 text-[var(--color-primary)]" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleServiceToggle(service.slug)}
                                      className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                        selectedServices.includes(service.slug)
                                          ? 'bg-[var(--color-primary)] text-white hover:opacity-90'
                                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                                      }`}
                                    >
                                      {selectedServices.includes(service.slug) ? 'Selected' : 'Select Service'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Requested Services Tab */}
                {myServicesTab === 'requested-services' && (
                  <div>
                    {submittedServices.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No requested services yet. Select services from &quot;All Segments&quot; to submit for review.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {submittedServices.map((service) => (
                          <div
                            key={service.id}
                            className="border-2 border-gray-200 rounded-lg p-6 hover:border-[var(--color-primary)]/30 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                                  {getStatusBadge(service.status)}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Category: {service.category}</p>
                                <p className="text-xs text-gray-500">
                                  Submitted: {service.submittedDate}
                                  {service.reviewDate && ` • Under Review: ${service.reviewDate}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    if (confirm('Are you sure you want to withdraw this service request?')) {
                                      setSubmittedServices(prev => prev.filter(s => s.id !== service.id))
                                    }
                                  }}
                                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                >
                                  Withdraw Request
                                </button>
                                {(service.status === 'submitted' || service.status === 'under-review') && (
                                  <button
                                    onClick={() => handleApproveService(service.id)}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                  >
                                    Approve
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* All Orders Tab */}
            {activeTab === 'ongoing-services' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">All Orders</h1>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by service name, client name, or serial number..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as OrderStatus | 'All')
                      setCurrentPage(1)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="All">All Status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Review">Review</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Table */}
                {(() => {
                  const filteredServices = ongoingServices.filter(service => {
                    const matchesSearch = 
                      service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      service.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      service.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
                    const matchesStatus = statusFilter === 'All' || service.status === statusFilter
                    return matchesSearch && matchesStatus
                  })

                  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
                  const paginatedServices = filteredServices.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )

                  const getStatusColor = (status: OrderStatus) => {
                    const colors = {
                      'Submitted': 'bg-gray-100 text-gray-700 border-gray-300',
                      'Confirmed': 'bg-blue-100 text-blue-700 border-blue-300',
                      'Assigned': 'bg-purple-100 text-purple-700 border-purple-300',
                      'In-Progress': 'bg-yellow-100 text-yellow-700 border-yellow-300',
                      'Review': 'bg-orange-100 text-orange-700 border-orange-300',
                      'Delivered': 'bg-green-100 text-green-700 border-green-300',
                      'Closed': 'bg-gray-200 text-gray-800 border-gray-400',
                    }
                    return colors[status]
                  }

                  return (
                    <>
                      {filteredServices.length === 0 ? (
                        <div className="text-center py-12">
                          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600">No orders found matching your criteria.</p>
                        </div>
                      ) : (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Serial #</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Service Name</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact Info</th>
                                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedServices.map((service) => (
                                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                      <span className="font-medium text-gray-900">{service.serialNumber}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                      <div>
                                        <p className="font-medium text-gray-900">{service.serviceName}</p>
                                        <p className="text-sm text-gray-500">{service.clientName}</p>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4">
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                                        {service.status}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                          <Phone className="w-4 h-4" />
                                          <span>{service.clientPhone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                          <FileText className="w-4 h-4" />
                                          <span className="truncate max-w-[200px]">{service.clientEmail}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="flex items-center justify-center gap-2">
                                        <button
                                          className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-neutral)] rounded-lg transition-colors"
                                          title="View Details"
                                        >
                                          <Info className="w-5 h-5" />
                                        </button>
                                        <select
                                          value={service.status}
                                          onChange={(e) => {
                                            setOngoingServices(prev =>
                                              prev.map(s =>
                                                s.id === service.id
                                                  ? { ...s, status: e.target.value as OrderStatus }
                                                  : s
                                              )
                                            )
                                          }}
                                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} orders
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentPage === 1}
                                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                      key={page}
                                      onClick={() => setCurrentPage(page)}
                                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                          ? 'bg-[var(--color-primary)] text-white'
                                          : 'border border-gray-300 hover:bg-gray-50'
                                      }`}
                                    >
                                      {page}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                  disabled={currentPage === totalPages}
                                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Payments</h1>
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Payment information will be displayed here.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

