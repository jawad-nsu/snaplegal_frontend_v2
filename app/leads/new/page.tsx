'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import Navbar from '@/components/navbar'

type LeadStage = 'New' | 'Qualified' | 'Proposal' | 'Closed'
type ClosedReason = 'Won' | 'Lost'
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
  leadSource: LeadSource
  leadSubSource: LeadSubSource
  leadOwner: string
  comment: string
}

const stageOptions: LeadStage[] = ['New', 'Qualified', 'Proposal', 'Closed']
const sourceOptions: LeadSource[] = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Cold Call', 'Other']
const subSourceOptions: LeadSubSource[] = ['Facebook Ads', 'Google Ads', 'LinkedIn', 'Instagram', 'Word of Mouth', 'Email Campaign', 'Other']

export default function NewLeadPage() {
  const router = useRouter()
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
      // In a real app, you would make an API call here
      // For now, we'll just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 500))

      // Generate a new ID (in real app, this would come from the API)
      const newLeadId = Date.now().toString()

      // Redirect to the lead detail page
      router.push(`/leads/${newLeadId}`)
    } catch (error) {
      console.error('Error creating lead:', error)
      alert('Failed to create lead. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--color-primary)]">
              Home
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <Link href="/leads" className="hover:text-[var(--color-primary)]">
              Leads
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <span className="text-gray-900">New Lead</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Lead</h1>
              <p className="text-gray-600 mt-1">Fill in the information below to create a new lead</p>
            </div>
            <Link
              href="/leads"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Client Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lead Details</h2>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Discussion & Comments</h2>
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/leads"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

