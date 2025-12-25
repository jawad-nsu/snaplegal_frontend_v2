'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Edit2, Home, FileText, Trash2, Upload, X, CheckCircle } from 'lucide-react'
import Navbar from '@/components/navbar'

type ServiceStatus = 'submitted' | 'under-review' | 'approved' | 'rejected'

interface Service {
  id: string
  name: string
  category: string
  status: ServiceStatus
  submittedDate: string
  reviewDate?: string
  approvedDate?: string
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

export default function VendorProfilePage() {
  const [activeTab, setActiveTab] = useState('my-account')
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Business License', fileName: 'business-license.pdf', uploadDate: '2024-01-15', source: 'service-management' },
    { id: '2', name: 'Tax Certificate', fileName: 'tax-certificate.pdf', uploadDate: '2024-02-20', source: 'service-management' },
    { id: '3', name: 'Service Certificate', fileName: 'service-cert.pdf', uploadDate: '2024-02-25', source: 'service-management' },
  ])
  const [editingDocId, setEditingDocId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newDocName, setNewDocName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressType, setAddressType] = useState('')
  const [addressLocation, setAddressLocation] = useState('')
  const [addresses, setAddresses] = useState([
    { id: '1', type: 'Business Address', location: 'Gulshan, Dhaka' },
    { id: '2', type: 'Service Location', location: 'Dhanmondi, Dhaka' },
  ])
  const [myServicesTab, setMyServicesTab] = useState('my-segments')
  const [selectedCategory, setSelectedCategory] = useState<string>('ac-repair')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [submittedServices, setSubmittedServices] = useState<Service[]>([])
  const [approvedServices, setApprovedServices] = useState<Service[]>([])

  const menuItems = [
    { id: 'my-account', label: 'My Account' },
    { id: 'my-documents', label: 'My Documents' },
    { id: 'my-addresses', label: 'My Address' },
    { id: 'service-management', label: 'Service Management' },
  ]

  const vendorInfo = {
    name: 'Vendor Name',
    phone: '+8801712345678',
    email: 'vendor@example.com',
    businessName: 'ABC Services Ltd',
    businessType: 'Service Provider',
    registrationNumber: 'REG-123456',
  }

  const getBreadcrumbLabel = () => {
    const activeItem = menuItems.find(item => item.id === activeTab)
    return activeItem?.label || 'My Account'
  }

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id))
    }
  }

  const handleStartEdit = (doc: { id: string; name: string }) => {
    setEditingDocId(doc.id)
    setEditName(doc.name)
  }

  const handleSaveEdit = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, name: editName } : doc
    ))
    setEditingDocId(null)
    setEditName('')
  }

  const handleCancelEdit = () => {
    setEditingDocId(null)
    setEditName('')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadDocument = () => {
    if (selectedFile && newDocName) {
      const newDoc = {
        id: Date.now().toString(),
        name: newDocName,
        fileName: selectedFile.name,
        uploadDate: new Date().toISOString().split('T')[0],
        source: 'service-management' as const,
      }
      setDocuments([...documents, newDoc])
      setShowUploadModal(false)
      setNewDocName('')
      setSelectedFile(null)
    }
  }

  const handleAddAddress = () => {
    if (addressType) {
      const newAddress = {
        id: Date.now().toString(),
        type: addressType,
        location: addressLocation,
      }
      setAddresses([...addresses, newAddress])
      setShowAddressModal(false)
      setAddressType('')
      setAddressLocation('')
    }
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
    setMyServicesTab('requested-services')
  }

  const getCurrentCategoryServices = () => {
    const category = serviceCategories.find(cat => cat.id === selectedCategory)
    if (!category) return []

    if (category.subCategories) {
      const allSubServices: { title: string; slug: string }[] = []
      category.subCategories.forEach(subCat => {
        if (subCat.services) {
          allSubServices.push(...subCat.services)
        }
      })
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl overflow-x-hidden">
        {/* Breadcrumb - Mobile */}
        <div className="mb-4 lg:hidden">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--color-primary)]">
              Home
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <span className="text-gray-900 truncate">{getBreadcrumbLabel()}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1">
            {/* Breadcrumb - Desktop */}
            <div className="hidden lg:block mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-[var(--color-primary)]">
                  Home
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
                <span className="text-gray-900">{getBreadcrumbLabel()}</span>
              </div>
            </div>

            {/* Navigation Menu - Mobile Horizontal Scroll */}
            <nav className="bg-white rounded-lg shadow-sm">
              {/* Mobile: Horizontal scrollable wrapper */}
              <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-2 px-2">
                <ul className="flex space-x-0.5 sm:space-x-1 p-2 min-w-max">
                  {menuItems.map((item) => {
                    const mobileLabel = item.label.replace(/^My /, '')
                    return (
                      <li key={item.id} className="flex-shrink-0">
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={`text-left px-2 sm:px-2.5 py-2 sm:py-3 rounded-md transition-colors relative whitespace-nowrap text-xs sm:text-sm ${
                            activeTab === item.id
                              ? 'bg-gray-100 text-gray-900 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {mobileLabel}
                          {activeTab === item.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></div>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
              {/* Desktop: Original vertical layout */}
              <ul className="hidden lg:block space-y-1 p-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-md transition-colors relative ${
                        activeTab === item.id
                          ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                      {activeTab === item.id && (
                        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-[var(--color-primary)]"></div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {/* My Account Tab */}
            {activeTab === 'my-account' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Personal Info</h1>

                {/* Profile Picture */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center hover:opacity-90 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Name</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{vendorInfo.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Phone</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{vendorInfo.phone}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Email</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{vendorInfo.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Business Name</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{vendorInfo.businessName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Business Type</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{vendorInfo.businessType}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Registration Number</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{vendorInfo.registrationNumber}</span>
                  </div>
                </div>
              </div>
            )}

            {/* My Documents Tab */}
            {activeTab === 'my-documents' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Documents</h1>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 sm:px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="whitespace-nowrap">Upload Document</span>
                  </button>
                </div>

                {/* Documents List */}
                {documents.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-600">No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="border-2 border-gray-200 rounded-lg p-4 sm:p-6 hover:border-[var(--color-primary)] transition-colors"
                      >
                        <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-0">
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-neutral)] rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {editingDocId === doc.id ? (
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 px-3 py-1.5 sm:py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm sm:text-base"
                                    autoFocus
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSaveEdit(doc.id)}
                                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">{doc.name}</h3>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">{doc.fileName}</p>
                                  <p className="text-xs text-gray-500 mt-1">Uploaded: {doc.uploadDate}</p>
                                  {doc.source === 'service-management' && (
                                    <p className="text-xs text-[var(--color-primary)] mt-1">From Service Management</p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          {editingDocId !== doc.id && (
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleStartEdit(doc)}
                                className="p-1.5 sm:p-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                                title="Rename"
                              >
                                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Address Tab */}
            {activeTab === 'my-addresses' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Addresses</h1>
                  <button 
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 sm:px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
                  >
                    Add New Address
                  </button>
                </div>

                {/* Address Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border-2 border-gray-200 rounded-lg p-4 sm:p-6 hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-neutral)] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Home className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{address.type}</h3>
                          {address.location && (
                            <p className="text-sm sm:text-base text-gray-600 break-words">{address.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Management Tab */}
            {activeTab === 'service-management' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Service Management</h1>

                {/* Tabs */}
                <div className="border-b mb-4 sm:mb-6 overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
                  <div className="flex gap-4 sm:gap-6 min-w-max sm:min-w-0">
                    {[
                      { id: 'my-segments', label: 'My Segments' },
                      { id: 'all-segments', label: 'All Segments' },
                      { id: 'requested-services', label: 'Requested Services' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setMyServicesTab(tab.id)}
                        className={`py-2 sm:py-3 px-1 font-medium transition-colors border-b-2 whitespace-nowrap text-sm sm:text-base ${
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
                      <div className="text-center py-8 sm:py-12">
                        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-sm sm:text-base text-gray-600">No approved services yet. Services will appear here once approved by admin.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {approvedServices.map((service) => (
                          <div
                            key={service.id}
                            className="border-2 border-green-200 rounded-lg p-4 sm:p-6 bg-green-50/30 hover:border-green-300 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{service.name}</h3>
                                  {getStatusBadge(service.status)}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Category: {service.category}</p>
                                <p className="text-xs text-gray-500">
                                  Approved: {service.approvedDate}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap">
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
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Sidebar - Categories */}
                    <aside className="lg:w-64 flex-shrink-0">
                      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm lg:sticky lg:top-8">
                        <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Categories</h3>
                        <nav className="space-y-1">
                          {serviceCategories.map((category) => (
                            <div key={category.id}>
                              <button
                                onClick={() => setSelectedCategory(category.id)}
                                className={`w-full text-left flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors text-xs sm:text-sm ${
                                  selectedCategory === category.id
                                    ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-semibold'
                                    : 'text-gray-700 hover:bg-[var(--color-neutral)] hover:text-[var(--color-primary)]'
                                }`}
                              >
                                <span className="text-base sm:text-xl">{category.icon}</span>
                                <span className="truncate">{category.title}</span>
                              </button>
                              {category.subCategories && (
                                <div className="ml-6 sm:ml-8 mt-1 space-y-1">
                                  {category.subCategories.map((subCategory) => {
                                    const isPrimary = subCategory.id === 'fridge-repair' || subCategory.id === 'microwave-repair'
                                    return (
                                      <button
                                        key={subCategory.id}
                                        onClick={() => setSelectedCategory(subCategory.id)}
                                        className={`w-full text-left flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors text-xs sm:text-sm ${
                                          selectedCategory === subCategory.id
                                            ? isPrimary
                                              ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-semibold'
                                              : 'bg-blue-100 text-blue-600 font-semibold'
                                            : isPrimary
                                            ? 'text-gray-600 hover:bg-[var(--color-neutral)] hover:text-[var(--color-primary)]'
                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                      >
                                        {subCategory.icon && <span className="text-sm sm:text-lg">{subCategory.icon}</span>}
                                        <span className="truncate">{subCategory.title}</span>
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
                    <div className="flex-1 min-w-0">
                      {/* Submit Button */}
                      {selectedServices.length > 0 && (
                        <div className="flex justify-end mb-4 sm:mb-6">
                          <button
                            onClick={handleSubmitServices}
                            className="bg-[var(--color-primary)] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2 text-sm sm:text-base"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="whitespace-nowrap">Submit {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} for Review</span>
                          </button>
                        </div>
                      )}

                      {/* Services List */}
                      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                          {serviceCategories.find(cat => cat.id === selectedCategory)?.title || 
                           serviceCategories.find(cat => cat.subCategories?.some(sub => sub.id === selectedCategory))?.subCategories?.find(sub => sub.id === selectedCategory)?.title ||
                           'Services'}
                        </h2>
                        <div className="space-y-3 sm:space-y-4">
                          {getCurrentCategoryServices().map((service) => {
                            return (
                              <div
                                key={service.slug}
                                className={`border-2 rounded-lg p-3 sm:p-4 bg-white transition-colors ${
                                  selectedServices.includes(service.slug)
                                    ? 'border-[var(--color-primary)]/50'
                                    : 'border-gray-200 hover:border-[var(--color-primary)]/30'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{service.title}</h3>
                                      {selectedServices.includes(service.slug) && (
                                        <CheckCircle className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleServiceToggle(service.slug)}
                                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium whitespace-nowrap ${
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
                      <div className="text-center py-8 sm:py-12">
                        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-sm sm:text-base text-gray-600">No requested services yet. Select services from &quot;All Segments&quot; to submit for review.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {submittedServices.map((service) => (
                          <div
                            key={service.id}
                            className="border-2 border-gray-200 rounded-lg p-4 sm:p-6 hover:border-[var(--color-primary)]/30 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{service.name}</h3>
                                  {getStatusBadge(service.status)}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Category: {service.category}</p>
                                <p className="text-xs text-gray-500">
                                  Submitted: {service.submittedDate}
                                  {service.reviewDate && ` • Under Review: ${service.reviewDate}`}
                                </p>
                              </div>
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <button
                                  onClick={() => {
                                    if (confirm('Are you sure you want to withdraw this service request?')) {
                                      setSubmittedServices(prev => prev.filter(s => s.id !== service.id))
                                    }
                                  }}
                                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                                >
                                  Withdraw Request
                                </button>
                                {(service.status === 'submitted' || service.status === 'under-review') && (
                                  <button
                                    onClick={() => handleApproveService(service.id)}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
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

            {/* Upload Modal */}
            {showUploadModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full my-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Upload Document</h2>
                    <button
                      onClick={() => {
                        setShowUploadModal(false)
                        setNewDocName('')
                        setSelectedFile(null)
                      }}
                      className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Label
                      </label>
                      <input
                        type="text"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder="e.g., Business License, Tax Certificate"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select File
                      </label>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm sm:text-base"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      {selectedFile && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 break-words">Selected: {selectedFile.name}</p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleUploadDocument}
                        disabled={!selectedFile || !newDocName}
                        className="flex-1 bg-[var(--color-primary)] text-white py-2.5 sm:py-2 rounded-lg hover:opacity-90 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => {
                          setShowUploadModal(false)
                          setNewDocName('')
                          setSelectedFile(null)
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full my-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Address</h2>
                    <button
                      onClick={() => {
                        setShowAddressModal(false)
                        setAddressType('')
                        setAddressLocation('')
                      }}
                      className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Type
                      </label>
                      <input
                        type="text"
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value)}
                        placeholder="e.g., Business Address, Service Location"
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <textarea
                        value={addressLocation}
                        onChange={(e) => setAddressLocation(e.target.value)}
                        placeholder="Enter your full address"
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none text-sm sm:text-base"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAddAddress}
                        disabled={!addressType}
                        className="flex-1 bg-[var(--color-primary)] text-white py-2.5 sm:py-2 rounded-lg hover:opacity-90 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        Add Address
                      </button>
                      <button
                        onClick={() => {
                          setShowAddressModal(false)
                          setAddressType('')
                          setAddressLocation('')
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

