'use client'

import { useState } from 'react'
import { 
  Users, 
  Store, 
  FolderTree, 
  FolderOpen, 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save,
  Star,
  Clock,
  DollarSign,
  Search,
  Filter,
  XCircle,
  FileText,
  MessageCircle,
  CheckCircle,
  XCircle as XCircleIcon,
  Send,
  ShoppingCart,
  UserCircle,
  Upload,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Types
interface User {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
  status: 'active' | 'inactive'
}

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  address: string
  district: string
  serviceCategories: string[]
  createdAt: string
  status: 'active' | 'inactive' | 'pending'
}

interface ServiceCategory {
  id: string
  title: string
  icon: string
  createdAt: string
}

interface SubCategory {
  id: string
  title: string
  icon: string
  categoryId: string
  createdAt: string
}

interface Service {
  id: string
  title: string
  slug: string
  image: string
  rating: string
  description: string
  deliveryTime: string
  startingPrice: string
  categoryId: string
  subCategoryId?: string
  createdAt: string
}

interface VendorServiceRequest {
  id: string
  vendorId: string
  vendorName: string
  serviceName: string
  category: string
  subCategory?: string
  description: string
  status: 'submitted' | 'under-review' | 'approved' | 'rejected'
  submittedDate: string
  reviewDate?: string
  reviewedBy?: string
  rejectionReason?: string
}

interface ChatMessage {
  id: string
  orderId: string
  vendorId: string
  vendorName: string
  clientId: string
  clientName: string
  serviceName: string
  sender: 'vendor' | 'client' | 'admin'
  message: string
  timestamp: string
  read: boolean
}

interface ChatConversation {
  orderId: string
  vendorId: string
  vendorName: string
  clientId: string
  clientName: string
  serviceName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: ChatMessage[]
}

type OrderStatus = 'Submitted' | 'Confirmed' | 'Assigned' | 'In-Progress' | 'Review' | 'Delivered' | 'Closed'

interface Order {
  id: string
  orderNumber: string
  serviceName: string
  vendorId: string
  vendorName: string
  clientId: string
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  status: OrderStatus
  orderDate: string
  scheduledDate?: string
  scheduledTime?: string
  subtotal: number
  additionalCost: number
  deliveryCharge: number
  discount: number
  total: number
  paymentStatus: 'pending' | 'paid' | 'refunded'
  items: Array<{
    name: string
    details: string
    price: number
  }>
}

type LeadStage = 'New' | 'Qualified' | 'Proposal' | 'Closed'
type ClosedReason = 'Won' | 'Lost' | 'Lost (Unqualified)'
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

