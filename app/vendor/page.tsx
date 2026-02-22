'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, DollarSign, Settings, Phone, Search, ChevronLeft, ChevronRight, Info, MessageCircle, X, Send, Tag, Gift, TrendingUp, Calendar } from 'lucide-react'
import Navbar from '@/components/navbar'

type OrderStatus = 'Submitted' | 'Confirmed' | 'Assigned' | 'In-Progress' | 'Review' | 'Delivered' | 'Closed'

interface OngoingService {
  id: string
  serialNumber: string
  serviceName: string
  status: OrderStatus
  clientName: string
  clientPhone: string
  clientEmail: string
  orderDate: string
  unreadMessages?: number
}

interface ChatMessage {
  id: string
  orderId: string
  sender: 'vendor' | 'client'
  message: string
  timestamp: string
  read: boolean
}

interface Payment {
  id: string
  orderId: string
  serviceName: string
  orderDate: string
  orderStatus: OrderStatus
  totalFee: number
  vendorFee: number
  status: 'pending' | 'processing' | 'ready' | 'collected'
}

interface Offer {
  id: string
  title: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  serviceCategory: string
  validFrom: string
  validUntil: string
  status: 'active' | 'expired' | 'scheduled'
  usageCount: number
  maxUsage?: number
  minOrderAmount?: number
}

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState('ongoing-services')
  const [ongoingServices, setOngoingServices] = useState<OngoingService[]>([
    { id: '1', serialNumber: 'ORD-001', serviceName: 'AC Servicing', status: 'In-Progress', clientName: 'Ahmed Rahman', clientPhone: '+8801712345678', clientEmail: 'ahmed@example.com', orderDate: '2024-01-15', unreadMessages: 3 },
    { id: '2', serialNumber: 'ORD-002', serviceName: 'Home Cleaning', status: 'Confirmed', clientName: 'Fatima Khan', clientPhone: '+8801723456789', clientEmail: 'fatima@example.com', orderDate: '2024-01-16', unreadMessages: 0 },
    { id: '3', serialNumber: 'ORD-003', serviceName: 'legal_service_image Services', status: 'Assigned', clientName: 'Karim Uddin', clientPhone: '+8801734567890', clientEmail: 'karim@example.com', orderDate: '2024-01-17', unreadMessages: 1 },
    { id: '4', serialNumber: 'ORD-004', serviceName: 'Electrical Services', status: 'Review', clientName: 'Sadia Rahman', clientPhone: '+8801745678901', clientEmail: 'sadia@example.com', orderDate: '2024-01-18', unreadMessages: 0 },
    { id: '5', serialNumber: 'ORD-005', serviceName: 'House Shifting', status: 'Delivered', clientName: 'Hasan Ali', clientPhone: '+8801756789012', clientEmail: 'hasan@example.com', orderDate: '2024-01-19', unreadMessages: 0 },
    { id: '6', serialNumber: 'ORD-006', serviceName: 'Salon Care', status: 'Submitted', clientName: 'Nadia Islam', clientPhone: '+8801767890123', clientEmail: 'nadia@example.com', orderDate: '2024-01-20', unreadMessages: 2 },
    { id: '7', serialNumber: 'ORD-007', serviceName: 'Fridge Repair', status: 'Closed', clientName: 'Rashid Ahmed', clientPhone: '+8801778901234', clientEmail: 'rashid@example.com', orderDate: '2024-01-21', unreadMessages: 0 },
    { id: '8', serialNumber: 'ORD-008', serviceName: 'AC Servicing', status: 'In-Progress', clientName: 'Sara Khan', clientPhone: '+8801789012345', clientEmail: 'sara@example.com', orderDate: '2024-01-22', unreadMessages: 5 },
    { id: '9', serialNumber: 'ORD-009', serviceName: 'Home Cleaning', status: 'Confirmed', clientName: 'Tariq Hassan', clientPhone: '+8801790123456', clientEmail: 'tariq@example.com', orderDate: '2024-01-23', unreadMessages: 0 },
    { id: '10', serialNumber: 'ORD-010', serviceName: 'legal_service_image Services', status: 'Assigned', clientName: 'Zara Ahmed', clientPhone: '+8801701234567', clientEmail: 'zara@example.com', orderDate: '2024-01-24', unreadMessages: 1 },
  ])
  const [showChat, setShowChat] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    'ORD-001': [
      { id: '1', orderId: 'ORD-001', sender: 'client', message: 'Hello, when will you arrive?', timestamp: '2024-01-15 10:30', read: false },
      { id: '2', orderId: 'ORD-001', sender: 'vendor', message: 'I will be there in 30 minutes.', timestamp: '2024-01-15 10:32', read: true },
      { id: '3', orderId: 'ORD-001', sender: 'client', message: 'Great, thank you!', timestamp: '2024-01-15 10:33', read: false },
      { id: '4', orderId: 'ORD-001', sender: 'client', message: 'Please bring the necessary tools.', timestamp: '2024-01-15 10:35', read: false },
    ],
    'ORD-003': [
      { id: '1', orderId: 'ORD-003', sender: 'client', message: 'Can you come earlier?', timestamp: '2024-01-17 09:00', read: false },
    ],
    'ORD-006': [
      { id: '1', orderId: 'ORD-006', sender: 'client', message: 'What time is the appointment?', timestamp: '2024-01-20 14:00', read: false },
      { id: '2', orderId: 'ORD-006', sender: 'client', message: 'Please confirm.', timestamp: '2024-01-20 14:05', read: false },
    ],
    'ORD-008': [
      { id: '1', orderId: 'ORD-008', sender: 'client', message: 'Hi', timestamp: '2024-01-22 08:00', read: false },
      { id: '2', orderId: 'ORD-008', sender: 'client', message: 'Are you available today?', timestamp: '2024-01-22 08:05', read: false },
      { id: '3', orderId: 'ORD-008', sender: 'client', message: 'I need urgent service.', timestamp: '2024-01-22 08:10', read: false },
      { id: '4', orderId: 'ORD-008', sender: 'client', message: 'Please reply ASAP.', timestamp: '2024-01-22 08:15', read: false },
      { id: '5', orderId: 'ORD-008', sender: 'client', message: 'Thank you!', timestamp: '2024-01-22 08:20', read: false },
    ],
    'ORD-010': [
      { id: '1', orderId: 'ORD-010', sender: 'client', message: 'When can you start?', timestamp: '2024-01-24 11:00', read: false },
    ],
  })
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [tempDateFrom, setTempDateFrom] = useState<Date | null>(null)
  const [tempDateTo, setTempDateTo] = useState<Date | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [payments] = useState<Payment[]>([
    { id: '1', orderId: 'ORD-001', serviceName: 'AC Servicing', orderDate: '2024-01-15', orderStatus: 'Delivered', totalFee: 800, vendorFee: 720, status: 'collected' },
    { id: '2', orderId: 'ORD-002', serviceName: 'Home Cleaning', orderDate: '2024-01-16', orderStatus: 'Delivered', totalFee: 1500, vendorFee: 1350, status: 'collected' },
    { id: '3', orderId: 'ORD-003', serviceName: 'legal_service_image Services', orderDate: '2024-01-17', orderStatus: 'Delivered', totalFee: 500, vendorFee: 450, status: 'collected' },
    { id: '4', orderId: 'ORD-004', serviceName: 'Electrical Services', orderDate: '2024-01-18', orderStatus: 'In-Progress', totalFee: 1200, vendorFee: 1080, status: 'processing' },
    { id: '5', orderId: 'ORD-005', serviceName: 'House Shifting', orderDate: '2024-01-19', orderStatus: 'Delivered', totalFee: 3000, vendorFee: 2700, status: 'ready' },
    { id: '6', orderId: 'ORD-006', serviceName: 'Salon Care', orderDate: '2024-01-20', orderStatus: 'Confirmed', totalFee: 1200, vendorFee: 1080, status: 'pending' },
    { id: '7', orderId: 'ORD-007', serviceName: 'Fridge Repair', orderDate: '2024-01-21', orderStatus: 'Delivered', totalFee: 600, vendorFee: 540, status: 'collected' },
    { id: '8', orderId: 'ORD-008', serviceName: 'AC Servicing', orderDate: '2024-01-22', orderStatus: 'In-Progress', totalFee: 800, vendorFee: 720, status: 'ready' },
    { id: '9', orderId: 'ORD-009', serviceName: 'Home Cleaning', orderDate: '2024-01-23', orderStatus: 'Assigned', totalFee: 1500, vendorFee: 1350, status: 'processing' },
    { id: '10', orderId: 'ORD-010', serviceName: 'legal_service_image Services', orderDate: '2024-01-24', orderStatus: 'Review', totalFee: 500, vendorFee: 450, status: 'pending' },
  ])
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'All' | 'pending' | 'processing' | 'ready' | 'collected'>('All')
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'All'>('All')
  const [sortBy, setSortBy] = useState<'orderDate' | 'totalFee' | 'orderId'>('orderDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [offers] = useState<Offer[]>([
    { 
      id: '1', 
      title: 'Summer AC Service Discount', 
      description: 'Get 20% off on all AC servicing during summer season', 
      discountType: 'percentage', 
      discountValue: 20, 
      serviceCategory: 'AC Repair Services',
      validFrom: '2024-01-01', 
      validUntil: '2024-03-31', 
      status: 'active',
      usageCount: 45,
      maxUsage: 100,
      minOrderAmount: 500
    },
    { 
      id: '2', 
      title: 'New Year Cleaning Special', 
      description: 'Flat ৳200 off on home cleaning services', 
      discountType: 'fixed', 
      discountValue: 200, 
      serviceCategory: 'Cleaning Solution',
      validFrom: '2024-01-01', 
      validUntil: '2024-01-31', 
      status: 'expired',
      usageCount: 78,
      maxUsage: 100,
      minOrderAmount: 1000
    },
    { 
      id: '3', 
      title: 'legal_service_image Services Combo', 
      description: '15% discount on legal_service_image and sanitary services', 
      discountType: 'percentage', 
      discountValue: 15, 
      serviceCategory: 'Home Repair',
      validFrom: '2024-02-01', 
      validUntil: '2024-04-30', 
      status: 'active',
      usageCount: 23,
      minOrderAmount: 300
    },
    { 
      id: '4', 
      title: 'Beauty & Wellness Package', 
      description: '৳500 off on salon and beauty services', 
      discountType: 'fixed', 
      discountValue: 500, 
      serviceCategory: 'Beauty & Wellness',
      validFrom: '2024-03-01', 
      validUntil: '2024-03-31', 
      status: 'scheduled',
      usageCount: 0,
      maxUsage: 50,
      minOrderAmount: 1500
    },
  ])

  const menuItems = [
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'ongoing-services', label: 'All Orders', icon: Settings },
    { id: 'my-offers', label: 'My Offers', icon: Tag },
  ]

  const getBreadcrumbLabel = () => {
    const activeItem = menuItems.find(item => item.id === activeTab)
    return activeItem?.label || 'Vendor Dashboard'
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedOrderId) return

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      orderId: selectedOrderId,
      sender: 'vendor',
      message: newMessage,
      timestamp: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      read: true,
    }

    setChatMessages(prev => ({
      ...prev,
      [selectedOrderId]: [...(prev[selectedOrderId] || []), newMsg],
    }))

    setNewMessage('')
  }

  const getSelectedOrderInfo = () => {
    if (!selectedOrderId) return null
    return ongoingServices.find(s => s.serialNumber === selectedOrderId)
  }

  // Vendor Challenge/Promo tracking
  const challengeTarget = 10
  const challengeBonus = 100
  const challengeStartDate = new Date()
  challengeStartDate.setHours(0, 0, 0, 0) // Start of today
  const challengeEndDate = new Date(challengeStartDate)
  challengeEndDate.setDate(challengeEndDate.getDate() + 7) // 1 week from today
  
  // Calculate completed services in challenge period
  const completedServicesInPeriod = ongoingServices.filter(service => {
    const serviceDate = new Date(service.orderDate)
    return service.status === 'Delivered' && 
           serviceDate >= challengeStartDate && 
           serviceDate <= challengeEndDate
  }).length

  const challengeProgress = Math.min((completedServicesInPeriod / challengeTarget) * 100, 100)
  const daysRemaining = Math.max(0, Math.ceil((challengeEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  const isChallengeActive = new Date() <= challengeEndDate


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        {/* Vendor Challenge Promo Banner */}
        {isChallengeActive && (
          <div className="mb-4 sm:mb-6 relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] via-pink-500 to-pink-600 rounded-xl shadow-2xl p-4 sm:p-6 text-white border-2 border-white/20">
            {/* Decorative Background Graphics */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Sparkle/Star Graphics */}
              <svg className="hidden sm:block absolute top-4 right-20 w-16 h-16 text-white/20 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <svg className="hidden sm:block absolute bottom-4 left-10 w-12 h-12 text-white/15 animate-pulse" style={{ animationDelay: '0.5s' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <svg className="hidden sm:block absolute top-1/2 right-4 w-10 h-10 text-white/10 animate-pulse" style={{ animationDelay: '1s' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              
              {/* Circular Pattern */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              
              {/* Diagonal Lines Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                }}></div>
              </div>
            </div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                {/* Enhanced Icon with Animation */}
                <div className="relative flex-shrink-0">
                  <div className="bg-white/25 rounded-full p-3 sm:p-4 backdrop-blur-sm border-2 border-white/30 shadow-lg">
                    <Gift className="w-6 h-6 sm:w-10 sm:h-10 animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                  {/* Pulsing Ring Effect */}
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="bg-white/20 rounded-lg p-1 sm:p-1.5">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold drop-shadow-lg">Weekly Challenge</h3>
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">NEW</span>
                  </div>
                  
                  <p className="text-white/95 mb-3 sm:mb-4 text-sm sm:text-lg">
                    Complete <span className="font-bold text-yellow-300 drop-shadow-md">{challengeTarget} services</span> by <span className="font-semibold">{challengeEndDate.toLocaleDateString()}</span> and earn <span className="font-bold text-yellow-300 drop-shadow-md">৳{challengeBonus} bonus</span>! 🎁
                  </p>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                      <span className="font-semibold text-white truncate pr-2">
                        {completedServicesInPeriod} / {challengeTarget} services completed
                      </span>
                      <span className="font-bold text-yellow-300 text-base sm:text-lg flex-shrink-0">{Math.round(challengeProgress)}%</span>
                    </div>
                    <div className="relative w-full bg-white/20 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner border border-white/30">
                      <div 
                        className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 h-full rounded-full transition-all duration-700 shadow-lg relative overflow-hidden"
                        style={{ width: `${challengeProgress}%` }}
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                        {/* Progress Indicator */}
                        {challengeProgress > 0 && (
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-300 rounded-full border-2 border-white shadow-lg"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/90">
                    {daysRemaining > 0 ? (
                      <>
                        <div className="flex items-center gap-1.5 bg-white/15 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium whitespace-nowrap">{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/15 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{challengeTarget - completedServicesInPeriod} more services needed</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-red-500/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-red-300/50">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Challenge ends today!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Enhanced Bonus Card */}
              {completedServicesInPeriod >= challengeTarget ? (
                <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl px-4 sm:px-8 py-4 sm:py-6 text-center shadow-2xl border-2 border-yellow-300 w-full sm:w-auto sm:min-w-[140px]">
                  <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-300 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-base sm:text-xl">🎉</span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold mb-1">✓</p>
                  <p className="text-xs sm:text-sm font-bold text-yellow-900 mb-1">Complete!</p>
                  <p className="text-xs text-yellow-800">Bonus credited</p>
                </div>
              ) : (
                <div className="relative bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-sm rounded-xl px-4 sm:px-8 py-4 sm:py-6 text-center shadow-2xl border-2 border-white/30 w-full sm:w-auto sm:min-w-[140px]">
                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full"></div>
                  
                  <div className="relative">
                    <p className="text-3xl sm:text-5xl font-bold mb-1 drop-shadow-lg">৳{challengeBonus}</p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                      <p className="text-xs sm:text-sm font-bold">Bonus Reward</p>
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-300 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1">
            {/* Breadcrumb */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Link href="/" className="hover:text-[var(--color-primary)]">
                  Home
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
                <span className="text-gray-900 truncate">{getBreadcrumbLabel()}</span>
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
                        className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md transition-colors relative flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
                          activeTab === item.id
                            ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
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
            {/* All Orders Tab */}
            {activeTab === 'ongoing-services' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">All Orders</h1>

                {/* Search and Filter */}
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as OrderStatus | 'All')
                      setCurrentPage(1)
                    }}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
                          {/* Desktop Table View */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Serial</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Service Name</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Status</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Contact Info</th>
                                  <th className="text-center py-3 px-4 font-semibold text-gray-900 text-sm">Actions</th>
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
                                        <button
                                          onClick={() => {
                                            setSelectedOrderId(service.serialNumber)
                                            setShowChat(true)
                                            // Mark messages as read when opening chat
                                            setOngoingServices(prev =>
                                              prev.map(s =>
                                                s.id === service.id ? { ...s, unreadMessages: 0 } : s
                                              )
                                            )
                                          }}
                                          className="relative p-2 text-[var(--color-primary)] hover:bg-[var(--color-neutral)] rounded-lg transition-colors"
                                          title="Open Chat"
                                        >
                                          <MessageCircle className="w-5 h-5" />
                                          {service.unreadMessages && service.unreadMessages > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                              {service.unreadMessages > 9 ? '9+' : service.unreadMessages}
                                            </span>
                                          )}
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

                          {/* Mobile Card View */}
                          <div className="md:hidden divide-y divide-gray-200">
                            {paginatedServices.map((service) => (
                              <div key={service.id} className="p-4 hover:bg-gray-50">
                                <div className="mb-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900">{service.serialNumber}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                                      {service.status}
                                    </span>
                                  </div>
                                  <p className="font-medium text-gray-900 mb-1">{service.serviceName}</p>
                                  <p className="text-sm text-gray-500">{service.clientName}</p>
                                </div>
                                <div className="space-y-2 text-sm mb-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      Phone:
                                    </span>
                                    <span className="text-gray-900">{service.clientPhone}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 flex items-center gap-1">
                                      <FileText className="w-4 h-4" />
                                      Email:
                                    </span>
                                    <span className="text-gray-900 truncate ml-2">{service.clientEmail}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                  <button
                                    className="flex-1 px-3 py-2 text-[var(--color-primary)] hover:bg-[var(--color-neutral)] rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                    title="View Details"
                                  >
                                    <Info className="w-4 h-4" />
                                    Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedOrderId(service.serialNumber)
                                      setShowChat(true)
                                      // Mark messages as read when opening chat
                                      setOngoingServices(prev =>
                                        prev.map(s =>
                                          s.id === service.id ? { ...s, unreadMessages: 0 } : s
                                        )
                                      )
                                    }}
                                    className="relative flex-1 px-3 py-2 text-[var(--color-primary)] hover:bg-[var(--color-neutral)] rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                    title="Open Chat"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    Chat
                                    {service.unreadMessages && service.unreadMessages > 0 && (
                                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {service.unreadMessages > 9 ? '9+' : service.unreadMessages}
                                      </span>
                                    )}
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
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} orders
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentPage === 1}
                                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                      key={page}
                                      onClick={() => setCurrentPage(page)}
                                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
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
                                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">Payments</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Total Earnings</span>
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ৳{payments.filter(p => p.status === 'collected').reduce((sum, p) => sum + p.vendorFee, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">From collected payments</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Pending</span>
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ৳{payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.vendorFee, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Processing</span>
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ৳{payments.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.vendorFee, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">In processing</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Ready</span>
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ৳{payments.filter(p => p.status === 'ready').reduce((sum, p) => sum + p.vendorFee, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Ready for collection</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Collected</span>
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ৳{payments.filter(p => p.status === 'collected').reduce((sum, p) => sum + p.vendorFee, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Successfully collected</p>
                  </div>
                </div>

                {/* Filters and Sorting */}
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
                  {/* Date Filter - First */}
                  <div className="relative w-full sm:w-auto">
                    <div
                      onClick={() => {
                        if (!showDatePicker) {
                          // Initialize calendar to show current month or selected date month
                          const initDate = dateFrom ? new Date(dateFrom) : new Date()
                          setCalendarMonth(initDate.getMonth())
                          setCalendarYear(initDate.getFullYear())
                          setTempDateFrom(dateFrom ? new Date(dateFrom) : null)
                          setTempDateTo(dateTo ? new Date(dateTo) : null)
                        }
                        setShowDatePicker(!showDatePicker)
                      }}
                      className="relative cursor-pointer px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white hover:border-gray-400 transition-colors w-full sm:min-w-[280px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm truncate">
                          {dateFrom && dateTo
                            ? `${new Date(dateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(dateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            : dateFrom
                            ? `${new Date(dateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ...`
                            : 'Select dates'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Calendar Date Picker Popup */}
                    {showDatePicker && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowDatePicker(false)}
                        />
                        <div 
                          className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-4 sm:p-6 w-[calc(100vw-2rem)] sm:w-[350px] max-w-[350px]" 
                          onClick={(e) => e.stopPropagation()}
                          onMouseLeave={() => setHoveredDate(null)}
                        >
                          {/* Calendar Header */}
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={() => {
                                const newDate = new Date(calendarYear, calendarMonth - 1, 1)
                                setCalendarMonth(newDate.getMonth())
                                setCalendarYear(newDate.getFullYear())
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h3 className="text-base font-semibold text-gray-900">
                              {new Date(calendarYear, calendarMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                              onClick={() => {
                                const newDate = new Date(calendarYear, calendarMonth + 1, 1)
                                setCalendarMonth(newDate.getMonth())
                                setCalendarYear(newDate.getFullYear())
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>

                          {/* Days of Week */}
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                              <div key={idx} className="text-center text-xs font-medium text-gray-500 py-2">
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* Calendar Grid */}
                          <div className="grid grid-cols-7 gap-1">
                            {(() => {
                              const firstDay = new Date(calendarYear, calendarMonth, 1).getDay()
                              const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
                              const days: (number | null)[] = []
                              
                              // Previous month days
                              for (let i = firstDay - 1; i >= 0; i--) {
                                days.push(null)
                              }
                              
                              // Current month days
                              for (let i = 1; i <= daysInMonth; i++) {
                                days.push(i)
                              }
                              
                              // Fill remaining cells
                              while (days.length < 42) {
                                days.push(null)
                              }

                              const getDateKey = (day: number | null) => {
                                if (day === null) return null
                                const date = new Date(calendarYear, calendarMonth, day)
                                return date.toISOString().split('T')[0]
                              }

                              const isInRange = (day: number | null) => {
                                if (day === null) return false
                                const dateKey = getDateKey(day)
                                if (!dateKey) return false
                                
                                const fromDate = tempDateFrom || (dateFrom ? new Date(dateFrom) : null)
                                const toDate = tempDateTo || (dateTo ? new Date(dateTo) : null)
                                
                                // If we have a start date and are hovering (but haven't selected end date yet)
                                if (fromDate && !toDate && hoveredDate) {
                                  const currentDate = new Date(dateKey)
                                  const hoverDate = new Date(hoveredDate)
                                  const start = fromDate < hoverDate ? fromDate : hoverDate
                                  const end = fromDate < hoverDate ? hoverDate : fromDate
                                  // Include dates strictly between start and end (not including start/end themselves)
                                  return currentDate > start && currentDate < end
                                }
                                
                                // Normal range check when both dates are selected
                                if (!fromDate || !toDate) return false
                                
                                const currentDate = new Date(dateKey)
                                // Include dates strictly between start and end (not including start/end themselves)
                                return currentDate > fromDate && currentDate < toDate
                              }

                              const isStartDate = (day: number | null) => {
                                if (day === null) return false
                                const dateKey = getDateKey(day)
                                if (!dateKey) return false
                                
                                const fromDate = tempDateFrom || (dateFrom ? new Date(dateFrom) : null)
                                if (!fromDate) return false
                                
                                return dateKey === fromDate.toISOString().split('T')[0]
                              }

                              const isEndDate = (day: number | null) => {
                                if (day === null) return false
                                const dateKey = getDateKey(day)
                                if (!dateKey) return false
                                
                                const toDate = tempDateTo || (dateTo ? new Date(dateTo) : null)
                                if (!toDate) return false
                                
                                return dateKey === toDate.toISOString().split('T')[0]
                              }

                              const isHoveredEndDate = (day: number | null) => {
                                if (day === null) return false
                                const dateKey = getDateKey(day)
                                if (!dateKey) return false
                                
                                if (!hoveredDate) return false
                                if (tempDateTo) return false // Don't show hover if end date is already selected
                                
                                return dateKey === hoveredDate.toISOString().split('T')[0]
                              }

                              const handleDateClick = (day: number) => {
                                const dateKey = getDateKey(day)
                                if (!dateKey) return
                                
                                const clickedDate = new Date(dateKey)
                                
                                if (!tempDateFrom || (tempDateFrom && tempDateTo)) {
                                  // Start new selection
                                  setTempDateFrom(clickedDate)
                                  setTempDateTo(null)
                                } else if (tempDateFrom && !tempDateTo) {
                                  // Complete selection
                                  if (clickedDate < tempDateFrom) {
                                    setTempDateTo(tempDateFrom)
                                    setTempDateFrom(clickedDate)
                                  } else {
                                    setTempDateTo(clickedDate)
                                  }
                                }
                              }

                              return days.map((day, idx) => {
                                if (day === null) {
                                  return <div key={idx} className="h-8 sm:h-10" />
                                }

                                const dateKey = getDateKey(day)
                                const inRange = isInRange(day)
                                const isStart = isStartDate(day)
                                const isEnd = isEndDate(day)
                                const isHoveredEnd = isHoveredEndDate(day)
                                const isToday = dateKey === new Date().toISOString().split('T')[0]
                                
                                // Determine if this date is at the start or end of a row
                                const isFirstInRow = idx % 7 === 0
                                const isLastInRow = idx % 7 === 6

                                return (
                                  <div key={idx} className="relative h-8 sm:h-10 flex items-center justify-center">
                                    {/* Range background - spans full width when in range */}
                                    {inRange && (
                                      <div className="absolute inset-y-0 left-0 right-0 bg-gray-100" />
                                    )}
                                    {/* Start date background - only left half if not first in row */}
                                    {isStart && !isFirstInRow && (
                                      <div className="absolute inset-y-0 left-0 right-1/2 bg-gray-100" />
                                    )}
                                    {/* End date background - only right half if not last in row */}
                                    {isEnd && !isLastInRow && (
                                      <div className="absolute inset-y-0 right-0 left-1/2 bg-gray-100" />
                                    )}
                                    {/* Hovered end date background - only right half if not last in row */}
                                    {isHoveredEnd && !isLastInRow && (
                                      <div className="absolute inset-y-0 right-0 left-1/2 bg-gray-100" />
                                    )}
                                    
                                    <button
                                      onClick={() => handleDateClick(day)}
                                      onMouseEnter={() => {
                                        if (tempDateFrom && !tempDateTo) {
                                          const date = new Date(dateKey!)
                                          setHoveredDate(date)
                                        }
                                      }}
                                      onMouseLeave={() => {
                                        setHoveredDate(null)
                                      }}
                                      className={`
                                        relative z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full text-xs sm:text-sm font-medium transition-colors touch-manipulation
                                        ${isStart || isEnd || isHoveredEnd
                                          ? 'bg-gray-800 text-white'
                                          : inRange
                                          ? 'bg-transparent text-gray-900'
                                          : isToday
                                          ? 'text-[var(--color-primary)] font-semibold hover:bg-gray-50 active:bg-gray-100'
                                          : 'text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                                        }
                                      `}
                                    >
                                      {day}
                                    </button>
                                  </div>
                                )
                              })
                            })()}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                            <button
                              onClick={() => {
                                setDateFrom('')
                                setDateTo('')
                                setTempDateFrom(null)
                                setTempDateTo(null)
                              }}
                              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => {
                                if (tempDateFrom) {
                                  setDateFrom(tempDateFrom.toISOString().split('T')[0])
                                }
                                if (tempDateTo) {
                                  setDateTo(tempDateTo.toISOString().split('T')[0])
                                }
                                setShowDatePicker(false)
                              }}
                              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 text-sm font-medium"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Order ID Search - Second */}
                  <div className="flex-1 relative w-full sm:min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search by order ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  
                  {/* Order Status Filter - Third */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as OrderStatus | 'All')}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="All">All Order Status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Review">Review</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Closed">Closed</option>
                  </select>
                  
                  {/* Payment Status Filter - Fourth */}
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value as 'All' | 'pending' | 'processing' | 'ready' | 'collected')}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="All">All Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="ready">Ready</option>
                    <option value="collected">Collected</option>
                  </select>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-')
                      setSortBy(field as 'orderDate' | 'totalFee' | 'orderId')
                      setSortOrder(order as 'asc' | 'desc')
                    }}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="orderDate-desc">Sort: Date (Newest)</option>
                    <option value="orderDate-asc">Sort: Date (Oldest)</option>
                    <option value="totalFee-desc">Sort: Amount (High to Low)</option>
                    <option value="totalFee-asc">Sort: Amount (Low to High)</option>
                    <option value="orderId-asc">Sort: Order ID (A-Z)</option>
                    <option value="orderId-desc">Sort: Order ID (Z-A)</option>
                  </select>
                </div>

                {/* Payment Table */}
                {(() => {
                  const getOrderStatusColor = (status: OrderStatus) => {
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

                  const getPaymentStatusBadge = (status: Payment['status']) => {
                    const styles = {
                      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                      processing: 'bg-blue-100 text-blue-700 border-blue-300',
                      ready: 'bg-purple-100 text-purple-700 border-purple-300',
                      collected: 'bg-green-100 text-green-700 border-green-300',
                    }
                    const labels = {
                      pending: 'Pending',
                      processing: 'Processing',
                      ready: 'Ready',
                      collected: 'Collected',
                    }
                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                        {labels[status]}
                      </span>
                    )
                  }

                  // Filter payments
                  let filteredPayments = payments.filter(payment => {
                    const matchesSearch = 
                      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      payment.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
                    const matchesPaymentStatus = paymentStatusFilter === 'All' || payment.status === paymentStatusFilter
                    const matchesOrderStatus = orderStatusFilter === 'All' || payment.orderStatus === orderStatusFilter
                    
                    // Date filter
                    let matchesDate = true
                    if (dateFrom || dateTo) {
                      const paymentDate = new Date(payment.orderDate)
                      paymentDate.setHours(0, 0, 0, 0)
                      
                      if (dateFrom) {
                        const fromDate = new Date(dateFrom)
                        fromDate.setHours(0, 0, 0, 0)
                        if (paymentDate < fromDate) matchesDate = false
                      }
                      
                      if (dateTo) {
                        const toDate = new Date(dateTo)
                        toDate.setHours(23, 59, 59, 999)
                        if (paymentDate > toDate) matchesDate = false
                      }
                    }
                    
                    return matchesSearch && matchesPaymentStatus && matchesOrderStatus && matchesDate
                  })

                  // Sort payments
                  filteredPayments = [...filteredPayments].sort((a, b) => {
                    let comparison = 0
                    if (sortBy === 'orderDate') {
                      comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
                    } else if (sortBy === 'totalFee') {
                      comparison = a.totalFee - b.totalFee
                    } else if (sortBy === 'orderId') {
                      comparison = a.orderId.localeCompare(b.orderId)
                    }
                    return sortOrder === 'asc' ? comparison : -comparison
                  })

                  return (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                              <th className="text-center py-3 px-4 font-semibold text-gray-900 text-sm">Serial</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Order Date</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Order ID</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Service Name</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Order Status</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-900 text-sm">Total Fee</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-900 text-sm">Vendor Fee</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900 text-sm">Payment Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPayments.map((payment, index) => (
                              <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-4 text-center">
                                  <span className="text-gray-600 font-medium">{index + 1}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-sm text-gray-900">{new Date(payment.orderDate).toLocaleDateString()}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="font-medium text-gray-900">{payment.orderId}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-gray-900">{payment.serviceName}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(payment.orderStatus)}`}>
                                    {payment.orderStatus}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <span className="font-semibold text-gray-900">৳{payment.totalFee.toLocaleString()}</span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <span className="font-semibold text-[var(--color-primary)]">৳{payment.vendorFee.toLocaleString()}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center justify-center">
                                    {getPaymentStatusBadge(payment.status)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-50 font-semibold">
                              <td colSpan={5} className="py-4 px-4 text-gray-900">
                                Total ({filteredPayments.length} payments)
                              </td>
                              <td className="py-4 px-4 text-right text-gray-900">
                                ৳{filteredPayments.reduce((sum, p) => sum + p.totalFee, 0).toLocaleString()}
                              </td>
                              <td className="py-4 px-4 text-right text-[var(--color-primary)]">
                                ৳{filteredPayments.reduce((sum, p) => sum + p.vendorFee, 0).toLocaleString()}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="md:hidden divide-y divide-gray-200">
                        {filteredPayments.map((payment, index) => (
                          <div key={payment.id} className="p-4 hover:bg-gray-50">
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600 font-medium">#{index + 1}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(payment.orderStatus)}`}>
                                    {payment.orderStatus}
                                  </span>
                                  {getPaymentStatusBadge(payment.status)}
                                </div>
                              </div>
                              <p className="font-semibold text-gray-900 mb-1">{payment.orderId}</p>
                              <p className="text-sm text-gray-600">{payment.serviceName}</p>
                            </div>
                            <div className="space-y-2 text-sm mb-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Order Date:</span>
                                <span className="text-gray-900">{new Date(payment.orderDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Total Fee:</span>
                                <span className="font-semibold text-gray-900">৳{payment.totalFee.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Vendor Fee:</span>
                                <span className="font-semibold text-[var(--color-primary)]">৳{payment.vendorFee.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Mobile Summary */}
                        <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-900">Total ({filteredPayments.length} payments):</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Fees:</span>
                              <span className="font-semibold text-gray-900">৳{filteredPayments.reduce((sum, p) => sum + p.totalFee, 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Vendor Fees:</span>
                              <span className="font-semibold text-[var(--color-primary)]">৳{filteredPayments.reduce((sum, p) => sum + p.vendorFee, 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}

            {/* My Offers Tab */}
            {activeTab === 'my-offers' && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Offers</h1>
                  <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base">
                    <Tag className="w-4 h-4" />
                    Create New Offer
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Active Offers</span>
                      <Tag className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {offers.filter(o => o.status === 'active').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Currently running</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Total Usage</span>
                      <Tag className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {offers.reduce((sum, o) => sum + o.usageCount, 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Times used by customers</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Scheduled</span>
                      <Tag className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {offers.filter(o => o.status === 'scheduled').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Upcoming offers</p>
                  </div>
                </div>

                {/* Offers List */}
                <div className="space-y-4">
                  {offers.map((offer) => {
                    const getStatusBadge = (status: Offer['status']) => {
                      const styles = {
                        active: 'bg-green-100 text-green-700 border-green-300',
                        expired: 'bg-gray-100 text-gray-700 border-gray-300',
                        scheduled: 'bg-blue-100 text-blue-700 border-blue-300',
                      }
                      const labels = {
                        active: 'Active',
                        expired: 'Expired',
                        scheduled: 'Scheduled',
                      }
                      return (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                          {labels[status]}
                        </span>
                      )
                    }

                    const isExpired = new Date(offer.validUntil) < new Date()
                    const isActive = offer.status === 'active' && !isExpired

                    return (
                      <div
                        key={offer.id}
                        className={`border-2 rounded-lg p-4 sm:p-6 transition-colors ${
                          isActive
                            ? 'border-green-200 bg-green-50/30 hover:border-green-300'
                            : offer.status === 'expired' || isExpired
                            ? 'border-gray-200 bg-gray-50/30'
                            : 'border-blue-200 bg-blue-50/30 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex-1 w-full">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900">{offer.title}</h3>
                              {getStatusBadge(offer.status)}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3">{offer.description}</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Discount</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                  {offer.discountType === 'percentage' 
                                    ? `${offer.discountValue}% OFF` 
                                    : `৳${offer.discountValue} OFF`}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{offer.serviceCategory}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Valid Period</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-900">
                                  {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Usage</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-900">
                                  {offer.usageCount}{offer.maxUsage ? ` / ${offer.maxUsage}` : ''}
                                </p>
                              </div>
                            </div>

                            {offer.minOrderAmount && (
                              <p className="text-xs text-gray-500">
                                Minimum order: ৳{offer.minOrderAmount.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-4">
                            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors text-xs sm:text-sm font-medium">
                              Edit
                            </button>
                            {isActive && (
                              <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm font-medium">
                                Deactivate
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {offers.length === 0 && (
                  <div className="text-center py-12">
                    <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No offers created yet. Create your first offer to attract more customers.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Chat Popup */}
      {showChat && selectedOrderId && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-96 sm:h-[600px] bg-white sm:rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Chat Header */}
          <div className="bg-[var(--color-primary)] text-white p-4 sm:rounded-t-lg flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg truncate">
                {getSelectedOrderInfo()?.clientName || 'Client'}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 truncate">
                {selectedOrderId} • {getSelectedOrderInfo()?.serviceName}
              </p>
            </div>
            <button
              onClick={() => {
                setShowChat(false)
                setSelectedOrderId(null)
                setNewMessage('')
              }}
              className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {(chatMessages[selectedOrderId] || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-3 sm:px-4 py-2 ${
                    msg.sender === 'vendor'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-xs sm:text-sm break-words">{msg.message}</p>
                  <p
                    className={`text-[10px] sm:text-xs mt-1 ${
                      msg.sender === 'vendor' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage()
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-[var(--color-primary)] text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

