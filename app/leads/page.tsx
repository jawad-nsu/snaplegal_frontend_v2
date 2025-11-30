'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Filter, Plus, X, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'

type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'
type LeadSource = 'Website' | 'Referral' | 'Social Media' | 'Advertisement' | 'Cold Call' | 'Other'
type LeadSubSource = 'Facebook Ads' | 'Google Ads' | 'LinkedIn' | 'Instagram' | 'Word of Mouth' | 'Email Campaign' | 'Other'

interface Lead {
  id: string
  clientName: string
  whatsapp?: string
  mobile?: string
  facebook?: string
  email?: string
  profession?: string
  address?: string
  desiredService?: string
  initialDiscussion?: string
  stage: LeadStage
  leadSource: LeadSource
  leadSubSource?: LeadSubSource
  leadOwner: string
  comment?: string
  createdAt: string
}

interface CustomListView {
  id: string
  name: string
  filters: FilterCondition[]
  isDefault?: boolean
}

interface FilterCondition {
  field: string
  operator: 'equals' | 'contains' | 'startsWith' | 'notEquals' | 'isEmpty' | 'isNotEmpty'
  value: string
}

const defaultLeads: Lead[] = [
  {
    id: '1',
    clientName: 'Ahmed Rahman',
    whatsapp: '+8801712345678',
    mobile: '+8801712345678',
    facebook: 'ahmed.rahman',
    email: 'ahmed@example.com',
    profession: 'Business Owner',
    address: 'Gulshan, Dhaka',
    desiredService: 'AC Servicing',
    initialDiscussion: 'Interested in monthly AC maintenance',
    stage: 'Qualified',
    leadSource: 'Website',
    leadSubSource: 'Google Ads',
    leadOwner: 'John Doe',
    comment: 'Follow up next week',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    clientName: 'Fatima Khan',
    whatsapp: '+8801723456789',
    mobile: '+8801723456789',
    email: 'fatima@example.com',
    profession: 'Teacher',
    address: 'Dhanmondi, Dhaka',
    desiredService: 'Home Cleaning',
    initialDiscussion: 'Needs deep cleaning service',
    stage: 'Contacted',
    leadSource: 'Social Media',
    leadSubSource: 'Facebook Ads',
    leadOwner: 'Jane Smith',
    comment: 'Very interested',
    createdAt: '2024-01-16',
  },
  {
    id: '3',
    clientName: 'Karim Uddin',
    mobile: '+8801734567890',
    email: 'karim@example.com',
    profession: 'Engineer',
    address: 'Banani, Dhaka',
    desiredService: 'Plumbing Services',
    initialDiscussion: 'Urgent plumbing issue',
    stage: 'New',
    leadSource: 'Referral',
    leadSubSource: 'Word of Mouth',
    leadOwner: 'John Doe',
    createdAt: '2024-01-17',
  },
  {
    id: '4',
    clientName: 'Sadia Rahman',
    whatsapp: '+8801745678901',
    mobile: '+8801745678901',
    email: 'sadia@example.com',
    profession: 'Doctor',
    address: 'Uttara, Dhaka',
    desiredService: 'Beauty & Wellness',
    initialDiscussion: 'Looking for spa services',
    stage: 'Proposal',
    leadSource: 'Website',
    leadSubSource: 'Instagram',
    leadOwner: 'Jane Smith',
    comment: 'Price negotiation in progress',
    createdAt: '2024-01-18',
  },
  {
    id: '5',
    clientName: 'Hasan Ali',
    mobile: '+8801756789012',
    email: 'hasan@example.com',
    profession: 'Student',
    address: 'Mirpur, Dhaka',
    desiredService: 'Electrical Services',
    initialDiscussion: 'Need electrical repair',
    stage: 'Won',
    leadSource: 'Advertisement',
    leadSubSource: 'Email Campaign',
    leadOwner: 'John Doe',
    comment: 'Converted to customer',
    createdAt: '2024-01-19',
  },
]

const fieldOptions = [
  { value: 'clientName', label: 'Client Name' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'email', label: 'Email' },
  { value: 'profession', label: 'Profession' },
  { value: 'address', label: 'Address' },
  { value: 'desiredService', label: 'Desired Service' },
  { value: 'initialDiscussion', label: 'Initial Discussion' },
  { value: 'stage', label: 'Stage' },
  { value: 'leadSource', label: 'Lead Source' },
  { value: 'leadSubSource', label: 'Lead Sub Source' },
  { value: 'leadOwner', label: 'Lead Owner' },
  { value: 'comment', label: 'Comment' },
]

const operatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'isEmpty', label: 'Is Empty' },
  { value: 'isNotEmpty', label: 'Is Not Empty' },
]