type TabType = 'leads' | 'users' | 'vendors' | 'categories' | 'subcategories' | 'services' | 'service-requests' | 'chats' | 'orders'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('leads')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<User | Vendor | ServiceCategory | SubCategory | Service | null>(null)

  // Filter states for Users
  const [userSearch, setUserSearch] = useState('')
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all')

  // Filter states for Vendors
  const [vendorSearch, setVendorSearch] = useState('')
  const [vendorStatusFilter, setVendorStatusFilter] = useState<string>('all')
  const [vendorDistrictFilter, setVendorDistrictFilter] = useState<string>('all')
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState<string>('all')

  // Mock data - In production, this would come from API
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+8801712345678', createdAt: '2024-01-15', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+8801712345679', createdAt: '2024-01-20', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+8801712345680', createdAt: '2024-02-01', status: 'inactive' },
  ])

  const [vendors, setVendors] = useState<Vendor[]>([
    { id: '1', name: 'AC Repair Pro', email: 'acpro@example.com', phone: '+8801712345681', address: '123 Main St', district: 'Dhaka', serviceCategories: ['AC Repair Services'], createdAt: '2024-01-10', status: 'active' },
    { id: '2', name: 'Home Cleaners BD', email: 'cleaners@example.com', phone: '+8801712345682', address: '456 Park Ave', district: 'Chittagong', serviceCategories: ['Cleaning Solution'], createdAt: '2024-01-12', status: 'active' },
    { id: '3', name: 'Plumbing Experts', email: 'plumbing@example.com', phone: '+8801712345683', address: '789 Oak Rd', district: 'Sylhet', serviceCategories: ['Home Repair'], createdAt: '2024-01-18', status: 'pending' },
  ])

  const [categories, setCategories] = useState<ServiceCategory[]>([
    { id: '1', title: 'AC Repair Services', icon: '🔧', createdAt: '2024-01-01' },
    { id: '2', title: 'Appliance Repair', icon: '🔌', createdAt: '2024-01-01' },
    { id: '3', title: 'Cleaning Solution', icon: '🧹', createdAt: '2024-01-01' },
    { id: '4', title: 'Beauty & Wellness', icon: '💅', createdAt: '2024-01-01' },
    { id: '5', title: 'Shifting & Moving', icon: '📦', createdAt: '2024-01-01' },
    { id: '6', title: 'Home Repair', icon: '🏠', createdAt: '2024-01-01' },
  ])

  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    { id: '1', title: 'Fridge Repair', icon: '🧊', categoryId: '2', createdAt: '2024-01-02' },
    { id: '2', title: 'Microwave Repair', icon: '🍽️', categoryId: '2', createdAt: '2024-01-02' },
  ])

  const [services, setServices] = useState<Service[]>([
    { id: '1', title: 'AC Servicing', slug: 'ac-servicing', image: '/plumbing.jpg', rating: '4.9', description: 'Professional AC servicing and maintenance', deliveryTime: '2-3 hours', startingPrice: '৳800', categoryId: '1', createdAt: '2024-01-05' },
    { id: '2', title: 'Home Cleaning', slug: 'home-cleaning', image: '/cleaning_service.jpg', rating: '4.7', description: 'Comprehensive home cleaning services', deliveryTime: '3-5 hours', startingPrice: '৳1,500', categoryId: '3', createdAt: '2024-01-06' },
    { id: '3', title: 'Fridge Servicing', slug: 'fridge-servicing', image: '/plumbing.jpg', rating: '4.8', description: 'Professional fridge servicing', deliveryTime: '2-3 hours', startingPrice: '৳700', categoryId: '2', subCategoryId: '1', createdAt: '2024-01-07' },
  ])

  // Vendor Service Requests
  const [serviceRequests, setServiceRequests] = useState<VendorServiceRequest[]>([
    { id: '1', vendorId: '1', vendorName: 'AC Repair Pro', serviceName: 'AC Deep Cleaning', category: 'AC Repair Services', description: 'Comprehensive deep cleaning service for all AC units', status: 'submitted', submittedDate: '2024-01-20' },
    { id: '2', vendorId: '2', vendorName: 'Home Cleaners BD', serviceName: 'Office Deep Cleaning', category: 'Cleaning Solution', description: 'Professional office deep cleaning with eco-friendly products', status: 'under-review', submittedDate: '2024-01-18', reviewDate: '2024-01-19' },
    { id: '3', vendorId: '3', vendorName: 'Plumbing Experts', serviceName: 'Water Heater Installation', category: 'Home Repair', subCategory: 'Plumbing Services', description: 'Expert water heater installation and maintenance', status: 'approved', submittedDate: '2024-01-15', reviewDate: '2024-01-16', reviewedBy: 'Admin User' },
    { id: '4', vendorId: '1', vendorName: 'AC Repair Pro', serviceName: 'AC Gas Refill', category: 'AC Repair Services', description: 'AC gas refill service for all brands', status: 'rejected', submittedDate: '2024-01-10', reviewDate: '2024-01-12', reviewedBy: 'Admin User', rejectionReason: 'Service already exists in the platform' },
  ])

  // Chat Conversations
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([
    {
      orderId: 'ORD-001',
      vendorId: '1',
      vendorName: 'AC Repair Pro',
      clientId: '1',
      clientName: 'Ahmed Rahman',
      serviceName: 'AC Servicing',
      lastMessage: 'I will be there in 30 minutes.',
      lastMessageTime: '2024-01-15 10:32',
      unreadCount: 2,
      messages: [
        { id: '1', orderId: 'ORD-001', vendorId: '1', vendorName: 'AC Repair Pro', clientId: '1', clientName: 'Ahmed Rahman', serviceName: 'AC Servicing', sender: 'client', message: 'Hello, when will you arrive?', timestamp: '2024-01-15 10:30', read: true },
        { id: '2', orderId: 'ORD-001', vendorId: '1', vendorName: 'AC Repair Pro', clientId: '1', clientName: 'Ahmed Rahman', serviceName: 'AC Servicing', sender: 'vendor', message: 'I will be there in 30 minutes.', timestamp: '2024-01-15 10:32', read: true },
        { id: '3', orderId: 'ORD-001', vendorId: '1', vendorName: 'AC Repair Pro', clientId: '1', clientName: 'Ahmed Rahman', serviceName: 'AC Servicing', sender: 'client', message: 'Great, thank you!', timestamp: '2024-01-15 10:33', read: false },
        { id: '4', orderId: 'ORD-001', vendorId: '1', vendorName: 'AC Repair Pro', clientId: '1', clientName: 'Ahmed Rahman', serviceName: 'AC Servicing', sender: 'client', message: 'Please bring the necessary tools.', timestamp: '2024-01-15 10:35', read: false },
      ]
    },
    {
      orderId: 'ORD-003',
      vendorId: '3',
      vendorName: 'Plumbing Experts',
      clientId: '3',
      clientName: 'Karim Uddin',
      serviceName: 'Plumbing Services',
      lastMessage: 'Can you come earlier?',
      lastMessageTime: '2024-01-17 09:00',
      unreadCount: 1,
      messages: [
        { id: '1', orderId: 'ORD-003', vendorId: '3', vendorName: 'Plumbing Experts', clientId: '3', clientName: 'Karim Uddin', serviceName: 'Plumbing Services', sender: 'client', message: 'Can you come earlier?', timestamp: '2024-01-17 09:00', read: false },
      ]
    },
    {
      orderId: 'ORD-006',
      vendorId: '2',
      vendorName: 'Home Cleaners BD',
      clientId: '6',
      clientName: 'Nadia Islam',
      serviceName: 'Salon Care',
      lastMessage: 'Please confirm.',
      lastMessageTime: '2024-01-20 14:05',
      unreadCount: 2,
      messages: [
        { id: '1', orderId: 'ORD-006', vendorId: '2', vendorName: 'Home Cleaners BD', clientId: '6', clientName: 'Nadia Islam', serviceName: 'Salon Care', sender: 'client', message: 'What time is the appointment?', timestamp: '2024-01-20 14:00', read: false },
        { id: '2', orderId: 'ORD-006', vendorId: '2', vendorName: 'Home Cleaners BD', clientId: '6', clientName: 'Nadia Islam', serviceName: 'Salon Care', sender: 'client', message: 'Please confirm.', timestamp: '2024-01-20 14:05', read: false },
      ]
    },
  ])

  const [selectedChatOrderId, setSelectedChatOrderId] = useState<string | null>(null)
  const [chatSearch, setChatSearch] = useState('')
  const [serviceRequestStatusFilter, setServiceRequestStatusFilter] = useState<string>('all')
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({})
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [adminChatMessage, setAdminChatMessage] = useState('')

  // Orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      serviceName: 'AC Servicing',
      vendorId: '1',
      vendorName: 'AC Repair Pro',
      clientId: '1',
      clientName: 'Ahmed Rahman',
      clientPhone: '+8801712345678',
      clientEmail: 'ahmed@example.com',
      clientAddress: '123 Main Street, Gulshan, Dhaka',
      status: 'In-Progress',
      orderDate: '2024-01-15',
      scheduledDate: '2024-01-16',
      scheduledTime: '9:00 AM - 10:00 AM',
      subtotal: 800,
      additionalCost: 0,
      deliveryCharge: 0,
      discount: 0,
      total: 800,
      paymentStatus: 'paid',
      items: [
        { name: 'AC Check Up', details: '1 - 2.5 Ton', price: 800 }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      serviceName: 'Home Cleaning',
      vendorId: '2',
      vendorName: 'Home Cleaners BD',
      clientId: '2',
      clientName: 'Fatima Khan',
      clientPhone: '+8801723456789',
      clientEmail: 'fatima@example.com',
      clientAddress: '456 Park Avenue, Chittagong',
      status: 'Confirmed',
      orderDate: '2024-01-16',
      scheduledDate: '2024-01-17',
      scheduledTime: '2:00 PM - 5:00 PM',
      subtotal: 1500,
      additionalCost: 200,
      deliveryCharge: 0,
      discount: 100,
      total: 1600,
      paymentStatus: 'paid',
      items: [
        { name: 'Deep Cleaning', details: '3 Bedroom Apartment', price: 1500 }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      serviceName: 'Plumbing Services',
      vendorId: '3',
      vendorName: 'Plumbing Experts',
      clientId: '3',
      clientName: 'Karim Uddin',
      clientPhone: '+8801734567890',
      clientEmail: 'karim@example.com',
      clientAddress: '789 Oak Road, Sylhet',
      status: 'Assigned',
      orderDate: '2024-01-17',
      scheduledDate: '2024-01-18',
      scheduledTime: '10:00 AM - 12:00 PM',
      subtotal: 500,
      additionalCost: 0,
      deliveryCharge: 0,
      discount: 0,
      total: 500,
      paymentStatus: 'pending',
      items: [
        { name: 'Pipe Repair', details: 'Kitchen Sink', price: 500 }
      ]
    },
    {
      id: '4',
      orderNumber: 'ORD-004',
      serviceName: 'Electrical Services',
      vendorId: '1',
      vendorName: 'AC Repair Pro',
      clientId: '4',
      clientName: 'Sadia Rahman',
      clientPhone: '+8801745678901',
      clientEmail: 'sadia@example.com',
      clientAddress: '321 Elm Street, Dhaka',
      status: 'Review',
      orderDate: '2024-01-18',
      scheduledDate: '2024-01-19',
      scheduledTime: '11:00 AM - 1:00 PM',
      subtotal: 1200,
      additionalCost: 300,
      deliveryCharge: 0,
      discount: 150,
      total: 1350,
      paymentStatus: 'paid',
      items: [
        { name: 'Wiring Installation', details: 'Living Room', price: 1200 }
      ]
    },
    {
      id: '5',
      orderNumber: 'ORD-005',
      serviceName: 'House Shifting',
      vendorId: '2',
      vendorName: 'Home Cleaners BD',
      clientId: '5',
      clientName: 'Hasan Ali',
      clientPhone: '+8801756789012',
      clientEmail: 'hasan@example.com',
      clientAddress: '654 Pine Avenue, Dhaka',
      status: 'Delivered',
      orderDate: '2024-01-19',
      scheduledDate: '2024-01-20',
      scheduledTime: '8:00 AM - 12:00 PM',
      subtotal: 3000,
      additionalCost: 500,
      deliveryCharge: 0,
      discount: 200,
      total: 3300,
      paymentStatus: 'paid',
      items: [
        { name: 'Full House Shifting', details: '3 Bedroom House', price: 3000 }
      ]
    },
    {
      id: '6',
      orderNumber: 'ORD-006',
      serviceName: 'Salon Care',
      vendorId: '3',
      vendorName: 'Plumbing Experts',
      clientId: '6',
      clientName: 'Nadia Islam',
      clientPhone: '+8801767890123',
      clientEmail: 'nadia@example.com',
      clientAddress: '987 Maple Street, Chittagong',
      status: 'Submitted',
      orderDate: '2024-01-20',
      subtotal: 1200,
      additionalCost: 0,
      deliveryCharge: 0,
      discount: 0,
      total: 1200,
      paymentStatus: 'pending',
      items: [
        { name: 'Haircut & Styling', details: 'Women', price: 1200 }
      ]
    },
  ])

  // Order filters
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all')
  const [orderPaymentStatusFilter, setOrderPaymentStatusFilter] = useState<string>('all')
  const [orderDateFrom, setOrderDateFrom] = useState('')
  const [orderDateTo, setOrderDateTo] = useState('')

  // Order assignment state
  const [showAssignVendorModal, setShowAssignVendorModal] = useState(false)
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState<Order | null>(null)
  const [selectedVendorId, setSelectedVendorId] = useState<string>('')

  // Leads data
  const [leads, setLeads] = useState<Lead[]>([
    {
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
      initialDiscussion: 'Interested in monthly AC maintenance',
      stage: 'Proposal',
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
      street: 'Road 27, House 8',
      city: 'Dhanmondi',
      thana: 'Dhanmondi',
      district: 'Dhaka',
      country: 'Bangladesh',
      postalCode: '1205',
      desiredService: 'Home Cleaning',
      initialDiscussion: 'Needs deep cleaning service',
      stage: 'New',
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
      street: 'Road 11, House 23',
      city: 'Banani',
      thana: 'Banani',
      district: 'Dhaka',
      country: 'Bangladesh',
      postalCode: '1213',
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
      street: 'Sector 7, Road 15',
      city: 'Uttara',
      thana: 'Uttara',
      district: 'Dhaka',
      country: 'Bangladesh',
      postalCode: '1230',
      desiredService: 'Beauty & Wellness',
      initialDiscussion: 'Looking for spa services',
      stage: 'Qualified',
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
      street: 'Block C, Road 5',
      city: 'Mirpur',
      thana: 'Mirpur',
      district: 'Dhaka',
      country: 'Bangladesh',
      postalCode: '1216',
      desiredService: 'Electrical Services',
      initialDiscussion: 'Need electrical repair',
      stage: 'Closed',
      closedReason: 'Won',
      leadSource: 'Advertisement',
      leadSubSource: 'Email Campaign',
      leadOwner: 'John Doe',
      comment: 'Converted to customer',
      createdAt: '2024-01-19',
    },
  ])

  // Leads filters
  const [leadSearch, setLeadSearch] = useState('')
  const [leadStageFilter, setLeadStageFilter] = useState<string>('all')
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>('all')
  const [leadOwnerFilter, setLeadOwnerFilter] = useState<string>('all')
  const [leadCurrentPage, setLeadCurrentPage] = useState(1)
  const [leadItemsPerPage] = useState(10)

  const handleAssignVendor = (order: Order) => {
    setSelectedOrderForAssignment(order)
    setSelectedVendorId(order.vendorId || '')
    setShowAssignVendorModal(true)
  }

  const handleConfirmAssignment = () => {
    if (selectedOrderForAssignment && selectedVendorId) {
      const selectedVendor = vendors.find(v => v.id === selectedVendorId)
      if (selectedVendor) {
        setOrders(orders.map(order => 
          order.id === selectedOrderForAssignment.id
            ? { 
                ...order, 
                vendorId: selectedVendorId, 
                vendorName: selectedVendor.name,
                status: order.status === 'Submitted' ? 'Assigned' : order.status
              }
            : order
        ))
        setShowAssignVendorModal(false)
        setSelectedOrderForAssignment(null)
        setSelectedVendorId('')
      }
    }
  }

  // Form states
  const [userForm, setUserForm] = useState<{ name: string; email: string; phone: string; status: 'active' | 'inactive' }>({ name: '', email: '', phone: '', status: 'active' })
  const [vendorForm, setVendorForm] = useState<{ name: string; email: string; phone: string; address: string; district: string; serviceCategories: string[]; status: 'active' | 'inactive' | 'pending' }>({ name: '', email: '', phone: '', address: '', district: '', serviceCategories: [], status: 'active' })
  const [categoryForm, setCategoryForm] = useState({ title: '', icon: '' })
  const [subCategoryForm, setSubCategoryForm] = useState({ title: '', icon: '', categoryId: '' })
  const [serviceForm, setServiceForm] = useState({ title: '', slug: '', image: '', rating: '', description: '', deliveryTime: '', startingPrice: '', categoryId: '', subCategoryId: '' })

  const handleAdd = () => {
    setEditingItem(null)
    setIsModalOpen(true)
    // Reset forms based on active tab
    if (activeTab === 'users') {
      setUserForm({ name: '', email: '', phone: '', status: 'active' })
    } else if (activeTab === 'vendors') {
      setVendorForm({ name: '', email: '', phone: '', address: '', district: '', serviceCategories: [], status: 'active' })
    } else if (activeTab === 'categories') {
      setCategoryForm({ title: '', icon: '' })
    } else if (activeTab === 'subcategories') {
      setSubCategoryForm({ title: '', icon: '', categoryId: '' })
    } else if (activeTab === 'services') {
      setServiceForm({ title: '', slug: '', image: '', rating: '', description: '', deliveryTime: '', startingPrice: '', categoryId: '', subCategoryId: '' })
    }
  }

  const handleEdit = (item: User | Vendor | ServiceCategory | SubCategory | Service) => {
    setEditingItem(item)
    setIsModalOpen(true)
    if (activeTab === 'users' && 'name' in item && 'email' in item) {
      const userItem = item as User
      setUserForm({ name: userItem.name, email: userItem.email, phone: userItem.phone, status: userItem.status })
    } else if (activeTab === 'vendors' && 'address' in item) {
      const vendorItem = item as Vendor
      setVendorForm({ name: vendorItem.name, email: vendorItem.email, phone: vendorItem.phone, address: vendorItem.address, district: vendorItem.district, serviceCategories: vendorItem.serviceCategories, status: vendorItem.status })
    } else if (activeTab === 'categories' && 'title' in item && !('categoryId' in item)) {
      const categoryItem = item as ServiceCategory
      setCategoryForm({ title: categoryItem.title, icon: categoryItem.icon })
    } else if (activeTab === 'subcategories' && 'categoryId' in item) {
      const subCategoryItem = item as SubCategory
      setSubCategoryForm({ title: subCategoryItem.title, icon: subCategoryItem.icon, categoryId: subCategoryItem.categoryId })
    } else if (activeTab === 'services' && 'slug' in item) {
      const serviceItem = item as Service
      setServiceForm({ title: serviceItem.title, slug: serviceItem.slug, image: serviceItem.image, rating: serviceItem.rating, description: serviceItem.description, deliveryTime: serviceItem.deliveryTime, startingPrice: serviceItem.startingPrice, categoryId: serviceItem.categoryId, subCategoryId: serviceItem.subCategoryId || '' })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'users') {
        setUsers(users.filter(u => u.id !== id))
      } else if (activeTab === 'vendors') {
        setVendors(vendors.filter(v => v.id !== id))
      } else if (activeTab === 'categories') {
        setCategories(categories.filter(c => c.id !== id))
      } else if (activeTab === 'subcategories') {
        setSubCategories(subCategories.filter(s => s.id !== id))
      } else if (activeTab === 'services') {
        setServices(services.filter(s => s.id !== id))
      }
    }
  }

  const handleSave = () => {
    if (activeTab === 'users') {
      if (editingItem) {
        setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...userForm } : u))
      } else {
        setUsers([...users, { id: Date.now().toString(), ...userForm, createdAt: new Date().toISOString().split('T')[0] }])
      }
    } else if (activeTab === 'vendors') {
      if (editingItem) {
        setVendors(vendors.map(v => v.id === editingItem.id ? { ...v, ...vendorForm } : v))
      } else {
        setVendors([...vendors, { id: Date.now().toString(), ...vendorForm, createdAt: new Date().toISOString().split('T')[0] }])
      }
    } else if (activeTab === 'categories') {
      if (editingItem) {
        setCategories(categories.map(c => c.id === editingItem.id ? { ...c, ...categoryForm } : c))
      } else {
        setCategories([...categories, { id: Date.now().toString(), ...categoryForm, createdAt: new Date().toISOString().split('T')[0] }])
      }
    } else if (activeTab === 'subcategories') {
      if (editingItem) {
        setSubCategories(subCategories.map(s => s.id === editingItem.id ? { ...s, ...subCategoryForm } : s))
      } else {
        setSubCategories([...subCategories, { id: Date.now().toString(), ...subCategoryForm, createdAt: new Date().toISOString().split('T')[0] }])
      }
    } else if (activeTab === 'services') {
      if (editingItem) {
        setServices(services.map(s => s.id === editingItem.id ? { ...s, ...serviceForm } : s))
      } else {
        setServices([...services, { id: Date.now().toString(), ...serviceForm, createdAt: new Date().toISOString().split('T')[0] }])
      }
    }
    setIsModalOpen(false)
    setEditingItem(null)
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = userSearch === '' || 
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.phone.includes(userSearch)
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter
    return matchesSearch && matchesStatus
  })

  const clearUserFilters = () => {
    setUserSearch('')
    setUserStatusFilter('all')
  }

  const renderLeadsTab = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Filter size={18} className="sm:w-5 sm:h-5 text-gray-500" />
          <h3 className="font-semibold text-sm sm:text-base text-gray-700">Filters</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                value={leadSearch}
                onChange={(e) => {
                  setLeadSearch(e.target.value)
                  setLeadCurrentPage(1)
                }}
                placeholder="Search leads..."
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              value={leadStageFilter}
              onChange={(e) => {
                setLeadStageFilter(e.target.value)
                setLeadCurrentPage(1)
              }}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md"
            >
              <option value="all">All Stages</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Lead Source</label>
            <select
              value={leadSourceFilter}
              onChange={(e) => {
                setLeadSourceFilter(e.target.value)
                setLeadCurrentPage(1)
              }}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md"
            >
              <option value="all">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Lead Owner</label>
            <select
              value={leadOwnerFilter}
              onChange={(e) => {
                setLeadOwnerFilter(e.target.value)
                setLeadCurrentPage(1)
              }}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md"
            >
              <option value="all">All Owners</option>
              {uniqueLeadOwners.map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            {(leadSearch || leadStageFilter !== 'all' || leadSourceFilter !== 'all' || leadOwnerFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={clearLeadFilters}
                className="w-full text-sm sm:text-base"
              >
                <XCircle size={16} className="mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs sm:text-sm text-gray-500">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Link
            href="/leads/upload"
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <Upload size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Bulk Upload</span>
            <span className="sm:hidden">Upload</span>
          </Link>
          <Link
            href="/leads/new"
            className="flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            New Lead
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {paginatedLeads.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-sm sm:text-base text-gray-600">No leads found matching the filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Client Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">WhatsApp</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Mobile</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Profession</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Desired Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Stage</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Lead Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Lead Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800 underline text-sm"
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeadStageColor(lead.stage, lead.closedReason)}`}>
                          {getLeadStageDisplayText(lead.stage, lead.closedReason)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{lead.leadSource}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{lead.leadOwner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {paginatedLeads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-gray-50">
                  <div className="mb-3">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="font-semibold text-blue-600 hover:text-blue-800 underline text-base block mb-2"
                    >
                      {lead.clientName}
                    </Link>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getLeadStageColor(lead.stage, lead.closedReason)}`}>
                      {getLeadStageDisplayText(lead.stage, lead.closedReason)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {lead.whatsapp && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">WhatsApp:</span>
                        <span className="text-gray-900">{lead.whatsapp}</span>
                      </div>
                    )}
                    {lead.mobile && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mobile:</span>
                        <span className="text-gray-900">{lead.mobile}</span>
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900 truncate ml-2">{lead.email}</span>
                      </div>
                    )}
                    {lead.profession && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profession:</span>
                        <span className="text-gray-900">{lead.profession}</span>
                      </div>
                    )}
                    {lead.desiredService && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service:</span>
                        <span className="text-gray-900">{lead.desiredService}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Source:</span>
                      <span className="text-gray-900">{lead.leadSource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Owner:</span>
                      <span className="text-gray-900">{lead.leadOwner}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {leadTotalPages > 1 && (
              <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {(leadCurrentPage - 1) * leadItemsPerPage + 1} to {Math.min(leadCurrentPage * leadItemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setLeadCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={leadCurrentPage === 1}
                    className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {Array.from({ length: leadTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setLeadCurrentPage(page)}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          leadCurrentPage === page
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setLeadCurrentPage(prev => Math.min(leadTotalPages, prev + 1))}
                    disabled={leadCurrentPage === leadTotalPages}
                    className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  const renderUsersTab = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            {(userSearch || userStatusFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={clearUserFilters}
                className="w-full"
              >
                <XCircle size={16} className="mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 md:px-6 py-8 text-center text-gray-500">
                    No users found matching the filters
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendorSearch === '' || 
      vendor.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      vendor.email.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      vendor.phone.includes(vendorSearch) ||
      vendor.district.toLowerCase().includes(vendorSearch.toLowerCase())
    const matchesStatus = vendorStatusFilter === 'all' || vendor.status === vendorStatusFilter
    const matchesDistrict = vendorDistrictFilter === 'all' || vendor.district === vendorDistrictFilter
    const matchesCategory = vendorCategoryFilter === 'all' || vendor.serviceCategories.includes(vendorCategoryFilter)
    return matchesSearch && matchesStatus && matchesDistrict && matchesCategory
  })

  // Get unique districts from vendors
  const uniqueDistricts = Array.from(new Set(vendors.map(v => v.district))).sort()

  const clearVendorFilters = () => {
    setVendorSearch('')
    setVendorStatusFilter('all')
    setVendorDistrictFilter('all')
    setVendorCategoryFilter('all')
  }

  const renderVendorsTab = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                placeholder="Search by name, email, phone, or district..."
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={vendorStatusFilter}
              onChange={(e) => setVendorStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select
              value={vendorDistrictFilter}
              onChange={(e) => setVendorDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Districts</option>
              {uniqueDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
            <select
              value={vendorCategoryFilter}
              onChange={(e) => setVendorCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.title}>{cat.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
          {(vendorSearch || vendorStatusFilter !== 'all' || vendorDistrictFilter !== 'all' || vendorCategoryFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={clearVendorFilters}
            >
              <XCircle size={16} className="mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 md:px-6 py-8 text-center text-gray-500">
                    No vendors found matching the filters
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.email}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.phone}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.district}</td>
                    <td className="px-3 md:px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {vendor.serviceCategories.map((cat, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{cat}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vendor.status === 'active' ? 'bg-green-100 text-green-800' : 
                        vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(vendor)} className="text-indigo-600 hover:text-indigo-900">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(vendor.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderCategoriesTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">Created: {category.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSubCategoriesTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subCategories.map((subCategory) => {
          const category = categories.find(c => c.id === subCategory.categoryId)
          return (
            <div key={subCategory.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{subCategory.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{subCategory.title}</h3>
                    <p className="text-sm text-gray-500">Under: {category?.title || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(subCategory)} className="text-indigo-600 hover:text-indigo-900">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(subCategory.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">Created: {subCategory.createdAt}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  // Filter service requests
  const filteredServiceRequests = serviceRequests.filter(request => {
    const matchesStatus = serviceRequestStatusFilter === 'all' || request.status === serviceRequestStatusFilter
    return matchesStatus
  })

  const handleApproveServiceRequest = (id: string) => {
    if (confirm('Are you sure you want to approve this service request?')) {
      setServiceRequests(serviceRequests.map(req => 
        req.id === id 
          ? { ...req, status: 'approved' as const, reviewDate: new Date().toISOString().split('T')[0], reviewedBy: 'Admin' }
          : req
      ))
    }
  }

  const handleRejectServiceRequest = (id: string, reason: string) => {
    if (confirm('Are you sure you want to reject this service request?')) {
      setServiceRequests(serviceRequests.map(req => 
        req.id === id 
          ? { ...req, status: 'rejected' as const, reviewDate: new Date().toISOString().split('T')[0], reviewedBy: 'Admin', rejectionReason: reason }
          : req
      ))
    }
  }

  const renderServiceRequestsTab = () => {
    return (
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-700">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={serviceRequestStatusFilter}
                onChange={(e) => setServiceRequestStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-end">
              {serviceRequestStatusFilter !== 'all' && (
                <Button
                  variant="outline"
                  onClick={() => setServiceRequestStatusFilter('all')}
                  className="w-full"
                >
                  <XCircle size={16} className="mr-2" />
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Showing {filteredServiceRequests.length} of {serviceRequests.length} requests
          </div>
        </div>

        {/* Service Requests List */}
        <div className="space-y-4">
          {filteredServiceRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
              No service requests found matching the filters
            </div>
          ) : (
            filteredServiceRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.serviceName}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        request.status === 'under-review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Vendor:</span> {request.vendorName}</p>
                      <p><span className="font-medium">Category:</span> {request.category} {request.subCategory && `> ${request.subCategory}`}</p>
                      <p><span className="font-medium">Description:</span> {request.description}</p>
                      <p><span className="font-medium">Submitted:</span> {request.submittedDate}</p>
                      {request.reviewDate && (
                        <p><span className="font-medium">Reviewed:</span> {request.reviewDate} by {request.reviewedBy}</p>
                      )}
                      {request.rejectionReason && (
                        <p className="text-red-600"><span className="font-medium">Rejection Reason:</span> {request.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  {request.status === 'submitted' && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:ml-4">
                      <Button
                        onClick={() => handleApproveServiceRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => setShowRejectModal(request.id)}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                      >
                        <XCircleIcon size={16} className="mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {request.status === 'under-review' && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:ml-4">
                      <Button
                        onClick={() => handleApproveServiceRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => setShowRejectModal(request.id)}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                      >
                        <XCircleIcon size={16} className="mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 md:p-6 border-b">
                <h2 className="text-lg md:text-xl font-bold">Reject Service Request</h2>
                <button onClick={() => setShowRejectModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 md:p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                <textarea
                  value={rejectionReason[showRejectModal] || ''}
                  onChange={(e) => setRejectionReason({ ...rejectionReason, [showRejectModal]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Enter the reason for rejection..."
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 md:p-6 border-t">
                <Button variant="outline" onClick={() => setShowRejectModal(null)} className="w-full sm:w-auto">Cancel</Button>
                <Button
                  onClick={() => {
                    if (rejectionReason[showRejectModal]) {
                      handleRejectServiceRequest(showRejectModal, rejectionReason[showRejectModal])
                      setShowRejectModal(null)
                      setRejectionReason({ ...rejectionReason, [showRejectModal]: '' })
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                  disabled={!rejectionReason[showRejectModal]}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Filter chat conversations
  const filteredChatConversations = chatConversations.filter(chat => {
    const matchesSearch = chatSearch === '' ||
      chat.vendorName.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.clientName.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.serviceName.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.orderId.toLowerCase().includes(chatSearch.toLowerCase())
    return matchesSearch
  })

  const selectedChat = selectedChatOrderId ? chatConversations.find(c => c.orderId === selectedChatOrderId) : null

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = orderSearch === '' ||
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.clientName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.clientPhone.includes(orderSearch) ||
      order.clientEmail.toLowerCase().includes(orderSearch.toLowerCase())
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter
    const matchesPaymentStatus = orderPaymentStatusFilter === 'all' || order.paymentStatus === orderPaymentStatusFilter
    const matchesDateFrom = orderDateFrom === '' || order.orderDate >= orderDateFrom
    const matchesDateTo = orderDateTo === '' || order.orderDate <= orderDateTo
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateFrom && matchesDateTo
  })

  const clearOrderFilters = () => {
    setOrderSearch('')
    setOrderStatusFilter('all')
    setOrderPaymentStatusFilter('all')
    setOrderDateFrom('')
    setOrderDateTo('')
  }

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = leadSearch === '' ||
      lead.clientName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.email?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.mobile?.includes(leadSearch) ||
      lead.whatsapp?.includes(leadSearch) ||
      lead.desiredService?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.leadOwner.toLowerCase().includes(leadSearch.toLowerCase())
    const matchesStage = leadStageFilter === 'all' || lead.stage === leadStageFilter
    const matchesSource = leadSourceFilter === 'all' || lead.leadSource === leadSourceFilter
    const matchesOwner = leadOwnerFilter === 'all' || lead.leadOwner === leadOwnerFilter
    return matchesSearch && matchesStage && matchesSource && matchesOwner
  })

  const leadTotalPages = Math.ceil(filteredLeads.length / leadItemsPerPage)
  const paginatedLeads = filteredLeads.slice(
    (leadCurrentPage - 1) * leadItemsPerPage,
    leadCurrentPage * leadItemsPerPage
  )

  const clearLeadFilters = () => {
    setLeadSearch('')
    setLeadStageFilter('all')
    setLeadSourceFilter('all')
    setLeadOwnerFilter('all')
    setLeadCurrentPage(1)
  }

  const getLeadStageColor = (stage: LeadStage, closedReason?: ClosedReason) => {
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

  const getLeadStageDisplayText = (stage: LeadStage, closedReason?: ClosedReason) => {
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

  const getFieldValue = (lead: Lead, field: string) => {
    const value = lead[field as keyof Lead]
    if (value === undefined || value === null) return '-'
    return String(value)
  }

  const uniqueLeadOwners = Array.from(new Set(leads.map(l => l.leadOwner))).sort()

  const renderOrdersTab = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders..."
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Assigned">Assigned</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Review">Review</option>
              <option value="Delivered">Delivered</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              value={orderPaymentStatusFilter}
              onChange={(e) => setOrderPaymentStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Payment</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <Input
              type="date"
              value={orderDateFrom}
              onChange={(e) => setOrderDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <Input
              type="date"
              value={orderDateTo}
              onChange={(e) => setOrderDateTo(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          {(orderSearch || orderStatusFilter !== 'all' || orderPaymentStatusFilter !== 'all' || orderDateFrom || orderDateTo) && (
            <Button
              variant="outline"
              onClick={clearOrderFilters}
            >
              <XCircle size={16} className="mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 md:px-6 py-8 text-center text-gray-500">
                    No orders found matching the filters
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.serviceName}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.vendorName}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.clientName}</div>
                        <div className="text-gray-500">{order.clientPhone}</div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                        order.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Confirmed' || order.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        order.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">৳{order.total.toLocaleString()}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{order.orderDate}</div>
                      {order.scheduledDate && (
                        <div className="text-xs text-gray-400">Scheduled: {order.scheduledDate}</div>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <button
                          onClick={() => {
                            // View order details - could open a modal or navigate
                            alert(`Order Details:\n\nOrder: ${order.orderNumber}\nService: ${order.serviceName}\nVendor: ${order.vendorName}\nClient: ${order.clientName}\nStatus: ${order.status}\nTotal: ৳${order.total}\n\nItems:\n${order.items.map(item => `- ${item.name} (${item.details}): ৳${item.price}`).join('\n')}`)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        {(order.status === 'Submitted' || order.status === 'Confirmed' || !order.vendorId) && (
                          <button
                            onClick={() => handleAssignVendor(order)}
                            className="text-green-600 hover:text-green-900 font-medium"
                            title="Assign/Route to Vendor"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Vendor Modal */}
      {showAssignVendorModal && selectedOrderForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-6 border-b">
              <h2 className="text-lg md:text-xl font-bold">Assign Order to Vendor</h2>
              <button onClick={() => {
                setShowAssignVendorModal(false)
                setSelectedOrderForAssignment(null)
                setSelectedVendorId('')
              }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Order:</span> {selectedOrderForAssignment.orderNumber}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Service:</span> {selectedOrderForAssignment.serviceName}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Current Vendor:</span> {selectedOrderForAssignment.vendorName || 'Not Assigned'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vendor</label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a vendor...</option>
                  {vendors
                    .filter(v => v.status === 'active')
                    .map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name} - {vendor.district} {vendor.serviceCategories.some(cat => cat === selectedOrderForAssignment.serviceName || selectedOrderForAssignment.serviceName.includes(cat)) ? '(✓)' : ''}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only active vendors are shown. Vendors matching the service category are marked with (✓).
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 md:p-6 border-t">
              <Button variant="outline" onClick={() => {
                setShowAssignVendorModal(false)
                setSelectedOrderForAssignment(null)
                setSelectedVendorId('')
              }} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAssignment}
                className="bg-[var(--color-primary)] hover:opacity-90 w-full sm:w-auto"
                disabled={!selectedVendorId}
              >
                <CheckCircle size={16} className="mr-2" />
                Assign Vendor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderChatsTab = () => {
    const handleSendMessage = (orderId: string) => {
      if (!adminChatMessage.trim()) return
      
      const conversation = chatConversations.find(c => c.orderId === orderId)
      if (conversation) {
        const message: ChatMessage = {
          id: Date.now().toString(),
          orderId,
          vendorId: conversation.vendorId,
          vendorName: conversation.vendorName,
          clientId: conversation.clientId,
          clientName: conversation.clientName,
          serviceName: conversation.serviceName,
          sender: 'admin',
          message: adminChatMessage,
          timestamp: new Date().toISOString(),
          read: false
        }

        setChatConversations(chatConversations.map(c => 
          c.orderId === orderId
            ? { ...c, messages: [...c.messages, message], lastMessage: adminChatMessage, lastMessageTime: message.timestamp }
            : c
        ))
        setAdminChatMessage('')
      }
    }

    return (
      <div className="flex flex-col md:flex-row gap-4 h-[600px]">
        {/* Chat List */}
        <div className={`${selectedChatOrderId ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-gray-200 flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredChatConversations.length} conversations
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChatConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No conversations found</div>
            ) : (
              filteredChatConversations.map((chat) => (
                <button
                  key={chat.orderId}
                  onClick={() => setSelectedChatOrderId(chat.orderId)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedChatOrderId === chat.orderId ? 'bg-blue-50 border-l-4 border-l-[var(--color-primary)]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{chat.serviceName}</p>
                      <p className="text-xs text-gray-500">{chat.vendorName} ↔ {chat.clientName}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-[var(--color-primary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">{chat.lastMessageTime}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedChat.serviceName}</h3>
                    <p className="text-sm text-gray-600">Order: {selectedChat.orderId}</p>
                    <p className="text-xs text-gray-500">{selectedChat.vendorName} ↔ {selectedChat.clientName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedChatOrderId(null)}
                    className="md:hidden text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'admin' 
                        ? 'bg-[var(--color-primary)] text-white' 
                        : message.sender === 'vendor'
                        ? 'bg-blue-100 text-gray-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="text-xs font-medium mb-1">
                        {message.sender === 'admin' ? 'Admin' : message.sender === 'vendor' ? message.vendorName : message.clientName}
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'admin' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    value={adminChatMessage}
                    onChange={(e) => setAdminChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedChat.orderId)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage(selectedChat.orderId)}
                    className="bg-[var(--color-primary)] hover:opacity-90"
                    disabled={!adminChatMessage.trim()}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderServicesTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => {
          const category = categories.find(c => c.id === service.categoryId)
          const subCategory = service.subCategoryId ? subCategories.find(s => s.id === service.subCategoryId) : null
          return (
            <div key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="relative h-48">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(service)} className="text-indigo-600 hover:text-indigo-900">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{service.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{service.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} />
                    <span className="font-semibold">{service.startingPrice}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Category: {category?.title || 'Unknown'}</p>
                  {subCategory && <p>Sub-category: {subCategory.title}</p>}
                  <p>Slug: {service.slug}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderModal = () => {
    if (!isModalOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 md:p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-lg md:text-xl font-bold">
              {editingItem ? 'Edit' : 'Add New'} {activeTab === 'users' ? 'User' : activeTab === 'vendors' ? 'Vendor' : activeTab === 'categories' ? 'Category' : activeTab === 'subcategories' ? 'Sub-Category' : 'Service'}
            </h2>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            {activeTab === 'users' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={userForm.status} onChange={(e) => setUserForm({ ...userForm, status: e.target.value as 'active' | 'inactive' })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'vendors' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input value={vendorForm.name} onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input type="email" value={vendorForm.email} onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input value={vendorForm.phone} onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input value={vendorForm.address} onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <Input value={vendorForm.district} onChange={(e) => setVendorForm({ ...vendorForm, district: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Categories</label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={vendorForm.serviceCategories.includes(cat.title)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setVendorForm({ ...vendorForm, serviceCategories: [...vendorForm.serviceCategories, cat.title] })
                            } else {
                              setVendorForm({ ...vendorForm, serviceCategories: vendorForm.serviceCategories.filter(c => c !== cat.title) })
                            }
                          }}
                        />
                        <span>{cat.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={vendorForm.status} onChange={(e) => setVendorForm({ ...vendorForm, status: e.target.value as 'active' | 'inactive' | 'pending' })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'categories' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input value={categoryForm.title} onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                  <Input value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} placeholder="🔧" />
                </div>
              </>
            )}

            {activeTab === 'subcategories' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input value={subCategoryForm.title} onChange={(e) => setSubCategoryForm({ ...subCategoryForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                  <Input value={subCategoryForm.icon} onChange={(e) => setSubCategoryForm({ ...subCategoryForm, icon: e.target.value })} placeholder="🧊" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={subCategoryForm.categoryId} onChange={(e) => setSubCategoryForm({ ...subCategoryForm, categoryId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {activeTab === 'services' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <Input value={serviceForm.slug} onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })} placeholder="ac-servicing" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <Input value={serviceForm.image} onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })} placeholder="/plumbing.jpg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <Input value={serviceForm.rating} onChange={(e) => setServiceForm({ ...serviceForm, rating: e.target.value })} placeholder="4.9" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                  <Input value={serviceForm.deliveryTime} onChange={(e) => setServiceForm({ ...serviceForm, deliveryTime: e.target.value })} placeholder="2-3 hours" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price</label>
                  <Input value={serviceForm.startingPrice} onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: e.target.value })} placeholder="৳800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={serviceForm.categoryId} onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category (Optional)</label>
                  <select value={serviceForm.subCategoryId} onChange={(e) => setServiceForm({ ...serviceForm, subCategoryId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">None</option>
                    {subCategories.filter(s => s.categoryId === serviceForm.categoryId).map((subCat) => (
                      <option key={subCat.id} value={subCat.id}>{subCat.title}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 md:p-6 border-t sticky bottom-0 bg-white">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleSave} className="bg-[var(--color-primary)] hover:opacity-90 w-full sm:w-auto">
              <Save size={16} className="mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Manage users, vendors, categories, and services</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'leads' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserCircle size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Leads</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'users' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Users</span>
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'vendors' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Store size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Vendors</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'categories' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FolderTree size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Categories</span>
            </button>
            <button
              onClick={() => setActiveTab('subcategories')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'subcategories' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FolderOpen size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Sub-Categories</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'services' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Services</span>
            </button>
            <button
              onClick={() => setActiveTab('service-requests')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'service-requests' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Service Requests</span>
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'chats' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Chats</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 md:px-6 py-3 md:py-4 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Orders</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {activeTab === 'leads' && 'All Leads'}
              {activeTab === 'users' && 'All Users'}
              {activeTab === 'vendors' && 'All Vendors'}
              {activeTab === 'categories' && 'Service Categories'}
              {activeTab === 'subcategories' && 'Sub-Categories'}
              {activeTab === 'services' && 'All Services'}
              {activeTab === 'service-requests' && 'Vendor Service Requests'}
              {activeTab === 'chats' && 'Vendor-Client Chats'}
              {activeTab === 'orders' && 'All Orders'}
            </h2>
            {(activeTab !== 'leads' && activeTab !== 'service-requests' && activeTab !== 'chats' && activeTab !== 'orders') && (
              <Button onClick={handleAdd} className="bg-[var(--color-primary)] hover:opacity-90 w-full sm:w-auto">
                <Plus size={16} className="mr-2" />
                Add New
              </Button>
            )}
          </div>

          {activeTab === 'leads' && renderLeadsTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'vendors' && renderVendorsTab()}
          {activeTab === 'categories' && renderCategoriesTab()}
          {activeTab === 'subcategories' && renderSubCategoriesTab()}
          {activeTab === 'services' && renderServicesTab()}
          {activeTab === 'service-requests' && renderServiceRequestsTab()}
          {activeTab === 'chats' && renderChatsTab()}
          {activeTab === 'orders' && renderOrdersTab()}
        </div>
      </div>

      {renderModal()}
    </div>
  )
}

