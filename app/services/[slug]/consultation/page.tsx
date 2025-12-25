'use client'

import { use, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, FileText, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function ConsultationPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { slug } = use(params)
  const datePickerRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: '',
  })
  
  const [errors, setErrors] = useState<{
    date?: string
    time?: string
    description?: string
  }>({})
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(calendarYear, calendarMonth, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      setErrors(prev => ({ ...prev, date: 'Please select a future date' }))
      return
    }
    
    const dateString = selectedDate.toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, date: dateString }))
    setShowDatePicker(false)
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}

    if (!formData.date) {
      newErrors.date = 'Date is required'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date'
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Handle form submission
    console.log('Consultation booking:', { slug, ...formData })
    setIsSubmitted(true)
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push(`/services/${slug}`)
    }, 2000)
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]
  
  // Calendar helper functions
  const getDaysInMonth = () => {
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
    
    return days
  }
  
  const isDateSelected = (day: number | null) => {
    if (day === null || !formData.date) return false
    const dateKey = new Date(calendarYear, calendarMonth, day).toISOString().split('T')[0]
    return dateKey === formData.date
  }
  
  const isDatePast = (day: number | null) => {
    if (day === null) return false
    const date = new Date(calendarYear, calendarMonth, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }
  
  const isToday = (day: number | null) => {
    if (day === null) return false
    const dateKey = new Date(calendarYear, calendarMonth, day).toISOString().split('T')[0]
    return dateKey === today
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Consultation Request Submitted!</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Your free consultation request has been received. We'll contact you soon to confirm the details.
              </p>
              <button
                onClick={() => router.push(`/services/${slug}`)}
                className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-colors text-sm sm:text-base"
              >
                Back to Service
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-[var(--color-primary)] whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/all-services" className="hover:text-[var(--color-primary)] whitespace-nowrap">All Services</Link>
            <span>/</span>
            <Link href={`/services/${slug}`} className="hover:text-[var(--color-primary)] whitespace-nowrap truncate max-w-[120px] sm:max-w-none">Service Details</Link>
            <span>/</span>
            <span className="text-gray-900 whitespace-nowrap">Free Consultation</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link
            href={`/services/${slug}`}
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Service Details</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Book a Free Consultation</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Fill in the details below to schedule your free consultation. Our team will contact you to confirm.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Field */}
              <div className="relative" ref={datePickerRef}>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Preferred Date</span>
                  </div>
                </label>
                <div
                  onClick={() => {
                    if (!showDatePicker && formData.date) {
                      const selectedDate = new Date(formData.date)
                      setCalendarMonth(selectedDate.getMonth())
                      setCalendarYear(selectedDate.getFullYear())
                    }
                    setShowDatePicker(!showDatePicker)
                  }}
                  className={`relative cursor-pointer px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white hover:border-gray-400 transition-colors flex items-center justify-between ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base truncate">
                      {formData.date
                        ? new Date(formData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : 'Select date'}
                    </span>
                  </div>
                </div>
                
                {/* Calendar Date Picker Popup */}
                {showDatePicker && (
                  <div 
                    className="absolute top-full left-0 right-0 sm:right-auto mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-4 sm:p-6 w-full sm:w-[350px] max-w-[350px] mx-auto sm:mx-0" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <button
                        onClick={() => {
                          const newDate = new Date(calendarYear, calendarMonth - 1, 1)
                          setCalendarMonth(newDate.getMonth())
                          setCalendarYear(newDate.getFullYear())
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </button>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center px-2">
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
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
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
                      {getDaysInMonth().map((day, idx) => {
                        if (day === null) {
                          return <div key={idx} className="h-8 sm:h-10" />
                        }

                        const selected = isDateSelected(day)
                        const past = isDatePast(day)
                        const todayDate = isToday(day)

                        return (
                          <button
                            key={idx}
                            onClick={() => !past && handleDateSelect(day)}
                            disabled={past}
                            className={`
                              relative z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full text-xs sm:text-sm font-medium transition-colors
                              ${selected
                                ? 'bg-[var(--color-primary)] text-white'
                                : past
                                ? 'text-gray-300 cursor-not-allowed'
                                : todayDate
                                ? 'text-[var(--color-primary)] font-semibold hover:bg-gray-50'
                                : 'text-gray-900 hover:bg-gray-50'
                              }
                            `}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, date: '' }))
                          setShowDatePicker(false)
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 text-xs sm:text-sm font-medium"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Time Field */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Preferred Time</span>
                  </div>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Description / Requirements</span>
                  </div>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Please describe your requirements, any specific issues you're facing, or questions you'd like to discuss during the consultation..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 10 characters. Provide as much detail as possible to help us prepare for your consultation.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors text-sm sm:text-base"
                >
                  Submit
                </button>
                <Link
                  href={`/services/${slug}`}
                  className="w-full sm:flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center text-sm sm:text-base"
                >
                  Cancel
                </Link>
              </div>
            </form>

            {/* Info Box */}
            <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-700">
                  <p className="font-medium text-gray-900 mb-1">What happens next?</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Our team will review your request within 24 hours</li>
                    <li>We'll contact you via phone or email to confirm the consultation</li>
                    <li>You can discuss your requirements in detail during the consultation</li>
                    <li>No obligation - the consultation is completely free</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

