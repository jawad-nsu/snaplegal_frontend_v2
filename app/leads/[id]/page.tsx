'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2, Phone, Mail, MapPin, MessageCircle, User, Briefcase, FileText, Tag, UserCircle, Calendar, CheckSquare, Plus, Trash2, Clock, CheckCircle, ChevronDown, ChevronUp, Save, X } from 'lucide-react'
import Navbar from '@/components/navbar'

type LeadStage = 'New' | 'Qualified' | 'Proposal' | 'Closed'
type ClosedReason = 'Won' | 'Lost' | 'Lost (Unqualified)'
type LeadSource = 'Website' | 'Referral' | 'Social Media' | 'Advertisement' | 'Cold Call' | 'Other'
type LeadSubSource = 'Facebook Ads' | 'Google Ads' | 'LinkedIn' | 'Instagram' | 'Word of Mouth' | 'Email Campaign' | 'Other'
type TaskStatus = 'Not Started' | 'In Progress' | 'Completed'
type TaskPriority = 'Low' | 'Normal' | 'High'

interface Task {
  id: string
  subject: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assignedTo: string
  createdAt: string
  completedDate?: string
}

interface Lead {
  id: string
  clientName: string
  whatsapp?: string
  mobile?: string
  facebook?: string
  email?: string
  profession?: string
  street?: string
  city?: string
  thana?: string
  district?: string
  country?: string
  postalCode?: string
  desiredService?: string
  initialDiscussion?: string
  stage: LeadStage
  closedReason?: ClosedReason
  closedReasonText?: string
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
    street: 'House 45, Road 12',
    city: 'Gulshan',
    thana: 'Gulshan',
    district: 'Dhaka',
    country: 'Bangladesh',
    postalCode: '1212',
    desiredService: 'AC Servicing',
    initialDiscussion: 'Interested in monthly AC maintenance. Looking for a reliable service provider for regular maintenance of 3 AC units in office.',
    stage: 'Proposal',
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
    street: 'Road 27, House 8',
    city: 'Dhanmondi',
    thana: 'Dhanmondi',
    district: 'Dhaka',
    country: 'Bangladesh',
    postalCode: '1205',
    desiredService: 'Home Cleaning',
    initialDiscussion: 'Needs deep cleaning service for 4-bedroom house before Eid. Prefers weekend scheduling.',
    stage: 'New',
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
    street: 'Road 11, House 23',
    city: 'Banani',
    thana: 'Banani',
    district: 'Dhaka',
    country: 'Bangladesh',
    postalCode: '1213',
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
    street: 'Sector 7, Road 15',
    city: 'Uttara',
    thana: 'Uttara',
    district: 'Dhaka',
    country: 'Bangladesh',
    postalCode: '1230',
    desiredService: 'Beauty & Wellness',
    initialDiscussion: 'Looking for spa services for monthly relaxation. Interested in package deals.',
    stage: 'Qualified',
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
    street: 'Block C, Road 5',
    city: 'Mirpur',
    thana: 'Mirpur',
    district: 'Dhaka',
    country: 'Bangladesh',
    postalCode: '1216',
    desiredService: 'Electrical Services',
    initialDiscussion: 'Need electrical repair for home. Multiple outlets not working.',
    stage: 'Closed',
    closedReason: 'Won',
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
  
