'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { User, Edit2, Home, FileText, Trash2, Upload, X, Tag, Gift, Sparkles, TrendingUp, Building2, Plus, Check } from 'lucide-react'
import Navbar from '@/components/navbar'
import { LogoSpinner } from '@/components/logo-spinner'

const CURRENT_ADDRESS_KEY = 'snaplegal_current_address'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('my-account')
  const [documents, setDocuments] = useState([
    { id: '1', name: 'National ID', fileName: 'national-id.pdf', uploadDate: '2024-01-15' },
    { id: '2', name: 'Passport', fileName: 'passport.pdf', uploadDate: '2024-02-20' },
  ])
  const [editingDocId, setEditingDocId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newDocName, setNewDocName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressType, setAddressType] = useState('')
  const [addressLocation, setAddressLocation] = useState('')
  const [addresses, setAddresses] = useState<Array<{ id: string; type: string; location: string; isDefault?: boolean }>>([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [addressesSaving, setAddressesSaving] = useState(false)
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(null)
  const [promotions] = useState([
    {
      id: '1',
      title: 'New Customer Special',
      description: 'Get 20% off on your first service booking',
      discountType: 'percentage',
      discountValue: 20,
      code: 'NEW20',
      validUntil: '2024-12-31',
      status: 'active',
      minOrder: 500,
    },
    {
      id: '2',
      title: 'Weekend Cleaning Deal',
      description: 'Flat ৳300 off on home cleaning services',
      discountType: 'fixed',
      discountValue: 300,
      code: 'CLEAN300',
      validUntil: '2024-03-31',
      status: 'active',
      minOrder: 1000,
    },
    {
      id: '3',
      title: 'AC Service Combo',
      description: '15% discount on AC servicing packages',
      discountType: 'percentage',
      discountValue: 15,
      code: 'AC15',
      validUntil: '2024-04-30',
      status: 'active',
      minOrder: 800,
    },
    {
      id: '4',
      title: 'Referral Bonus',
      description: 'Refer a friend and get ৳200 credit',
      discountType: 'fixed',
      discountValue: 200,
      code: 'REFER200',
      validUntil: '2024-12-31',
      status: 'active',
      minOrder: 0,
    },
  ])

  const menuItems = [
    { id: 'my-account', label: 'My Account' },
    { id: 'my-documents', label: 'My Documents' },
    { id: 'my-addresses', label: 'My Addresses' },
    { id: 'my-promotions', label: 'My Promotions' },
  ]

  // Sync active tab from URL (e.g. /account?tab=my-addresses)
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && menuItems.some((m) => m.id === tab)) setActiveTab(tab)
  }, [searchParams])

  // Fetch addresses from DB when authenticated
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setAddressesLoading(false)
      setAddresses([])
      return
    }
    let cancelled = false
    setAddressesLoading(true)
    fetch('/api/account/addresses')
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Failed to fetch')))
      .then((data) => {
        if (cancelled) return
        const list = (data.addresses || []).map((a: { id: string; type: string; location: string; isDefault?: boolean }) => ({
          id: a.id,
          type: a.type,
          location: a.location,
          isDefault: a.isDefault,
        }))
        setAddresses(list)
        const defaultAddr = list.find((a: { isDefault?: boolean }) => a.isDefault) || list[0]
        if (defaultAddr) {
          setCurrentAddressId(defaultAddr.id)
          persistCurrentAddress(defaultAddr)
        } else {
          setCurrentAddressId(null)
          persistCurrentAddress(null)
        }
      })
      .catch(() => {
        if (!cancelled) setAddresses([])
      })
      .finally(() => {
        if (!cancelled) setAddressesLoading(false)
      })
    return () => { cancelled = true }
  }, [status, session?.user?.id])

  // If current address id is not in the list anymore (e.g. deleted), clear it
  useEffect(() => {
    if (currentAddressId && !addresses.some((a) => a.id === currentAddressId)) {
      setCurrentAddressId(null)
      persistCurrentAddress(null)
    }
  }, [addresses, currentAddressId])

  const persistCurrentAddress = (address: { id: string; type: string; location: string } | null) => {
    if (typeof window === 'undefined') return
    if (address) {
      localStorage.setItem(CURRENT_ADDRESS_KEY, JSON.stringify({ id: address.id, type: address.type, location: address.location }))
    } else {
      localStorage.removeItem(CURRENT_ADDRESS_KEY)
    }
    window.dispatchEvent(new CustomEvent('snaplegal_current_address_updated'))
  }

  const handleSetCurrentAddress = async (address: { id: string; type: string; location: string }) => {
    const prev = currentAddressId
    setCurrentAddressId(address.id)
    persistCurrentAddress(address)
    try {
      const res = await fetch(`/api/account/addresses/${address.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      })
      if (!res.ok) {
        setCurrentAddressId(prev)
        persistCurrentAddress(addresses.find((a) => a.id === prev) || null)
      } else {
        setAddresses((addrs) =>
          addrs.map((a) => ({ ...a, isDefault: a.id === address.id }))
        )
      }
    } catch {
      setCurrentAddressId(prev)
      persistCurrentAddress(addresses.find((a) => a.id === prev) || null)
    }
  }

  // Get user info from session
  const userInfo = {
    name: session?.user?.name || 'N/A',
    phone: (session?.user as any)?.phone || 'N/A',
    email: session?.user?.email || 'N/A',
    dateOfBirth: 'N/A',
    gender: 'N/A',
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
      }
      setDocuments([...documents, newDoc])
      setShowUploadModal(false)
      setNewDocName('')
      setSelectedFile(null)
    }
  }

  const handleAddAddress = async () => {
    if (!addressType.trim()) return
    setAddressesSaving(true)
    try {
      if (editingAddressId) {
        const res = await fetch(`/api/account/addresses/${editingAddressId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: addressType.trim(), location: addressLocation.trim() }),
        })
        if (!res.ok) throw new Error('Update failed')
        const data = await res.json()
        setAddresses((addrs) =>
          addrs.map((addr) =>
            addr.id === editingAddressId
              ? { ...addr, type: data.address.type, location: data.address.location }
              : addr
          )
        )
        if (currentAddressId === editingAddressId) {
          persistCurrentAddress({ id: editingAddressId, type: data.address.type, location: data.address.location })
        }
      } else {
        const isFirst = addresses.length === 0
        const res = await fetch('/api/account/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: addressType.trim(),
            location: addressLocation.trim(),
            isDefault: isFirst,
          }),
        })
        if (!res.ok) throw new Error('Create failed')
        const data = await res.json()
        const newAddr = {
          id: data.address.id,
          type: data.address.type,
          location: data.address.location,
          isDefault: data.address.isDefault,
        }
        setAddresses((addrs) => {
          const next = [...addrs, newAddr]
          return next.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
        })
        if (isFirst) {
          setCurrentAddressId(newAddr.id)
          persistCurrentAddress(newAddr)
          window.dispatchEvent(new CustomEvent('snaplegal_current_address_updated'))
        }
      }
      setShowAddressModal(false)
      setEditingAddressId(null)
      setAddressType('')
      setAddressLocation('')
    } catch {
      alert('Failed to save address. Please try again.')
    } finally {
      setAddressesSaving(false)
    }
  }

  const handleEditAddress = (address: { id: string; type: string; location: string }) => {
    setEditingAddressId(address.id)
    setAddressType(address.type)
    setAddressLocation(address.location)
    setShowAddressModal(true)
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    setAddressesSaving(true)
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      const next = addresses.filter((addr) => addr.id !== id)
      setAddresses(next)
      if (currentAddressId === id) {
        const first = next[0]
        if (first) {
          setCurrentAddressId(first.id)
          persistCurrentAddress(first)
          await fetch(`/api/account/addresses/${first.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDefault: true }),
          })
          window.dispatchEvent(new CustomEvent('snaplegal_current_address_updated'))
        } else {
          setCurrentAddressId(null)
          persistCurrentAddress(null)
        }
      }
    } catch {
      alert('Failed to delete address. Please try again.')
    } finally {
      setAddressesSaving(false)
    }
  }

  const hasAddressType = (type: string) =>
    addresses.some(addr => addr.type.toLowerCase().trim() === type.toLowerCase())

  const openAddAddressWithType = (type: 'Home' | 'Work') => {
    setEditingAddressId(null)
    setAddressType(type)
    setAddressLocation('')
    setShowAddressModal(true)
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
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
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
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
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
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
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
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                      {activeTab === item.id && (
                        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-600"></div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {activeTab === 'my-account' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Personal Info</h1>
                
                {status === 'loading' && (
                  <div className="flex justify-center py-8">
                    <LogoSpinner fullPage={false} size="sm" message="Loading user information..." />
                  </div>
                )}
                
                {status === 'unauthenticated' && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Please sign in to view your account information.</p>
                  </div>
                )}
                
                {status === 'authenticated' && (
                  <>

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

                {/* User Details */}
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Name</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{userInfo.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Phone</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{userInfo.phone}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Email</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{userInfo.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Date of birth</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{userInfo.dateOfBirth}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b gap-2 sm:gap-0">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Gender</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base break-words">{userInfo.gender}</span>
                  </div>
                </div>
                  </>
                )}
              </div>
            )}

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

            {activeTab === 'my-addresses' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Addresses</h1>
                  <button 
                    onClick={() => {
                      setEditingAddressId(null)
                      setAddressType('')
                      setAddressLocation('')
                      setShowAddressModal(true)
                    }}
                    disabled={addressesSaving || (status === 'authenticated' && addressesLoading)}
                    className="px-4 sm:px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm sm:text-base whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Add New Address
                  </button>
                </div>

                {addressesLoading && status === 'authenticated' && (
                  <div className="flex justify-center py-8">
                    <LogoSpinner fullPage={false} size="sm" message="Loading addresses..." />
                  </div>
                )}
                {!addressesLoading && status === 'unauthenticated' && (
                  <p className="text-gray-600 py-4">Sign in to view and manage your addresses.</p>
                )}
                {!addressesLoading && status === 'authenticated' && (
                <>
                {/* Address Cards: Add Home, Add Work (if missing), then saved addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {!hasAddressType('Home') && (
                    <button
                      type="button"
                      onClick={() => openAddAddressWithType('Home')}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-[var(--color-primary)] hover:bg-gray-50/50 transition-colors text-left flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-neutral)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">Add Home</h3>
                        <p className="text-sm text-gray-500">Add your home address</p>
                      </div>
                      <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                    </button>
                  )}
                  {!hasAddressType('Work') && (
                    <button
                      type="button"
                      onClick={() => openAddAddressWithType('Work')}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-[var(--color-primary)] hover:bg-gray-50/50 transition-colors text-left flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-neutral)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">Add Work</h3>
                        <p className="text-sm text-gray-500">Add your work address</p>
                      </div>
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                    </button>
                  )}
                  {addresses.map((address) => {
                    const isCurrent = currentAddressId === address.id
                    return (
                      <div
                        key={address.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSetCurrentAddress(address)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSetCurrentAddress(address)}
                        className={`border-2 rounded-lg p-4 sm:p-6 transition-all cursor-pointer text-left ${
                          isCurrent
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 ring-2 ring-[var(--color-primary)]/30'
                            : 'border-gray-200 hover:border-[var(--color-primary)] hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-neutral)] rounded-lg flex items-center justify-center flex-shrink-0">
                            {address.type.toLowerCase().trim() === 'work' ? (
                              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                            ) : (
                              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900">{address.type}</h3>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)] text-white">
                                  <Check className="w-3 h-3" />
                                  Current address
                                </span>
                              )}
                            </div>
                            {address.location && (
                              <p className="text-sm sm:text-base text-gray-600 break-words mt-1">{address.location}</p>
                            )}
                            {/* {!isCurrent && (
                              <p className="text-xs text-[var(--color-primary)] mt-2 font-medium">Click to set as current address</p>
                            )} */}
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="p-1.5 sm:p-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                </>
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
                        placeholder="e.g., National ID, Passport"
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

            {/* Add / Edit Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full my-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddressModal(false)
                        setEditingAddressId(null)
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
                        placeholder="e.g., Home, Work, Office"
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
                        disabled={!addressType.trim() || addressesSaving}
                        className="flex-1 bg-[var(--color-primary)] text-white py-2.5 sm:py-2 rounded-lg hover:opacity-90 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {addressesSaving ? 'Saving...' : editingAddressId ? 'Save Changes' : 'Add Address'}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddressModal(false)
                          setEditingAddressId(null)
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

            {activeTab === 'my-promotions' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Promotions</h1>
                  
                  {/* Promotions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {promotions.map((promo) => (
                      <div
                        key={promo.id}
                        className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-600 to-[var(--color-primary)] rounded-xl shadow-lg p-4 sm:p-6 text-white border-2 border-white/20"
                      >
                        {/* Decorative Background Elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {/* Sparkle Graphics */}
                          <Sparkles className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 text-white/30 animate-pulse" />
                          <Gift className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 text-white/20 animate-bounce" style={{ animationDuration: '3s' }} />
                          
                          {/* Circular Pattern */}
                          <div className="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
                          <div className="absolute -bottom-8 -left-8 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-2xl"></div>
                        </div>

                        <div className="relative">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
                                <h3 className="text-lg sm:text-xl font-bold drop-shadow-lg truncate">{promo.title}</h3>
                              </div>
                              <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{promo.description}</p>
                            </div>
                            <div className="bg-white/20 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 backdrop-blur-sm flex-shrink-0">
                              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                          </div>

                          {/* Discount Badge */}
                          <div className="bg-white/25 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-white/30">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                              <div>
                                <p className="text-xs text-white/80 mb-1">Discount</p>
                                <p className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-md">
                                  {promo.discountType === 'percentage' 
                                    ? `${promo.discountValue}%` 
                                    : `৳${promo.discountValue}`}
                                </p>
                              </div>
                              <div className="text-left sm:text-right w-full sm:w-auto">
                                <p className="text-xs text-white/80 mb-1">Promo Code</p>
                                <div className="bg-white/30 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-dashed border-white/50">
                                  <p className="text-base sm:text-lg font-bold tracking-wider">{promo.code}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                            {promo.minOrder > 0 && (
                              <div className="flex items-center gap-2 text-white/90">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="break-words">Min. order: ৳{promo.minOrder.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-white/90">
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="break-words">Valid until: {new Date(promo.validUntil).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Copy Code Button */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(promo.code)
                              alert(`Promo code "${promo.code}" copied to clipboard!`)
                            }}
                            className="w-full mt-3 sm:mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-200 border border-white/30 hover:border-white/50 text-sm sm:text-base"
                          >
                            Copy Code
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {promotions.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                      <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-sm sm:text-base text-gray-600">No active promotions available at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'my-account' && activeTab !== 'my-addresses' && activeTab !== 'my-documents' && activeTab !== 'my-promotions' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Content coming soon...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

