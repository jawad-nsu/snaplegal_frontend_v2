'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import { LogoSpinner } from '@/components/logo-spinner'

type LeadStage = 'New' | 'Qualified' | 'Proposal' | 'Closed'
type ClosedReason = 'Won' | 'Lost' | 'Lost (Unqualified)'
type LeadSource = 'Website' | 'Referral' | 'Social Media' | 'Advertisement' | 'Cold Call' | 'Other'
type LeadSubSource = 'Facebook Ads' | 'Google Ads' | 'LinkedIn' | 'Instagram' | 'Word of Mouth' | 'Email Campaign' | 'Other'

interface LeadFormData {
  clientName: string
  whatsapp: string
  mobile: string
  facebook: string
  email: string
  profession: string
  street: string
  city: string
  thana: string
  district: string
  country: string
  postalCode: string
  desiredService: string
  initialDiscussion: string
  stage: LeadStage
  closedReason?: ClosedReason
  closedReasonText?: string
  leadSource: LeadSource
  leadSubSource: LeadSubSource
  leadOwner: string
  comment: string
}

const stageOptions: LeadStage[] = ['New', 'Qualified', 'Proposal', 'Closed']
const closedReasonOptions: ClosedReason[] = ['Won', 'Lost', 'Lost (Unqualified)']
const sourceOptions: LeadSource[] = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Cold Call', 'Other']
const subSourceOptions: LeadSubSource[] = ['Facebook Ads', 'Google Ads', 'LinkedIn', 'Instagram', 'Word of Mouth', 'Email Campaign', 'Other']

export default function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [formData, setFormData] = useState<LeadFormData>({
    clientName: '',
    whatsapp: '',
    mobile: '',
    facebook: '',
    email: '',
    profession: '',
    street: '',
    city: '',
    thana: '',
    district: '',
    country: 'Bangladesh',
    postalCode: '',
    desiredService: '',
    initialDiscussion: '',
    stage: 'New',
    leadSource: 'Website',
    leadSubSource: 'Facebook Ads',
    leadOwner: '',
    comment: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch lead data
  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/leads/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch lead')
        }

        if (data.success && data.lead) {
          const lead = data.lead
          setFormData({
            clientName: lead.clientName || '',
            whatsapp: lead.whatsapp || '',
            mobile: lead.mobile || '',
            facebook: lead.facebook || '',
            email: lead.email || '',
            profession: lead.profession || '',
            street: lead.street || '',
            city: lead.city || '',
            thana: lead.thana || '',
            district: lead.district || '',
            country: lead.country || 'Bangladesh',
            postalCode: lead.postalCode || '',
            desiredService: lead.desiredService || '',
            initialDiscussion: lead.initialDiscussion || '',
            stage: lead.stage || 'New',
            closedReason: lead.closedReason || undefined,
            closedReasonText: lead.closedReasonText || '',
            leadSource: lead.leadSource || 'Website',
            leadSubSource: lead.leadSubSource || 'Facebook Ads',
            leadOwner: lead.leadOwner || '',
            comment: lead.comment || '',
          })
        } else {
          throw new Error('Lead not found')
        }
      } catch (err) {
        console.error('Error fetching lead:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch lead')
      } finally {
        setLoading(false)
      }
    }

    fetchLead()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof LeadFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {}

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client Name is required'
    }

    if (!formData.leadOwner.trim()) {
      newErrors.leadOwner = 'Lead Owner is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update lead')
      }

      // Redirect to the lead detail page
      router.push(`/leads/${id}`)
    } catch (error) {
      console.error('Error updating lead:', error)
      alert(error instanceof Error ? error.message : 'Failed to update lead. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LogoSpinner fullPage={false} message="Loading lead..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Error Loading Lead</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href={`/leads/${id}`} className="text-[var(--color-primary)] hover:underline">
              Back to Lead
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-[var(--color-primary)]">
              Home
            </Link>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <Link href="/leads" className="hover:text-[var(--color-primary)]">
              Leads
            </Link>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <Link href={`/leads/${id}`} className="hover:text-[var(--color-primary)]">
              {formData.clientName || 'Lead'}
            </Link>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <span className="text-gray-900">Edit</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Lead</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Update the information below to modify this lead</p>
            </div>
            <Link
              href={`/leads/${id}`}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-6">
          {/* Client Information Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                    errors.clientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.clientName && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
                )}
              </div>

              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Enter profession"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="street" className="block text-xs font-medium text-gray-600 mb-1">
                      House & Road Number
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Enter street address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-xs font-medium text-gray-600 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Enter postal code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">
                      City Corporation
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="thana" className="block text-xs font-medium text-gray-600 mb-1">
                      Thana
                    </label>
                    <input
                      type="text"
                      id="thana"
                      name="thana"
                      value={formData.thana}
                      onChange={handleChange}
                      placeholder="Enter thana"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-xs font-medium text-gray-600 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Enter district"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                 
                  <div>
                    <label htmlFor="country" className="block text-xs font-medium text-gray-600 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+880 1XXX XXXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+880 1XXX XXXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="Facebook username or profile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* Lead Details Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Lead Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="desiredService" className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Service
                </label>
                <input
                  type="text"
                  id="desiredService"
                  name="desiredService"
                  value={formData.desiredService}
                  onChange={handleChange}
                  placeholder="Enter desired service"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <select
                  id="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {stageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {formData.stage === 'Closed' && (
                <>
                  <div>
                    <label htmlFor="closedReason" className="block text-sm font-medium text-gray-700 mb-2">
                      Closed Reason
                    </label>
                    <select
                      id="closedReason"
                      name="closedReason"
                      value={formData.closedReason || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                      <option value="">Select reason</option>
                      {closedReasonOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  {(formData.closedReason === 'Lost' || formData.closedReason === 'Lost (Unqualified)') && (
                    <div>
                      <label htmlFor="closedReasonText" className="block text-sm font-medium text-gray-700 mb-2">
                        Closed Reason Text
                      </label>
                      <input
                        type="text"
                        id="closedReasonText"
                        name="closedReasonText"
                        value={formData.closedReasonText || ''}
                        onChange={handleChange}
                        placeholder="Enter reason for closing"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label htmlFor="leadSource" className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source
                </label>
                <select
                  id="leadSource"
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {sourceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="leadSubSource" className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Sub Source
                </label>
                <select
                  id="leadSubSource"
                  name="leadSubSource"
                  value={formData.leadSubSource}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {subSourceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="leadOwner" className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Owner <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="leadOwner"
                  name="leadOwner"
                  value={formData.leadOwner}
                  onChange={handleChange}
                  placeholder="Enter lead owner name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                    errors.leadOwner ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.leadOwner && (
                  <p className="mt-1 text-sm text-red-600">{errors.leadOwner}</p>
                )}
              </div>
            </div>
          </div>

          {/* Discussion & Comments Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Discussion & Comments</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="initialDiscussion" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Discussion
                </label>
                <textarea
                  id="initialDiscussion"
                  name="initialDiscussion"
                  value={formData.initialDiscussion}
                  onChange={handleChange}
                  placeholder="Enter initial discussion notes..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Enter additional comments..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href={`/leads/${id}`}
              className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

