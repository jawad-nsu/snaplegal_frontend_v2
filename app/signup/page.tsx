'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Check } from 'lucide-react'
import Navbar from '@/components/navbar'

const serviceCategories = [
  'AC Repair Services',
  'Appliance Repair',
  'Cleaning Solution',
  'Beauty & Wellness',
  'Shifting & Moving',
  'Home Repair',
  'Plumbing Services',
  'Electrical Services',
  'Painting Services',
  'Carpentry Services',
]

const districts = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
  'Jessore',
  'Bogra',
  'Cox\'s Bazar',
  'Gazipur',
  'Narayanganj',
  'Savar',
]

export default function SignUpPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'user' | 'partner'>('user')
  
  // User form data
  const [userFormData, setUserFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  // Partner form data
  const [partnerFormData, setPartnerFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    district: '',
    serviceCategories: [] as string[],
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPartnerPassword, setShowPartnerPassword] = useState(false)
  const [showPartnerConfirmPassword, setShowPartnerConfirmPassword] = useState(false)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const serviceDropdownRef = useRef<HTMLDivElement>(null)
  
  const [userErrors, setUserErrors] = useState<{
    name?: string
    phone?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  
  const [partnerErrors, setPartnerErrors] = useState<{
    name?: string
    phone?: string
    email?: string
    password?: string
    confirmPassword?: string
    address?: string
    district?: string
    serviceCategories?: string
  }>({})

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserFormData(prev => ({ ...prev, [name]: value }))
    if (userErrors[name as keyof typeof userErrors]) {
      setUserErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handlePartnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPartnerFormData(prev => ({ ...prev, [name]: value }))
    if (partnerErrors[name as keyof typeof partnerErrors]) {
      setPartnerErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }


  const toggleServiceCategory = (category: string) => {
    setPartnerFormData(prev => {
      const isSelected = prev.serviceCategories.includes(category)
      return {
        ...prev,
        serviceCategories: isSelected
          ? prev.serviceCategories.filter(c => c !== category)
          : [...prev.serviceCategories, category]
      }
    })
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof userErrors = {}

    if (!userFormData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!userFormData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[0-9]{10,15}$/.test(userFormData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!userFormData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!userFormData.password) {
      newErrors.password = 'Password is required'
    } else if (userFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!userFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (userFormData.password !== userFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setUserErrors(newErrors)
      return
    }

    try {
      // Call signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userFormData.name,
          phone: userFormData.phone,
          email: userFormData.email,
          password: userFormData.password,
          confirmPassword: userFormData.confirmPassword,
          userType: 'user',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setUserErrors(data.errors)
        } else {
          setUserErrors({ email: data.error || 'An error occurred' })
        }
        return
      }

      // Store user data for verification
      const verificationData = {
        type: 'user' as const,
        name: data.user.name,
        phone: data.user.phone,
        email: data.user.email,
        id: data.user.id,
      }
      localStorage.setItem('pendingVerification', JSON.stringify(verificationData))
      
      // Navigate to OTP verification page
      router.push('/verify-otp')
    } catch (error) {
      setUserErrors({ email: 'An error occurred. Please try again.' })
    }
  }

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof partnerErrors = {}

    if (!partnerFormData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!partnerFormData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[0-9]{10,15}$/.test(partnerFormData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!partnerFormData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerFormData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!partnerFormData.password) {
      newErrors.password = 'Password is required'
    } else if (partnerFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!partnerFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (partnerFormData.password !== partnerFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!partnerFormData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!partnerFormData.district) {
      newErrors.district = 'District is required'
    }

    if (partnerFormData.serviceCategories.length === 0) {
      newErrors.serviceCategories = 'Please select at least one service category'
    }

    if (Object.keys(newErrors).length > 0) {
      setPartnerErrors(newErrors)
      return
    }

    try {
      // Call signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: partnerFormData.name,
          phone: partnerFormData.phone,
          email: partnerFormData.email,
          password: partnerFormData.password,
          confirmPassword: partnerFormData.confirmPassword,
          userType: 'partner',
          address: partnerFormData.address,
          district: partnerFormData.district,
          serviceCategories: partnerFormData.serviceCategories,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setPartnerErrors(data.errors)
        } else {
          setPartnerErrors({ email: data.error || 'An error occurred' })
        }
        return
      }

      // Store partner data for verification
      const verificationData = {
        type: 'partner' as const,
        name: data.user.name,
        phone: data.user.phone,
        email: data.user.email,
        id: data.user.id,
      }
      localStorage.setItem('pendingVerification', JSON.stringify(verificationData))
      
      // Navigate to OTP verification page
      router.push('/verify-otp')
    } catch (error) {
      setPartnerErrors({ email: 'An error occurred. Please try again.' })
    }
  }

  const handleSocialSignup = (provider: 'google' | 'facebook' | 'instagram') => {
    console.log(`Sign up with ${provider}`)
    // Handle social signup logic here
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setShowServiceDropdown(false)
      }
    }

    if (showServiceDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showServiceDropdown])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
            <p className="text-gray-600 mb-8">Create your account to get started.</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('user')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'user'
                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User Signup
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('partner')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'partner'
                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Consultant Signup
              </button>
            </div>

            {/* User Signup Form */}
            {activeTab === 'user' && (
              <form onSubmit={handleUserSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="user-name"
                    name="name"
                    value={userFormData.name}
                    onChange={handleUserChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      userErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {userErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="user-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="user-phone"
                    name="phone"
                    value={userFormData.phone}
                    onChange={handleUserChange}
                    placeholder="+880 1XXX XXXXXX"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      userErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {userErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="user-email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleUserChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      userErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {userErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="user-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="user-password"
                      name="password"
                      value={userFormData.password}
                      onChange={handleUserChange}
                      placeholder="Create a password"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] pr-12 ${
                        userErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {userErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="user-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="user-confirm-password"
                      name="confirmPassword"
                      value={userFormData.confirmPassword}
                      onChange={handleUserChange}
                      placeholder="Confirm your password"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] pr-12 ${
                        userErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {userErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Social Signup */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('google')}
                      className="flex flex-col items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('facebook')}
                      className="flex flex-col items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Facebook</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('instagram')}
                      className="flex flex-col items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
                        <defs>
                          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f09433" />
                            <stop offset="25%" stopColor="#e6683c" />
                            <stop offset="50%" stopColor="#dc2743" />
                            <stop offset="75%" stopColor="#cc2366" />
                            <stop offset="100%" stopColor="#bc1888" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Instagram</span>
                    </button>
                  </div>
                </div>

                {/* Terms Notice */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By signing up, you agree to our{' '}
                    <Link href="#" className="text-[var(--color-primary)] hover:opacity-80">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-[var(--color-primary)] hover:opacity-80">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
                >
                  Sign Up
                </button>

                {/* Sign In Link */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-[var(--color-primary)] hover:opacity-80 font-medium">
                      Sign In
                    </Link>
                  </p>
                  <p className="text-sm">
                    <Link href="/forgot-password" className="text-[var(--color-primary)] hover:opacity-80">
                      Forgot password?
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* Consultant Signup Form */}
            {activeTab === 'partner' && (
              <form onSubmit={handlePartnerSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="partner-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="partner-name"
                    name="name"
                    value={partnerFormData.name}
                    onChange={handlePartnerChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      partnerErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {partnerErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{partnerErrors.name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="partner-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="partner-phone"
                    name="phone"
                    value={partnerFormData.phone}
                    onChange={handlePartnerChange}
                    placeholder="+880 1XXX XXXXXX"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      partnerErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {partnerErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{partnerErrors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="partner-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="partner-email"
                    name="email"
                    value={partnerFormData.email}
                    onChange={handlePartnerChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      partnerErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {partnerErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{partnerErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="partner-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPartnerPassword ? 'text' : 'password'}
                      id="partner-password"
                      name="password"
                      value={partnerFormData.password}
                      onChange={handlePartnerChange}
                      placeholder="Create a password"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] pr-12 ${
                        partnerErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPartnerPassword(!showPartnerPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPartnerPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {partnerErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{partnerErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="partner-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPartnerConfirmPassword ? 'text' : 'password'}
                      id="partner-confirm-password"
                      name="confirmPassword"
                      value={partnerFormData.confirmPassword}
                      onChange={handlePartnerChange}
                      placeholder="Confirm your password"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] pr-12 ${
                        partnerErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPartnerConfirmPassword(!showPartnerConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPartnerConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {partnerErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{partnerErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Address District */}
                <div>
                  <label htmlFor="partner-district" className="block text-sm font-medium text-gray-700 mb-2">
                    Address District
                  </label>
                  <select
                    id="partner-district"
                    name="district"
                    value={partnerFormData.district}
                    onChange={handlePartnerChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      partnerErrors.district ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {partnerErrors.district && (
                    <p className="mt-1 text-sm text-red-600">{partnerErrors.district}</p>
                  )}
                </div>

                {/* Service Category Multi-select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Category
                  </label>
                  <div className="relative" ref={serviceDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-left ${
                        partnerErrors.serviceCategories ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {partnerFormData.serviceCategories.length > 0
                        ? `${partnerFormData.serviceCategories.length} category(ies) selected`
                        : 'Select service categories'}
                    </button>
                    {showServiceDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {serviceCategories.map((category) => {
                          const isSelected = partnerFormData.serviceCategories.includes(category)
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => toggleServiceCategory(category)}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${
                                isSelected ? 'bg-[var(--color-neutral)]' : ''
                              }`}
                            >
                              <span>{category}</span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[var(--color-primary)]" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  {partnerFormData.serviceCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {partnerFormData.serviceCategories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-neutral)] text-[var(--color-primary)] rounded-full text-sm"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => toggleServiceCategory(category)}
                            className="hover:opacity-80"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {partnerErrors.serviceCategories && (
                    <p className="mt-1 text-sm text-red-600">{partnerErrors.serviceCategories}</p>
                  )}
                </div>

                {/* Social Signup */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('google')}
                      className="flex flex-col items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('facebook')}
                      className="flex flex-col items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Facebook</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('instagram')}
                      className="flex flex-col items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
                        <defs>
                          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f09433" />
                            <stop offset="25%" stopColor="#e6683c" />
                            <stop offset="50%" stopColor="#dc2743" />
                            <stop offset="75%" stopColor="#cc2366" />
                            <stop offset="100%" stopColor="#bc1888" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Instagram</span>
                    </button>
                  </div>
                </div>

                {/* Terms Notice */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By signing up, you agree to our{' '}
                    <Link href="#" className="text-[var(--color-primary)] hover:opacity-80">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-[var(--color-primary)] hover:opacity-80">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
                >
                  Sign Up
                </button>

                {/* Sign In Link */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-[var(--color-primary)] hover:opacity-80 font-medium">
                      Sign In
                    </Link>
                  </p>
                  <p className="text-sm">
                    <Link href="/forgot-password" className="text-[var(--color-primary)] hover:opacity-80">
                      Forgot password?
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