  // Initialize tasks with default "Follow up call" task for new leads
  const [tasks, setTasks] = useState<Task[]>(() => {
    const currentLead = mockLeads[id] || null
    if (currentLead) {
      // Create default task for new lead
      const defaultTask: Task = {
        id: `task-${Date.now()}`,
        subject: 'Follow up call',
        description: '',
        status: 'Not Started',
        priority: 'Normal',
        assignedTo: currentLead.leadOwner || 'Unassigned',
        createdAt: new Date().toISOString().split('T')[0],
      }
      return [defaultTask]
    }
    return []
  })
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'All'>('All')
  const [newTask, setNewTask] = useState({
    subject: '',
    dueDate: '',
  })
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingDescription, setEditingDescription] = useState('')
  const [followUpDueDate, setFollowUpDueDate] = useState('')
  const [followUpSubject, setFollowUpSubject] = useState('Follow up')
  const [showClosedReasonModal, setShowClosedReasonModal] = useState(false)
  const [selectedClosedReason, setSelectedClosedReason] = useState<ClosedReason | null>(null)
  const [closedReasonText, setClosedReasonText] = useState('')
  const [closedReasonError, setClosedReasonError] = useState('')

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

  const getStageColor = (stage: LeadStage, closedReason?: ClosedReason) => {
    if (stage === 'Closed') {
      if (closedReason === 'Won') {
        return 'bg-green-100 text-green-700'
      } else if (closedReason === 'Lost' || closedReason === 'Lost (Unqualified)') {
        return 'bg-red-100 text-red-700'
      }
      return 'bg-gray-100 text-gray-700'
    }
    const colors = {
      'New': 'bg-blue-100 text-blue-700',
      'Qualified': 'bg-purple-100 text-purple-700',
      'Proposal': 'bg-orange-100 text-orange-700',
    }
    return colors[stage]
  }

  const getStageDisplayText = (stage: LeadStage, closedReason?: ClosedReason) => {
    if (stage === 'Closed') {
      if (closedReason === 'Won') {
        return 'Closed Won'
      } else if (closedReason === 'Lost') {
        return 'Closed Lost'
      } else if (closedReason === 'Lost (Unqualified)') {
        return 'Closed Lost (Unqualified)'
      }
      return 'Closed'
    }
    return stage
  }


  const handleCreateTask = () => {
    if (!newTask.subject.trim()) {
      alert('Please select a task subject')
      return
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      subject: newTask.subject,
      description: '',
      status: 'Not Started',
      priority: 'Normal',
      dueDate: newTask.dueDate || undefined,
      assignedTo: lead?.leadOwner || 'Unassigned',
      createdAt: new Date().toISOString().split('T')[0],
    }

    setTasks([...tasks, task])
    setNewTask({
      subject: '',
      dueDate: '',
    })
    setShowTaskForm(false)
  }

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus,
          completedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
        }
      }
      return task
    }))
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId))
    }
  }

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const handleStartEditDescription = (task: Task) => {
    setEditingTaskId(task.id)
    setEditingDescription(task.description || '')
    setFollowUpDueDate('')
    setFollowUpSubject('Follow up')
  }

  const handleSaveDescription = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, description: editingDescription }
        : task
    ))
    setEditingTaskId(null)
    setEditingDescription('')
  }

  const handleCancelEditDescription = () => {
    setEditingTaskId(null)
    setEditingDescription('')
    setFollowUpDueDate('')
    setFollowUpSubject('Follow up')
  }

  const handleSaveAndCreateFollowUp = (taskId: string) => {
    // Mark current task as completed and save the description
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { 
            ...task, 
            description: editingDescription,
            status: 'Completed' as TaskStatus,
            completedDate: new Date().toISOString().split('T')[0]
          }
        : task
    )

    // Create new Follow up task
    if (followUpDueDate) {
      const newFollowUpTask: Task = {
        id: `task-${Date.now()}`,
        subject: followUpSubject || 'Follow up',
        description: '',
        status: 'Not Started',
        priority: 'Normal',
        dueDate: followUpDueDate,
        assignedTo: lead?.leadOwner || 'Unassigned',
        createdAt: new Date().toISOString().split('T')[0],
      }
      setTasks([...updatedTasks, newFollowUpTask])
    } else {
      // If no due date, just update the current task
      setTasks(updatedTasks)
    }

    // Reset editing state
    setEditingTaskId(null)
    setEditingDescription('')
    setFollowUpDueDate('')
    setFollowUpSubject('Follow up')
  }

  const filteredTasks = taskFilter === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === taskFilter)

  const leadStages: LeadStage[] = ['New', 'Qualified', 'Proposal', 'Closed']
  const currentStageIndex = leadStages.indexOf(lead.stage)

  const handleStageChange = (newStage: LeadStage) => {
    if (newStage === 'Closed') {
      // Show modal to select Won or Lost
      setShowClosedReasonModal(true)
    } else {
      if (confirm(`Are you sure you want to change the lead stage to "${newStage}"?`)) {
        setLead({ ...lead, stage: newStage, closedReason: undefined })
        // In a real app, you would make an API call here to update the lead
      }
    }
  }

  const handleClosedReasonSelect = (reason: ClosedReason) => {
    setSelectedClosedReason(reason)
    setClosedReasonError('')
    // If it's Won, proceed directly. If it's Lost or Lost (Unqualified), show the text field requirement
    if (reason === 'Won') {
      if (confirm(`Are you sure you want to close this lead as "Closed Won"?`)) {
        setLead({ ...lead, stage: 'Closed', closedReason: reason, closedReasonText: undefined })
        setShowClosedReasonModal(false)
        setSelectedClosedReason(null)
        setClosedReasonText('')
        // In a real app, you would make an API call here to update the lead
      }
    }
  }

  const handleCloseLead = () => {
    if (!selectedClosedReason) return

    // Validate closed reason text for Lost cases
    if ((selectedClosedReason === 'Lost' || selectedClosedReason === 'Lost (Unqualified)') && !closedReasonText.trim()) {
      setClosedReasonError('Please provide a reason for closing this lead as lost.')
      return
    }

    if (confirm(`Are you sure you want to close this lead as "${selectedClosedReason === 'Won' ? 'Closed Won' : selectedClosedReason}"?`)) {
      setLead({ 
        ...lead, 
        stage: 'Closed', 
        closedReason: selectedClosedReason,
        closedReasonText: (selectedClosedReason === 'Lost' || selectedClosedReason === 'Lost (Unqualified)') ? closedReasonText.trim() : undefined
      })
      setShowClosedReasonModal(false)
      setSelectedClosedReason(null)
      setClosedReasonText('')
      setClosedReasonError('')
      // In a real app, you would make an API call here to update the lead
    }
  }

  const getPathStageColor = (stage: LeadStage, isCurrent: boolean, isCompleted: boolean, closedReason?: ClosedReason) => {
    if (isCompleted) {
      return {
        bg: 'bg-green-500',
        text: 'text-white',
        border: 'border-green-500',
        connector: 'bg-green-500'
      }
    }
    if (isCurrent) {
      if (stage === 'Closed') {
        if (closedReason === 'Won') {
          return { bg: 'bg-green-600', text: 'text-white', border: 'border-green-600', connector: 'bg-green-600' }
        } else if (closedReason === 'Lost' || closedReason === 'Lost (Unqualified)') {
          return { bg: 'bg-red-600', text: 'text-white', border: 'border-red-600', connector: 'bg-red-600' }
        }
        return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500', connector: 'bg-gray-500' }
      }
      const colors: Record<Exclude<LeadStage, 'Closed'>, { bg: string; text: string; border: string; connector: string }> = {
        'New': { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-500', connector: 'bg-blue-500' },
        'Qualified': { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-500', connector: 'bg-purple-500' },
        'Proposal': { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500', connector: 'bg-orange-500' },
      }
      return colors[stage as Exclude<LeadStage, 'Closed'>]
    }
    return {
      bg: 'bg-gray-200',
      text: 'text-gray-600',
      border: 'border-gray-300',
      connector: 'bg-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Top Bar with Breadcrumb and Actions */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
              <Link href="/" className="hover:text-[var(--color-primary)]">
                Home
              </Link>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
              <Link href="/leads" className="hover:text-[var(--color-primary)]">
                Leads
              </Link>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
              <span className="text-gray-900 truncate">{lead.clientName}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push(`/leads/${id}/edit`)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => router.push('/leads')}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{lead.clientName}</h1>
                <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap w-fit ${getStageColor(lead.stage, lead.closedReason)}`}>
                  {getStageDisplayText(lead.stage, lead.closedReason)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{lead.leadOwner}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salesforce-style Path Component */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 overflow-x-auto">
          <div className="flex items-center min-w-max sm:min-w-0">
            {leadStages.map((stage, index) => {
              const isCurrent = lead.stage === stage
              const isCompleted = index < currentStageIndex
              const stageColors = getPathStageColor(stage, isCurrent, isCompleted, lead.closedReason)
              
              return (
                <div key={stage} className="flex items-center flex-1 min-w-[80px] sm:min-w-0">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => handleStageChange(stage)}
                      className="flex flex-col items-center flex-1 group cursor-pointer w-full"
                    >
                      <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full ${stageColors.bg} ${stageColors.border} border-2 flex items-center justify-center transition-all ${
                        !isCurrent ? 'hover:scale-110 hover:shadow-lg' : ''
                      } ${isCurrent ? 'ring-2 sm:ring-4 ring-blue-200 ring-opacity-50' : ''}`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        ) : (
                          <span className={`text-xs sm:text-sm font-bold ${stageColors.text}`}>
                            {index + 1}
                          </span>
                        )}
                        {isCurrent && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                        )}
                      </div>
                      <span className={`mt-2 text-xs sm:text-sm font-medium text-center leading-tight ${
                        isCurrent ? 'text-blue-600 font-semibold' :
                        isCompleted ? 'text-green-600' :
                        'text-gray-500'
                      }`}>
                        {stage === 'Closed' && lead.closedReason === 'Won' ? 'Closed Won' : 
                         stage === 'Closed' && lead.closedReason === 'Lost' ? 'Closed Lost' :
                         stage === 'Closed' && lead.closedReason === 'Lost (Unqualified)' ? 'Closed Lost (Unqualified)' :
                         stage === 'Closed' ? 'Closed' : stage}
                      </span>
                    </button>
                  </div>
                  {index < leadStages.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 sm:mx-2 transition-colors min-w-[20px] sm:min-w-0 ${
                      isCompleted ? 'bg-green-500' :
                      index < currentStageIndex ? 'bg-green-500' :
                      index === currentStageIndex ? 'bg-blue-500' :
                      'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              )
            })}
          </div>
          
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
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
                {(lead.street || lead.city || lead.thana || lead.district || lead.country || lead.postalCode) && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">Address</p>
                      <div className="space-y-1">
                        {lead.street && (
                          <p className="text-gray-900 font-medium">{lead.street}</p>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                          {lead.city && <span>{lead.city}</span>}
                          {lead.thana && <span>{lead.thana}</span>}
                          {lead.district && <span>{lead.district}</span>}
                          {lead.country && <span>{lead.country}</span>}
                          {lead.postalCode && <span>{lead.postalCode}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Details */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Lead Details</h2>
              <div className="space-y-3 sm:space-y-4">
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
          <div className="space-y-4 sm:space-y-6">
            {/* Tasks Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Tasks</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value as TaskStatus | 'All')}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] flex-1 sm:flex-none"
                  >
                    <option value="All">All</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    onClick={() => setShowTaskForm(!showTaskForm)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors text-sm whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    New
                  </button>
                </div>
              </div>

              {/* New Task Form */}
              {showTaskForm && (
                <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Create New Task</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newTask.subject}
                        onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <option value="">Select subject</option>
                        <option value="Follow up">Follow up</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowTaskForm(false)
                          setNewTask({
                            subject: '',
                            dueDate: '',
                          })
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateTask}
                        className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 text-sm"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks List */}
              {filteredTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No tasks found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] sm:max-h-[600px] overflow-y-auto -mx-1 px-1">
                  {filteredTasks.map((task) => {
                    const isOverdue = task.dueDate && task.status !== 'Completed' && new Date(task.dueDate) < new Date()
                    
                    return (
                      <div
                        key={task.id}
                        className={`p-3 border rounded-lg transition-colors ${
                          task.status === 'Completed'
                            ? 'bg-gray-50 border-gray-200'
                            : isOverdue
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-200 hover:border-[var(--color-primary)]/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {/* 1. Subject */}
                            <div className="flex items-start gap-2 mb-1">
                              <button
                                onClick={() => {
                                  const newStatus = task.status === 'Completed' ? 'Not Started' : 'Completed'
                                  handleUpdateTaskStatus(task.id, newStatus)
                                }}
                                className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
                                  task.status === 'Completed'
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-300 hover:border-[var(--color-primary)]'
                                }`}
                              >
                                {task.status === 'Completed' && <CheckSquare className="w-3 h-3" />}
                              </button>
                              <h3 className={`font-semibold text-sm text-gray-900 truncate ${
                                task.status === 'Completed' ? 'line-through text-gray-500' : ''
                              }`}>
                                {task.subject}
                              </h3>
                            </div>

                            {/* 2. Due Date */}
                            {task.dueDate && (
                              <div className="flex items-center gap-1 mb-2 ml-6 text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}

                            {/* 3. Description */}
                            <div className="mt-1 ml-6">
                              {editingTaskId === task.id ? (
                                <textarea
                                  value={editingDescription}
                                  onChange={(e) => setEditingDescription(e.target.value)}
                                  placeholder="Add notes or description..."
                                  rows={3}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                                  autoFocus
                                />
                              ) : (
                                <div>
                                  {task.description ? (
                                    <div>
                                      <p className={`text-xs text-gray-600 ${
                                        expandedTasks.has(task.id) ? '' : 'line-clamp-2'
                                      }`}>
                                        {task.description}
                                      </p>
                                      {task.description.length > 100 && (
                                        <button
                                          onClick={() => toggleTaskExpand(task.id)}
                                          className="text-xs text-[var(--color-primary)] hover:underline mt-1 flex items-center gap-1"
                                        >
                                          {expandedTasks.has(task.id) ? (
                                            <>
                                              <ChevronUp className="w-3 h-3" />
                                              Show Less
                                            </>
                                          ) : (
                                            <>
                                              <ChevronDown className="w-3 h-3" />
                                              Show More
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleStartEditDescription(task)}
                                      className="text-xs text-gray-400 hover:text-[var(--color-primary)] flex items-center gap-1 mt-1"
                                    >
                                      <FileText className="w-3 h-3" />
                                      Add notes...
                                    </button>
                                  )}
                                  {task.description && (
                                    <button
                                      onClick={() => handleStartEditDescription(task)}
                                      className="text-xs text-[var(--color-primary)] hover:underline mt-1 ml-2 flex items-center gap-1"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      Edit
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* 4. Create Follow up Task Section */}
                            {editingTaskId === task.id && (
                              <div className="mt-3 ml-6 p-3 sm:p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
                                <h4 className="text-xs font-semibold text-blue-900 mb-3">Create Follow up Task</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Subject
                                    </label>
                                    <select
                                      value={followUpSubject}
                                      onChange={(e) => setFollowUpSubject(e.target.value)}
                                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    >
                                      <option value="Follow up">Follow up</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Due Date
                                    </label>
                                    <input
                                      type="date"
                                      value={followUpDueDate}
                                      onChange={(e) => setFollowUpDueDate(e.target.value)}
                                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                      placeholder="Select due date for next follow up"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                            {task.status !== 'Completed' && (
                              <select
                                value={task.status}
                                onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                                className="px-1.5 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            )}
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1.5 sm:p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                            </button>
                          </div>
                        </div>
                        {/* Action Buttons - Only show when editing, spans full width */}
                        {editingTaskId === task.id && (
                          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => handleSaveAndCreateFollowUp(task.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:opacity-90 flex-1 sm:flex-none min-w-[120px]"
                              title="Save notes and create Follow up task"
                            >
                              <Plus className="w-3 h-3" />
                              <span className="hidden sm:inline">Create Follow Up</span>
                              <span className="sm:hidden">Follow Up</span>
                            </button>
                            <button
                              onClick={() => handleSaveDescription(task.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-[var(--color-primary)] text-white rounded text-xs hover:opacity-90 flex-1 sm:flex-none min-w-[80px]"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEditDescription}
                              className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none min-w-[80px]"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Lead Information */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Lead Information</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Stage</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getStageColor(lead.stage, lead.closedReason)}`}>
                    {getStageDisplayText(lead.stage, lead.closedReason)}
                  </span>
                </div>
                {lead.stage === 'Closed' && (lead.closedReason === 'Lost' || lead.closedReason === 'Lost (Unqualified)') && lead.closedReasonText && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Closed Reason</p>
                    <p className="text-gray-900 font-medium">{lead.closedReasonText}</p>
                  </div>
                )}
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
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
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

      {/* Closed Reason Modal */}
      {showClosedReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Close Lead</h3>
            {!selectedClosedReason ? (
              <>
                <p className="text-sm text-gray-600 mb-6">Please select the reason for closing this lead:</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleClosedReasonSelect('Won')}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Closed Won
                  </button>
                  <button
                    onClick={() => handleClosedReasonSelect('Lost')}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Closed Lost
                  </button>
                  <button
                    onClick={() => handleClosedReasonSelect('Lost (Unqualified)')}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Closed Lost (Unqualified)
                  </button>
                  <button
                    onClick={() => {
                      setShowClosedReasonModal(false)
                      setSelectedClosedReason(null)
                      setClosedReasonText('')
                      setClosedReasonError('')
                    }}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedClosedReason === 'Won' 
                    ? 'Closing this lead as Won.' 
                    : 'Please provide a reason for closing this lead as lost:'}
                </p>
                {(selectedClosedReason === 'Lost' || selectedClosedReason === 'Lost (Unqualified)') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={closedReasonText}
                      onChange={(e) => {
                        setClosedReasonText(e.target.value)
                        setClosedReasonError('')
                      }}
                      placeholder="Enter the reason for closing this lead..."
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        closedReasonError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      rows={4}
                    />
                    {closedReasonError && (
                      <p className="mt-1 text-sm text-red-600">{closedReasonError}</p>
                    )}
                  </div>
                )}
                <div className="space-y-3">
                  <button
                    onClick={handleCloseLead}
                    className={`w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                      selectedClosedReason === 'Won'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {selectedClosedReason === 'Won' ? 'Close as Won' : `Close as ${selectedClosedReason}`}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClosedReason(null)
                      setClosedReasonText('')
                      setClosedReasonError('')
                    }}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setShowClosedReasonModal(false)
                      setSelectedClosedReason(null)
                      setClosedReasonText('')
                      setClosedReasonError('')
                    }}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