const stageOptions: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
const sourceOptions: LeadSource[] = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Cold Call', 'Other']
const subSourceOptions: LeadSubSource[] = ['Facebook Ads', 'Google Ads', 'LinkedIn', 'Instagram', 'Word of Mouth', 'Email Campaign', 'Other']

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>(defaultLeads)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [customViews, setCustomViews] = useState<CustomListView[]>([
    { id: 'all', name: 'All Leads', filters: [], isDefault: true },
  ])
  const [activeViewId, setActiveViewId] = useState('all')
  const [showCreateViewModal, setShowCreateViewModal] = useState(false)
  const [newViewName, setNewViewName] = useState('')
  const [tempFilters, setTempFilters] = useState<FilterCondition[]>([])
  const [editingViewId, setEditingViewId] = useState<string | null>(null)

  const activeView = customViews.find(v => v.id === activeViewId) || customViews[0]

  const applyFilters = (leadsToFilter: Lead[], filters: FilterCondition[]): Lead[] => {
    return leadsToFilter.filter(lead => {
      return filters.every(filter => {
        const fieldValue = String(lead[filter.field as keyof Lead] || '').toLowerCase()
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case 'equals':
            return fieldValue === filterValue
          case 'contains':
            return fieldValue.includes(filterValue)
          case 'startsWith':
            return fieldValue.startsWith(filterValue)
          case 'notEquals':
            return fieldValue !== filterValue
          case 'isEmpty':
            return !lead[filter.field as keyof Lead] || String(lead[filter.field as keyof Lead]) === ''
          case 'isNotEmpty':
            return !!lead[filter.field as keyof Lead] && String(lead[filter.field as keyof Lead]) !== ''
          default:
            return true
        }
      })
    })
  }

  const filteredLeads = (() => {
    let result = [...leads]

    // Apply custom view filters
    if (activeView.filters.length > 0) {
      result = applyFilters(result, activeView.filters)
    }

    // Apply search query
    if (searchQuery) {
      result = result.filter(lead =>
        Object.values(lead).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    return result
  })()

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddFilter = () => {
    setTempFilters([...tempFilters, { field: 'clientName', operator: 'contains', value: '' }])
  }

  const handleRemoveFilter = (index: number) => {
    setTempFilters(tempFilters.filter((_, i) => i !== index))
  }

  const handleUpdateFilter = (index: number, updates: Partial<FilterCondition>) => {
    setTempFilters(tempFilters.map((filter, i) => i === index ? { ...filter, ...updates } : filter))
  }

  const handleSaveView = () => {
    if (!newViewName.trim()) return

    const newView: CustomListView = {
      id: `view-${Date.now()}`,
      name: newViewName,
      filters: [...tempFilters],
    }

    setCustomViews([...customViews, newView])
    setActiveViewId(newView.id)
    setShowCreateViewModal(false)
    setNewViewName('')
    setTempFilters([])
  }

  const handleUpdateView = () => {
    if (!editingViewId) return
    if (!newViewName.trim()) return

    setCustomViews(customViews.map(view =>
      view.id === editingViewId
        ? { ...view, name: newViewName, filters: [...tempFilters] }
        : view
    ))
    setEditingViewId(null)
    setTempFilters([])
    setNewViewName('')
    setShowCreateViewModal(false)
  }

  const handleDeleteView = (viewId: string) => {
    if (customViews.find(v => v.id === viewId)?.isDefault) return
    if (confirm('Are you sure you want to delete this view?')) {
      setCustomViews(customViews.filter(v => v.id !== viewId))
      if (activeViewId === viewId) {
        setActiveViewId('all')
      }
    }
  }

  const handleEditView = (view: CustomListView) => {
    if (view.isDefault) return
    setEditingViewId(view.id)
    setNewViewName(view.name)
    setTempFilters([...view.filters])
    setShowCreateViewModal(true)
  }

  const getFieldValue = (lead: Lead, field: string) => {
    const value = lead[field as keyof Lead]
    if (value === undefined || value === null) return '-'
    return String(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-[var(--color-primary)]">
              Home
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <span className="text-gray-900">Leads</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <button
              onClick={() => router.push('/leads/new')}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Lead
            </button>
          </div>
        </div>

        {/* Custom Views */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">List Views</h2>
            <button
              onClick={() => {
                setShowCreateViewModal(true)
                setEditingViewId(null)
                setTempFilters([])
                setNewViewName('')
              }}
              className="flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80"
            >
              <Plus className="w-4 h-4" />
              Create New View
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {customViews.map((view) => (
              <div
                key={view.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                  activeViewId === view.id
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[var(--color-primary)]'
                }`}
                onClick={() => setActiveViewId(view.id)}
              >
                <span className="font-medium">{view.name}</span>
                {!view.isDefault && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditView(view)
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteView(view.id)
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilterPanel
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[var(--color-primary)]'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeView.filters.length > 0 && (
                <span className="bg-white text-[var(--color-primary)] px-2 py-0.5 rounded-full text-xs font-bold">
                  {activeView.filters.length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                {activeView.filters.length === 0 ? (
                  <p className="text-gray-500 text-sm">No filters applied. Click &quot;Add Filter&quot; to create one.</p>
                ) : (
                  activeView.filters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <select
                        value={filter.field}
                        onChange={(e) => {
                          const updatedView = { ...activeView }
                          updatedView.filters[index].field = e.target.value
                          setCustomViews(customViews.map(v => v.id === activeViewId ? updatedView : v))
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        {fieldOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        value={filter.operator}
                        onChange={(e) => {
                          const updatedView = { ...activeView }
                          updatedView.filters[index].operator = e.target.value as FilterCondition['operator']
                          setCustomViews(customViews.map(v => v.id === activeViewId ? updatedView : v))
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        {operatorOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {!['isEmpty', 'isNotEmpty'].includes(filter.operator) && (
                        <input
                          type="text"
                          value={filter.value}
                          onChange={(e) => {
                            const updatedView = { ...activeView }
                            updatedView.filters[index].value = e.target.value
                            setCustomViews(customViews.map(v => v.id === activeViewId ? updatedView : v))
                          }}
                          placeholder="Value"
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                      )}
                      <button
                        onClick={() => {
                          const updatedView = { ...activeView }
                          updatedView.filters = updatedView.filters.filter((_, i) => i !== index)
                          setCustomViews(customViews.map(v => v.id === activeViewId ? updatedView : v))
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
                <button
                  onClick={() => {
                    const updatedView = { ...activeView }
                    updatedView.filters.push({ field: 'clientName', operator: 'contains', value: '' })
                    setCustomViews(customViews.map(v => v.id === activeViewId ? updatedView : v))
                  }}
                  className="text-[var(--color-primary)] hover:opacity-80 text-sm font-medium"
                >
                  + Add Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No leads found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Client Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">WhatsApp</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Mobile</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Profession</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Desired Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Stage</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Lead Source</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Lead Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 underline"
                          >
                            {lead.clientName}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">{getFieldValue(lead, 'whatsapp')}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{getFieldValue(lead, 'mobile')}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{getFieldValue(lead, 'email')}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{getFieldValue(lead, 'profession')}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{getFieldValue(lead, 'desiredService')}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            lead.stage === 'Won' ? 'bg-green-100 text-green-700' :
                            lead.stage === 'Lost' ? 'bg-red-100 text-red-700' :
                            lead.stage === 'Qualified' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {lead.stage}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">{lead.leadSource}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{lead.leadOwner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
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
        </div>
      </div>

      {/* Create/Edit View Modal */}
      {showCreateViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingViewId ? 'Edit List View' : 'Create New List View'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateViewModal(false)
                  setEditingViewId(null)
                  setTempFilters([])
                  setNewViewName('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">View Name</label>
              <input
                type="text"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="Enter view name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                disabled={!!editingViewId && customViews.find(v => v.id === editingViewId)?.isDefault}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filters</label>
              <div className="space-y-2">
                {tempFilters.length === 0 ? (
                  <p className="text-gray-500 text-sm">No filters. Click &quot;Add Filter&quot; to create one.</p>
                ) : (
                  tempFilters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <select
                        value={filter.field}
                        onChange={(e) => handleUpdateFilter(index, { field: e.target.value })}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        {fieldOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        value={filter.operator}
                        onChange={(e) => handleUpdateFilter(index, { operator: e.target.value as FilterCondition['operator'] })}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        {operatorOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {!['isEmpty', 'isNotEmpty'].includes(filter.operator) && (
                        <input
                          type="text"
                          value={filter.value}
                          onChange={(e) => handleUpdateFilter(index, { value: e.target.value })}
                          placeholder="Value"
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                      )}
                      <button
                        onClick={() => handleRemoveFilter(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
                <button
                  onClick={handleAddFilter}
                  className="text-[var(--color-primary)] hover:opacity-80 text-sm font-medium"
                >
                  + Add Filter
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateViewModal(false)
                  setEditingViewId(null)
                  setTempFilters([])
                  setNewViewName('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingViewId ? handleUpdateView : handleSaveView}
                disabled={!newViewName.trim() || (!!editingViewId && customViews.find(v => v.id === editingViewId)?.isDefault)}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingViewId ? 'Update View' : 'Save View'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

