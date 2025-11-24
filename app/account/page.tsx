'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, ShoppingCart, User, Edit2, Home, FileText, Trash2, Upload, X } from 'lucide-react'
import Navbar from '@/components/navbar'

export default function AccountPage() {
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

  const menuItems = [
    { id: 'my-account', label: 'My Account' },
    { id: 'my-documents', label: 'My Documents' },
    { id: 'my-addresses', label: 'My Addresses' },
    { id: 'my-offers', label: 'My Offers' },
    { id: 'my-promotions', label: 'My Promotions' },
    { id: 'free-services', label: 'Free Services' },
    { id: 'sheba-credit', label: 'Sheba Credit' },
  ]

  const userInfo = {
    name: 'Sharif H',
    phone: '+8801773241632',
    email: 'N/A',
    dateOfBirth: 'N/A',
    gender: 'N/A',
  }

  const addresses = [
    { id: '1', type: 'Home', location: 'Gulshan' },
    { id: '2', type: 'Add Work', location: '' },
  ]

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
                <Link href="/" className="hover:text-pink-600">
                  Home
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="text-gray-900">{getBreadcrumbLabel()}</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-lg shadow-sm">
              <ul className="space-y-1 p-2">
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
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Personal Info</h1>

                {/* Profile Picture */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600 font-medium">Name</span>
                    <span className="text-gray-900 font-semibold">{userInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600 font-medium">Phone</span>
                    <span className="text-gray-900 font-semibold">{userInfo.phone}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600 font-medium">Email</span>
                    <span className="text-gray-900 font-semibold">{userInfo.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600 font-medium">Date of birth</span>
                    <span className="text-gray-900 font-semibold">{userInfo.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600 font-medium">Gender</span>
                    <span className="text-gray-900 font-semibold">{userInfo.gender}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'my-documents' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>

                {/* Documents List */}
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="border-2 border-gray-200 rounded-lg p-6 hover:border-pink-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 text-pink-600" />
                            </div>
                            <div className="flex-1">
                              {editingDocId === doc.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveEdit(doc.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">{doc.name}</h3>
                                  <p className="text-sm text-gray-600">{doc.fileName}</p>
                                  <p className="text-xs text-gray-500 mt-1">Uploaded: {doc.uploadDate}</p>
                                </>
                              )}
                            </div>
                          </div>
                          {editingDocId !== doc.id && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleStartEdit(doc)}
                                className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                                title="Rename"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
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
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
                  <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
                    Add New Address
                  </button>
                </div>

                {/* Address Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border-2 border-gray-200 rounded-lg p-6 hover:border-pink-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Home className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{address.type}</h3>
                          {address.location && (
                            <p className="text-gray-600">{address.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
                    <button
                      onClick={() => {
                        setShowUploadModal(false)
                        setNewDocName('')
                        setSelectedFile(null)
                      }}
                      className="text-gray-500 hover:text-gray-700"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select File
                      </label>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      {selectedFile && (
                        <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleUploadDocument}
                        disabled={!selectedFile || !newDocName}
                        className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => {
                          setShowUploadModal(false)
                          setNewDocName('')
                          setSelectedFile(null)
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'my-account' && activeTab !== 'my-addresses' && activeTab !== 'my-documents' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h1>
                <p className="text-gray-600">Content coming soon...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

