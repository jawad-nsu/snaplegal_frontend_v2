'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2, Phone, Mail, MapPin, MessageCircle, User, Briefcase, FileText, Tag, UserCircle, Calendar } from 'lucide-react'
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

// Mock data - in a real app, this would come from an API
const mockLeads: Record<string, Lead> = {
  '1': {
    id: '1',
    clientName: 'Ahmed Rahman',
    whatsapp: '+8801712345678',
    mobile: '+8801712345678',
    facebook: 'ahmed.rahman',
    email: 'ahmed@example.com',
    profession: 'Business Owner',
    address: 'Gulshan, Dhaka',
    desiredService: 'AC Servicing',
    initialDiscussion: 'Interested in monthly AC maintenance. Looking for a reliable service provider for regular maintenance of 3 AC units in office.',
    stage: 'Qualified',
    leadSource: 'Website',
    leadSubSource: 'Google Ads',
    leadOwner: 'John Doe',
    comment: 'Follow up next week. Client is very interested and has budget approved. Schedule a site visit.',
    createdAt: '2024-01-15',
  },
  '2': {
    id: '2',
    clientName: 'Fatima Khan',
    whatsapp: '+8801723456789',
    mobile: '+8801723456789',
    email: 'fatima@example.com',
    profession: 'Teacher',
    address: 'Dhanmondi, Dhaka',
    desiredService: 'Home Cleaning',
    initialDiscussion: 'Needs deep cleaning service for 4-bedroom house before Eid. Prefers weekend scheduling.',
    stage: 'Contacted',
    leadSource: 'Social Media',
    leadSubSource: 'Facebook Ads',
    leadOwner: 'Jane Smith',
    comment: 'Very interested. Waiting for quote approval.',
    createdAt: '2024-01-16',
  },
  '3': {
    id: '3',
    clientName: 'Karim Uddin',
    mobile: '+8801734567890',
    email: 'karim@example.com',
    profession: 'Engineer',
    address: 'Banani, Dhaka',
    desiredService: 'Plumbing Services',
    initialDiscussion: 'Urgent plumbing issue - water leakage in bathroom. Needs immediate attention.',
    stage: 'New',
    leadSource: 'Referral',
    leadSubSource: 'Word of Mouth',
    leadOwner: 'John Doe',
    createdAt: '2024-01-17',
  },
  '4': {
    id: '4',
    clientName: 'Sadia Rahman',
    whatsapp: '+8801745678901',
    mobile: '+8801745678901',
    email: 'sadia@example.com',
    profession: 'Doctor',
    address: 'Uttara, Dhaka',
    desiredService: 'Beauty & Wellness',
    initialDiscussion: 'Looking for spa services for monthly relaxation. Interested in package deals.',
    stage: 'Proposal',
    leadSource: 'Website',
    leadSubSource: 'Instagram',
    leadOwner: 'Jane Smith',
    comment: 'Price negotiation in progress. Client wants 20% discount on annual package.',
    createdAt: '2024-01-18',
  },
  '5': {
    id: '5',
    clientName: 'Hasan Ali',
    mobile: '+8801756789012',
    email: 'hasan@example.com',
    profession: 'Student',
    address: 'Mirpur, Dhaka',
    desiredService: 'Electrical Services',
    initialDiscussion: 'Need electrical repair for home. Multiple outlets not working.',
    stage: 'Won',
    leadSource: 'Advertisement',
    leadSubSource: 'Email Campaign',
    leadOwner: 'John Doe',
    comment: 'Converted to customer. Service completed successfully.',
    createdAt: '2024-01-19',
  },
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [lead, setLead] = useState<Lead | null>(mockLeads[id] || null)

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Lead Not Found</h1>
            <Link href="/leads" className="text-[var(--color-primary)] hover:underline">
              Back to Leads
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStageColor = (stage: LeadStage) => {
    const colors = {
      'New': 'bg-gray-100 text-gray-700',
      'Contacted': 'bg-blue-100 text-blue-700',
      'Qualified': 'bg-green-100 text-green-700',
      'Proposal': 'bg-purple-100 text-purple-700',
      'Negotiation': 'bg-yellow-100 text-yellow-700',
      'Won': 'bg-emerald-100 text-emerald-700',
      'Lost': 'bg-red-100 text-red-700',
    }
    return colors[stage]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
            <span className="text-gray-900">{lead.clientName}</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{lead.clientName}</h1>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStageColor(lead.stage)}`}>
                  {lead.stage}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  <span>{lead.leadOwner}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/leads/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => router.push('/leads')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {lead.mobile && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="text-gray-900 font-medium">{lead.mobile}</p>
                    </div>
                  </div>
                )}
                {lead.whatsapp && (
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="text-gray-900 font-medium">{lead.whatsapp}</p>
                    </div>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{lead.email}</p>
                    </div>
                  </div>
                )}
                {lead.facebook && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Facebook</p>
                      <p className="text-gray-900 font-medium">{lead.facebook}</p>
                    </div>
                  </div>
                )}
                {lead.address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900 font-medium">{lead.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lead Details</h2>
              <div className="space-y-4">
                {lead.profession && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Profession</p>
                      <p className="text-gray-900 font-medium">{lead.profession}</p>
                    </div>
                  </div>
                )}
                {lead.desiredService && (
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Desired Service</p>
                      <p className="text-gray-900 font-medium">{lead.desiredService}</p>
                    </div>
                  </div>
                )}
                {lead.initialDiscussion && (
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Initial Discussion</p>
                      <p className="text-gray-900">{lead.initialDiscussion}</p>
                    </div>
                  </div>
                )}
                {lead.comment && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Comment</p>
                      <p className="text-gray-900">{lead.comment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lead Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Stage</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getStageColor(lead.stage)}`}>
                    {lead.stage}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lead Source</p>
                  <p className="text-gray-900 font-medium">{lead.leadSource}</p>
                </div>
                {lead.leadSubSource && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Lead Sub Source</p>
                    <p className="text-gray-900 font-medium">{lead.leadSubSource}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lead Owner</p>
                  <p className="text-gray-900 font-medium">{lead.leadOwner}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created Date</p>
                  <p className="text-gray-900 font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {lead.mobile && (
                  <a
                    href={`tel:${lead.mobile}`}
                    className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Mobile
                  </a>
                )}
                {lead.whatsapp && (
                  <a
                    href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </a>
                )}
                <button
                  onClick={() => router.push(`/leads/${id}/edit`)}
                  className="flex items-center gap-2 w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

