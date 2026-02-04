'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, ChevronDown, ChevronUp, CheckCircle, Info, MessageCircle, BookOpen, Reply, PlayCircle, Filter, ArrowUpDown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

interface ServiceData {
  name: string
  category: string
  rating: number
  reviewCount: number
  image: string
  description: string
  detailedDescription?: string
  features: string[]
  faqs: { question: string; answer: string }[]
  packages: {
    name: string
    price: number
    originalPrice?: number
    features: string[]
    popular?: boolean
  }[]
  processFlow?: string
  videoUrl?: string
  requiredDocuments?: string[]
  whatsNotIncluded?: string
  timeline?: string
  additionalNotes?: string
  providerAuthority?: string
  infoSource?: string
  whyChooseConsultants?: { title: string; description: string }[]
  howWeSelectConsultants?: { title: string; description: string }[]
}

const DEFAULT_WHY_CHOOSE: { title: string; description: string }[] = [
  { title: 'Verified & Certified', description: 'All our consultants undergo thorough background checks and hold relevant certifications for their expertise.' },
  { title: 'Experienced Professionals', description: 'Our consultants have years of hands-on experience and are trained in the latest industry practices.' },
  { title: 'Customer-Focused', description: 'We prioritize your satisfaction and ensure our consultants provide excellent customer service.' },
  { title: 'Reliable & Punctual', description: 'Our consultants arrive on time and complete work efficiently without compromising on quality.' }
]

const DEFAULT_HOW_SELECT: { title: string; description: string }[] = [
  { title: 'Application & Screening', description: 'We review applications and verify qualifications, certifications, and work history.' },
  { title: 'Skills Assessment', description: 'Candidates undergo practical tests and interviews to assess their technical skills and knowledge.' },
  { title: 'Training & Certification', description: 'Selected consultants complete our comprehensive training program and certification process.' },
  { title: 'Ongoing Monitoring', description: 'We continuously monitor performance and customer feedback to maintain our high standards.' }
]

export default function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedPackage, setSelectedPackage] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedThread, setExpandedThread] = useState<number | null>(null)
  const [faqQuery, setFaqQuery] = useState('')
  const [comment, setComment] = useState('')
  const [providerFilterStar, setProviderFilterStar] = useState<number | null>(null)
  const [providerSortBy, setProviderSortBy] = useState<'rating' | 'date'>('rating')
  const [serviceFilterStar, setServiceFilterStar] = useState<number | null>(null)
  const [serviceSortBy, setServiceSortBy] = useState<'rating' | 'date'>('rating')
  const [isInfoSourceExpanded, setIsInfoSourceExpanded] = useState(false)
  const [isMobilePackageExpanded, setIsMobilePackageExpanded] = useState(false)
  const [service, setService] = useState<ServiceData | null>(null)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  interface ReviewData {
    id: string
    reviewerName: string
    rating: number
    comment?: string
    createdAt: string
  }

  const [serviceReviews, setServiceReviews] = useState<ReviewData[]>([])
  const [consultantReviews, setConsultantReviews] = useState<ReviewData[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const router = useRouter()
  
  const { slug } = use(params)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/services/slug/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Service not found')
          } else {
            setError('Failed to load service')
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        
        if (!data.success || !data.service) {
          setError('Service not found')
          setLoading(false)
          return
        }

        const apiService = data.service

        // Store service ID for cart
        setServiceId(apiService.id || null)

        // Transform API response to match component's expected format
        const transformedService: ServiceData = {
          name: apiService.title,
          category: apiService.categoryTitle || 'Services',
          rating: parseFloat(apiService.rating) || 0,
          reviewCount: apiService.reviewCount || 0,
          image: apiService.image || '/placeholder.svg',
          description: apiService.description || apiService.shortDescription || '',
          detailedDescription: apiService.detailedDescription || undefined,
          features: apiService.whatsIncluded 
            ? apiService.whatsIncluded.split('\n').filter((f: string) => f.trim())
            : [],
          faqs: Array.isArray(apiService.faqs) 
            ? apiService.faqs.map((faq: { question?: string; answer?: string }) => ({
                question: faq.question || '',
                answer: faq.answer || ''
              }))
            : [],
          packages: Array.isArray(apiService.packages)
            ? apiService.packages.map((pkg: { name?: string; price?: string | number; originalPrice?: string | number; features?: string[]; popular?: boolean }) => {
                // Helper function to parse price values
                const parsePrice = (value: string | number | null | undefined): number => {
                  if (value === null || value === undefined) return 0
                  if (typeof value === 'number') {
                    return isNaN(value) ? 0 : value
                  }
                  if (typeof value === 'string') {
                    const trimmed = value.trim()
                    if (trimmed === '') return 0
                    const cleaned = trimmed.replace(/[^\d.]/g, '')
                    if (cleaned === '') return 0
                    const parsed = parseFloat(cleaned)
                    return isNaN(parsed) ? 0 : parsed
                  }
                  return 0
                }

                // Helper function to parse originalPrice (returns undefined if invalid)
                const parseOriginalPrice = (value: string | number | null | undefined): number | undefined => {
                  if (value === null || value === undefined) return undefined
                  if (typeof value === 'number') {
                    return isNaN(value) ? undefined : value
                  }
                  if (typeof value === 'string') {
                    const trimmed = value.trim()
                    if (trimmed === '') return undefined
                    const cleaned = trimmed.replace(/[^\d.]/g, '')
                    if (cleaned === '') return undefined
                    const parsed = parseFloat(cleaned)
                    return isNaN(parsed) ? undefined : parsed
                  }
                  return undefined
                }

                return {
                  name: pkg.name || '',
                  price: parsePrice(pkg.price),
                  originalPrice: parseOriginalPrice(pkg.originalPrice),
                  features: Array.isArray(pkg.features) ? pkg.features : [],
                  popular: pkg.popular || false
                }
              })
            : [],
          processFlow: apiService.processFlow || undefined,
          videoUrl: apiService.videoUrl || undefined,
          requiredDocuments: Array.isArray(apiService.requiredDocuments) 
            ? apiService.requiredDocuments 
            : [],
          whatsNotIncluded: apiService.whatsNotIncluded || undefined,
          timeline: apiService.timeline || undefined,
          additionalNotes: apiService.additionalNotes || undefined,
          providerAuthority: apiService.providerAuthority || undefined,
          infoSource: apiService.infoSource || undefined,
          whyChooseConsultants: Array.isArray(apiService.whyChooseConsultants) ? apiService.whyChooseConsultants : [],
          howWeSelectConsultants: Array.isArray(apiService.howWeSelectConsultants) ? apiService.howWeSelectConsultants : []
        }

        setService(transformedService)
        // Reset selectedPackage to 0 if it's out of bounds
        if (transformedService.packages.length > 0) {
          setSelectedPackage(0)
        }

        // Fetch reviews if service ID is available
        if (apiService.id) {
          fetchReviews(apiService.id)
        }
      } catch (err) {
        console.error('Error fetching service:', err)
        setError('Failed to load service')
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [slug])

  // Function to fetch reviews for the service
  const fetchReviews = async (id: string) => {
    try {
      setReviewsLoading(true)
      
      // Fetch service reviews
      const serviceReviewsResponse = await fetch(`/api/reviews/service/${id}?reviewType=service`)
      if (serviceReviewsResponse.ok) {
        const serviceReviewsData = await serviceReviewsResponse.json()
        if (serviceReviewsData.success) {
          setServiceReviews(serviceReviewsData.reviews || [])
        }
      }

      // Fetch consultant reviews
      const consultantReviewsResponse = await fetch(`/api/reviews/service/${id}?reviewType=consultant`)
      if (consultantReviewsResponse.ok) {
        const consultantReviewsData = await consultantReviewsResponse.json()
        if (consultantReviewsData.success) {
          setConsultantReviews(consultantReviewsData.reviews || [])
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setReviewsLoading(false)
    }
  }

  // Helper function to format time ago
  const getTimeAgo = (date: Date): string => {
    const now = Date.now()
    const diff = now - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)

    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  // Helper function to get avatar initial
  const getAvatarInitial = (name: string): string => {
    return name.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading service...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
              <p className="text-gray-600 mb-4">{error || 'The service you are looking for does not exist.'}</p>
              <Link href="/all-services" className="text-[var(--color-primary)] hover:underline">
                Browse All Services
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const normalizedFaqQuery = faqQuery.trim().toLowerCase()
  const filteredFaqs = normalizedFaqQuery
    ? service.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(normalizedFaqQuery) ||
          faq.answer.toLowerCase().includes(normalizedFaqQuery)
      )
    : service.faqs

  // Function to handle adding item to cart
  const handleAddToCart = () => {
    if (!service || service.packages.length === 0 || !service.packages[selectedPackage]) {
      return
    }

    const selectedPkg = service.packages[selectedPackage]
    
    // Get existing cart items from localStorage
    const cartKey = 'snaplegal_cart'
    interface CartItem {
      id: string
      serviceId?: string | null
      serviceSlug?: string
      serviceName: string
      packageName?: string
      image: string
      price: number
      originalPrice: number
      quantity: number
      tonnage?: string
      date?: string
      timeSlot?: string
      selected?: boolean
    }
    let existingCart: CartItem[] = []
    
    try {
      const storedCart = localStorage.getItem(cartKey)
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        if (Array.isArray(parsed)) {
          existingCart = parsed
        }
      }
    } catch (error) {
      console.error('Error reading cart from localStorage:', error)
      existingCart = []
    }

    // Create new cart item
    const newCartItem = {
      id: `${serviceId || slug}-${selectedPackage}-${Date.now()}`,
      serviceId: serviceId || null,
      serviceSlug: slug,
      serviceName: service.name,
      packageName: selectedPkg.name,
      image: service.image || '/placeholder.svg',
      price: selectedPkg.price,
      originalPrice: selectedPkg.originalPrice || selectedPkg.price,
      quantity: 1,
      tonnage: '1-2.5 Ton', // Default, can be changed later
      date: '', // Will be set later
      timeSlot: '', // Will be set later
      selected: true,
    }

    // Add new item to cart
    existingCart.push(newCartItem)

    // Save to localStorage
    try {
      localStorage.setItem(cartKey, JSON.stringify(existingCart))
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('snaplegal_cart_updated'))
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }

    // Navigate to cart
    router.push('/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 sm:py-3">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
            <Link href="/" className="hover:text-[var(--color-primary)] whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/all-services" className="hover:text-[var(--color-primary)] whitespace-nowrap">All Services</Link>
            <span>/</span>
            <Link href="/all-services" className="hover:text-[var(--color-primary)] whitespace-nowrap">{service.category}</Link>
            <span>/</span>
            <span className="text-gray-900 whitespace-nowrap">{service.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8 pb-32 sm:pb-20 lg:pb-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Service Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="relative w-full sm:w-64 h-48 sm:h-48 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-2">{service.category}</div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-3">{service.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{service.rating}</span>
                      <span className="text-gray-600 text-sm">({service.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{service.description}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b">
                <div className="flex flex-wrap gap-2 sm:gap-4 lg:gap-6 px-4 sm:px-6">
                  {['Overview', 'Learning and Discussion', 'FAQ', 'Consultants', 'Reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, '-'))}
                      className={`py-3 sm:py-4 px-2 sm:px-1 font-medium transition-colors border-b-2 whitespace-nowrap ${
                        activeTab === tab.toLowerCase().replace(/\s+/g, '-')
                          ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                          : 'text-gray-600 border-transparent hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Service Description</h3>
                      {(() => {
                        const content = service.detailedDescription || service.description || ''
                        const isHtml = /<[a-z][\s\S]*>/i.test(content)
                        if (isHtml) {
                          return (
                            <div
                              className="service-description-html text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: content }}
                            />
                          )
                        }
                        return <p className="text-gray-700 leading-relaxed">{content}</p>
                      })()}
                    </div>

                    {/* Required Documents */}
                    {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Required Documents</h3>
                        <div className="space-y-2">
                          {service.requiredDocuments.map((doc, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="text-gray-700">•</span>
                              <span className="text-gray-700">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">What&apos;s Included</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What's Not Included */}
                    {service.whatsNotIncluded && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">What&apos;s Not Included</h3>
                        <div className="space-y-2">
                          {service.whatsNotIncluded.split('\n').filter((item: string) => item.trim()).map((item: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="text-red-500 font-bold">×</span>
                              <span className="text-gray-700">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Service Authority */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Service Authority</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {service.providerAuthority && service.providerAuthority.trim()
                          ? service.providerAuthority
                          : `Our service providers are licensed professionals with the necessary certifications and authority to perform ${service.name.toLowerCase()} services. All consultants undergo thorough background checks and hold valid licenses from relevant regulatory bodies.`}
                      </p>
                    </div>

                    {/* Timeline */}
                    {service.timeline && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Timeline</h3>
                        <div className="bg-gradient-to-br from-[var(--color-neutral)] to-white rounded-lg p-6 border border-gray-200">
                          <div className="space-y-2">
                            {service.timeline.split('\n').filter((line) => line.trim()).map((line, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <span className="text-gray-700">•</span>
                                <span className="text-gray-700">{line.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {service.additionalNotes && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Notes</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                            {service.additionalNotes.split('\n').filter((note: string) => note.trim()).map((note: string, index: number) => (
                              <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
                                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>{note.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Info Source */}
                    <div className="border-t pt-6">
                      <div className="border rounded-lg">
                        <button
                          onClick={() => setIsInfoSourceExpanded(!isInfoSourceExpanded)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                        >
                          <h3 className="text-lg font-bold text-gray-900">Info Source</h3>
                          {isInfoSourceExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isInfoSourceExpanded && (
                          <div className="px-4 pb-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              {service.infoSource && service.infoSource.trim() ? (
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                  {service.infoSource}
                                </p>
                              ) : (
                                <>
                                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                    The information provided on this page is based on industry standards, regulatory guidelines, and our service provider network. Details may vary based on specific service requirements, location, and individual circumstances. For the most accurate and up-to-date information, please contact our customer service team or consult with a service provider directly.
                                  </p>
                                  <p className="text-xs text-gray-500 mt-3">
                                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-3">
                    <div className="mb-2">
                      <input
                        value={faqQuery}
                        onChange={(e) => setFaqQuery(e.target.value)}
                        placeholder="Search FAQs"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                    {filteredFaqs.length === 0 ? (
                      <p className="text-sm text-gray-500">No FAQs match your search.</p>
                    ) : (
                      filteredFaqs.map((faq, index) => (
                      <div key={index} className="border rounded-lg">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                        >
                          <span className="font-medium">{faq.question}</span>
                          {expandedFaq === index ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === index && (
                          <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                      ))
                    )}
                  </div>
                )}

                {/* Review Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Overall Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{service.rating}</span>
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        Based on {service.reviewCount} reviews
                      </div>
                    </div>

                    {/* About Service Reviews */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">About Service Reviews</h3>
                      </div>
                      
                      {/* Filter and Sort Controls */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-gray-600" />
                          <label className="text-sm font-medium text-gray-700">Filter by:</label>
                          <select
                            value={serviceFilterStar || ''}
                            onChange={(e) => setServiceFilterStar(e.target.value ? Number(e.target.value) : null)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          >
                            <option value="">All Stars</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4 text-gray-600" />
                          <label className="text-sm font-medium text-gray-700">Sort by:</label>
                          <select
                            value={serviceSortBy}
                            onChange={(e) => setServiceSortBy(e.target.value as 'rating' | 'date')}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          >
                            <option value="rating">Rating</option>
                            <option value="date">Date</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {reviewsLoading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-2"></div>
                            <p className="text-gray-600 text-sm">Loading reviews...</p>
                          </div>
                        ) : (() => {
                          // Transform API reviews to match display format
                          const transformedReviews = serviceReviews.map((review) => ({
                            id: review.id,
                            name: review.reviewerName,
                            avatar: getAvatarInitial(review.reviewerName),
                            rating: review.rating,
                            review: review.comment || '',
                            time: getTimeAgo(new Date(review.createdAt)),
                            date: new Date(review.createdAt),
                          }))

                          // Filter by star rating
                          let filtered = serviceFilterStar 
                            ? transformedReviews.filter(r => r.rating === serviceFilterStar)
                            : transformedReviews

                          // Sort
                          filtered = [...filtered].sort((a, b) => {
                            if (serviceSortBy === 'rating') {
                              return b.rating - a.rating
                            } else {
                              return b.date.getTime() - a.date.getTime()
                            }
                          })

                          if (filtered.length === 0) {
                            return (
                              <div className="text-center py-8 text-gray-500">
                                <p>No reviews found{serviceFilterStar ? ` with ${serviceFilterStar} stars` : ''}.</p>
                              </div>
                            )
                          }

                          return filtered.map((review) => (
                            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                                  {review.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold text-gray-900">{review.name}</p>
                                    <span className="text-sm text-gray-500">{review.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  {review.review && (
                                    <p className="text-gray-700 leading-relaxed">{review.review}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* About Consultants Tab */}
                {activeTab === 'consultants' && (
                  <div className="space-y-8">
                    {/* Why Choose Our Consultants */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Our Consultants?</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {(service.whyChooseConsultants?.length ? service.whyChooseConsultants : DEFAULT_WHY_CHOOSE).map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Consultant Selection Process */}
                    <div className="border-t pt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">How We Select Our Consultants</h3>
                      <div className="bg-gradient-to-br from-[var(--color-neutral)] to-white rounded-lg p-6 border border-gray-200">
                        <div className="space-y-4">
                          {(service.howWeSelectConsultants?.length ? service.howWeSelectConsultants : DEFAULT_HOW_SELECT).map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                                <p className="text-sm text-gray-700">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Consultant Reviews */}
                    <div className="border-t pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Consultant Reviews</h3>
                      </div>
                      
                      {/* Filter and Sort Controls */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-gray-600" />
                          <label className="text-sm font-medium text-gray-700">Filter by:</label>
                          <select
                            value={providerFilterStar || ''}
                            onChange={(e) => setProviderFilterStar(e.target.value ? Number(e.target.value) : null)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          >
                            <option value="">All Stars</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4 text-gray-600" />
                          <label className="text-sm font-medium text-gray-700">Sort by:</label>
                          <select
                            value={providerSortBy}
                            onChange={(e) => setProviderSortBy(e.target.value as 'rating' | 'date')}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          >
                            <option value="rating">Rating</option>
                            <option value="date">Date</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {reviewsLoading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-2"></div>
                            <p className="text-gray-600 text-sm">Loading reviews...</p>
                          </div>
                        ) : (() => {
                          // Transform API reviews to match display format
                          // Note: Consultant reviews don't have providerName in the current schema
                          // We'll use a placeholder or extract from comment if needed
                          const transformedReviews = consultantReviews.map((review) => ({
                            id: review.id,
                            name: review.reviewerName,
                            avatar: getAvatarInitial(review.reviewerName),
                            providerName: 'Service Provider', // Placeholder - can be enhanced later
                            rating: review.rating,
                            review: review.comment || '',
                            time: getTimeAgo(new Date(review.createdAt)),
                            date: new Date(review.createdAt),
                          }))

                          // Filter by star rating
                          let filtered = providerFilterStar 
                            ? transformedReviews.filter(r => r.rating === providerFilterStar)
                            : transformedReviews

                          // Sort
                          filtered = [...filtered].sort((a, b) => {
                            if (providerSortBy === 'rating') {
                              return b.rating - a.rating
                            } else {
                              return b.date.getTime() - a.date.getTime()
                            }
                          })

                          if (filtered.length === 0) {
                            return (
                              <div className="text-center py-8 text-gray-500">
                                <p>No consultant reviews found{providerFilterStar ? ` with ${providerFilterStar} stars` : ''}.</p>
                              </div>
                            )
                          }

                          return filtered.map((review) => (
                            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                                  {review.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <p className="font-semibold text-gray-900">{review.name}</p>
                                      <span className="text-sm text-gray-500">{review.time}</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full px-4 py-1.5">
                                        <p className="text-sm font-bold text-gray-900">{review.providerName}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  {review.review && (
                                    <p className="text-gray-700 leading-relaxed">{review.review}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Learning and Discussion Tab */}
                {activeTab === 'learning-and-discussion' && (
                  <div className="space-y-8">
                    {/* Step-by-Step Tutorial Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
                        <h3 className="text-xl font-bold text-gray-900">How {service.name} Works</h3>
                      </div>
                      <div className="bg-gradient-to-br from-[var(--color-neutral)] to-white rounded-lg p-6 border border-gray-200">
                        {service.processFlow ? (
                          <div className="space-y-6">
                            {(() => {
                              // Try to parse processFlow as JSON array
                              try {
                                const parsed = JSON.parse(service.processFlow)
                                if (Array.isArray(parsed)) {
                                  return parsed.map((step: { title?: string; name?: string; description?: string; content?: string } | string, index: number) => {
                                    const stepObj = typeof step === 'string' ? { content: step } : step
                                    return (
                                      <div key={index} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                          {index + 1}
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-gray-900 mb-2">
                                            {stepObj.title || stepObj.name || `Step ${index + 1}`}
                                          </h4>
                                          <p className="text-gray-700 leading-relaxed">
                                            {stepObj.description || stepObj.content || (typeof step === 'string' ? step : '')}
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              } catch {
                                // Not JSON, treat as plain text
                              }
                              
                              // Parse as plain text with newlines or display as-is
                              const lines = service.processFlow.split('\n').filter((line: string) => line.trim())
                              if (lines.length > 1) {
                                return lines.map((line: string, index: number) => (
                                  <div key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-gray-700 leading-relaxed">{line.trim()}</p>
                                    </div>
                                  </div>
                                ))
                              }
                              
                              // Single block of text
                              return (
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                  {service.processFlow}
                                </div>
                              )
                            })()}
                          </div>
                        ) : (
                          // Fallback to hardcoded content
                          <div className="space-y-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                1
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Initial Assessment</h4>
                                <p className="text-gray-700 leading-relaxed">
                                  Our professional technician arrives at your location and conducts a thorough assessment of your {service.name.toLowerCase()} needs. They will inspect the current condition, identify any issues, and discuss your requirements.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                2
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Service Execution</h4>
                                <p className="text-gray-700 leading-relaxed">
                                  Using professional-grade tools and equipment, our expert performs the service with attention to detail. They follow industry best practices and safety protocols to ensure quality results.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                3
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Quality Check</h4>
                                <p className="text-gray-700 leading-relaxed">
                                  After completing the service, the technician performs a final quality check to ensure everything meets our high standards. They test all components and verify that the work is completed satisfactorily.
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                4
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Final Handover</h4>
                                <p className="text-gray-700 leading-relaxed">
                                  The technician provides you with a detailed summary of the work completed, offers maintenance tips, and addresses any questions you may have. Payment is processed after you confirm satisfaction with the service.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video Section */}
                    <div className="border-t pt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <PlayCircle className="w-6 h-6 text-[var(--color-primary)]" />
                        <h3 className="text-xl font-bold text-gray-900">Video Tutorial</h3>
                      </div>
                      {service.videoUrl ? (
                        <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video relative">
                          {(() => {
                            // Check if it's a YouTube URL
                            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
                            const youtubeMatch = service.videoUrl.match(youtubeRegex)
                            
                            // Check if it's a Vimeo URL
                            const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
                            const vimeoMatch = service.videoUrl.match(vimeoRegex)
                            
                            if (youtubeMatch) {
                              const videoId = youtubeMatch[1]
                              return (
                                <iframe
                                  className="w-full h-full"
                                  src={`https://www.youtube.com/embed/${videoId}`}
                                  title={`${service.name} Video Tutorial`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              )
                            } else if (vimeoMatch) {
                              const videoId = vimeoMatch[1]
                              return (
                                <iframe
                                  className="w-full h-full"
                                  src={`https://player.vimeo.com/video/${videoId}`}
                                  title={`${service.name} Video Tutorial`}
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowFullScreen
                                />
                              )
                            } else {
                              // Direct video URL or other format
                              return (
                                <video
                                  className="w-full h-full object-cover"
                                  controls
                                  src={service.videoUrl}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              )
                            }
                          })()}
                        </div>
                      ) : (
                        <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all group">
                              <PlayCircle className="w-12 h-12 text-[var(--color-primary)] ml-1 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                            <h4 className="text-white font-semibold text-lg mb-1">Watch: {service.name} Service Process</h4>
                            <p className="text-white/80 text-sm">Learn how our professionals deliver {service.name.toLowerCase()} with step-by-step visual guidance</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Community Discussion Section */}
                    <div className="border-t pt-8">
                      <div className="flex items-center gap-2 mb-6">
                        <MessageCircle className="w-6 h-6 text-[var(--color-primary)]" />
                        <h3 className="text-xl font-bold text-gray-900">Community Discussion</h3>
                      </div>

                      {/* Discussion Threads */}
                      <div className="space-y-4">
                        {/* Sample Discussion Threads */}
                        {[
                          {
                            id: 1,
                            topic: 'tips',
                            author: 'Rashid Ahmed',
                            avatar: 'R',
                            question: 'What are the best practices for maintaining my AC after servicing?',
                            replies: [
                              { author: 'Fatima Khan', avatar: 'F', reply: 'I recommend cleaning the filters monthly and scheduling regular check-ups every 3-4 months. Also, keep the outdoor unit clear of debris.', time: '2 hours ago' },
                              { author: 'Hasan Ali', avatar: 'H', reply: 'Make sure to change the air filter regularly and keep the area around the AC unit clean. This helps maintain efficiency.', time: '5 hours ago' }
                            ],
                            time: '1 day ago',
                            replyCount: 2
                          },
                          {
                            id: 2,
                            topic: 'troubleshooting',
                            author: 'Sadia Rahman',
                            avatar: 'S',
                            question: 'My AC is not cooling properly even after servicing. What could be the issue?',
                            replies: [
                              { author: 'Tech Expert', avatar: 'T', reply: 'This could be due to low refrigerant levels, dirty coils, or a faulty compressor. I recommend calling a professional for diagnosis.', time: '3 hours ago' }
                            ],
                            time: '2 days ago',
                            replyCount: 1
                          },
                          {
                            id: 3,
                            topic: 'maintenance',
                            author: 'Karim Uddin',
                            avatar: 'K',
                            question: 'How often should I get professional AC servicing?',
                            replies: [
                              { author: 'Service Pro', avatar: 'P', reply: 'For optimal performance, professional servicing every 3-4 months is recommended, especially before and after peak seasons.', time: '1 day ago' },
                              { author: 'Ahmed Hassan', avatar: 'A', reply: 'I do it quarterly and it keeps my AC running smoothly year-round.', time: '6 hours ago' }
                            ],
                            time: '3 days ago',
                            replyCount: 2
                          },
                          {
                            id: 4,
                            topic: 'cost',
                            author: 'Nadia Islam',
                            avatar: 'N',
                            question: 'What factors affect the cost of AC servicing?',
                            replies: [
                              { author: 'Cost Advisor', avatar: 'C', reply: 'Factors include AC unit size, condition, required repairs, location, and service package chosen. Premium packages offer more comprehensive service.', time: '4 hours ago' }
                            ],
                            time: '4 days ago',
                            replyCount: 1
                          }
                        ]
                          .map((thread) => (
                            <div key={thread.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                                  {thread.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-gray-900">{thread.author}</span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">{thread.time}</span>
                                  </div>
                                  <p className="text-gray-900 font-medium mb-3">{thread.question}</p>
                                  
                                  {/* Replies */}
                                  {thread.replies.length > 0 && (
                                    <div className="ml-4 border-l-2 border-gray-200 pl-4 space-y-3">
                                      {expandedThread === thread.id ? (
                                        <>
                                          {thread.replies.map((reply, replyIndex) => (
                                            <div key={replyIndex} className="flex items-start gap-3">
                                              <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                                {reply.avatar}
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                                                  <span className="text-xs text-gray-500">{reply.time}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">{reply.reply}</p>
                                              </div>
                                            </div>
                                          ))}
                                          <button
                                            onClick={() => setExpandedThread(null)}
                                            className="text-sm text-[var(--color-primary)] hover:underline font-medium"
                                          >
                                            Show less
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          onClick={() => setExpandedThread(thread.id)}
                                          className="text-sm text-[var(--color-primary)] hover:underline font-medium"
                                        >
                                          View {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  {/* Reply Button */}
                                  <button className="mt-3 flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 font-medium">
                                    <Reply className="w-4 h-4" />
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Comment Box Section */}
                      <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-4">Join the Discussion</h4>
                        <div className="space-y-4">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts, ask questions, or provide helpful insights..."
                            className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                          />
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">Be respectful and helpful in your comments</p>
                            <button 
                              onClick={() => {
                                if (comment.trim()) {
                                  // Handle comment submission here
                                  setComment('')
                                }
                              }}
                              className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all shadow-sm"
                            >
                              Post Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
              {/* Scrollable Package Selection */}
              <div className="p-4 overflow-y-auto flex-1">
                <h3 className="text-base font-bold mb-3">Choose Your Package</h3>
                
                <div className="space-y-2 mb-4">
                  {service.packages.map((pkg, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedPackage(index)}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        selectedPackage === index
                          ? 'border-[var(--color-primary)] bg-[var(--color-neutral)]'
                          : 'border-gray-200 hover:border-[var(--color-primary)]/50'
                      } ${pkg.popular ? 'relative' : ''}`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2 left-3 bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          POPULAR
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{pkg.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-[var(--color-primary)]">৳{pkg.price}</span>
                            {pkg.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">৳{pkg.originalPrice}</span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
                            selectedPackage === index
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedPackage === index && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                      <ul className="space-y-0.5 text-xs text-gray-600 mt-2">
                        {pkg.features.slice(0, 3).map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                        {pkg.features.length > 3 && (
                          <li className="text-xs text-gray-500 pl-4">+{pkg.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Book Now Button Section */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {service.packages.length > 0 && service.packages[selectedPackage] && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Selected Package</p>
                    <p className="font-semibold text-sm text-gray-900">{service.packages[selectedPackage].name}</p>
                    <p className="text-xl font-bold text-[var(--color-primary)] mt-1">
                      ৳{service.packages[selectedPackage].price}
                      {service.packages[selectedPackage].originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ৳{service.packages[selectedPackage].originalPrice}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold hover:opacity-90 transition-colors shadow-md mb-2"
                >
                  Book Now
                </button>
                <button 
                  onClick={() => router.push(`/services/${slug}/consultation`)}
                  className="w-full bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-3 rounded-lg font-bold hover:bg-[var(--color-neutral)] transition-colors mb-2"
                >
                  Book a free consultation
                </button>
                <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
                  <Info className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-tight">Professional arrives at your doorstep. Payment after service completion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Booking Widget - Airbnb Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 lg:hidden">
        {/* Package Selection Toggle */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setIsMobilePackageExpanded(!isMobilePackageExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <p className="text-xs text-gray-600 mb-0.5">Selected Package</p>
              {service.packages.length > 0 && service.packages[selectedPackage] ? (
                <>
                  <p className="text-sm font-semibold text-gray-900">{service.packages[selectedPackage].name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-bold text-[var(--color-primary)]">
                      ৳{service.packages[selectedPackage].price}
                    </p>
                    {service.packages[selectedPackage].originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ৳{service.packages[selectedPackage].originalPrice}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No packages available</p>
              )}
            </div>
            {isMobilePackageExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Expandable Package Selection */}
        {isMobilePackageExpanded && (
          <div className="max-h-[60vh] overflow-y-auto border-b border-gray-200 bg-gray-50">
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Choose Your Package</h3>
              {service.packages.map((pkg, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedPackage(index)
                    setIsMobilePackageExpanded(false)
                  }}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all bg-white ${
                    selectedPackage === index
                      ? 'border-[var(--color-primary)] bg-[var(--color-neutral)]'
                      : 'border-gray-200 hover:border-[var(--color-primary)]/50'
                  } ${pkg.popular ? 'relative' : ''}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-3 bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      POPULAR
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{pkg.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-base font-bold text-[var(--color-primary)]">৳{pkg.price}</span>
                        {pkg.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">৳{pkg.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
                        selectedPackage === index
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedPackage === index && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  <ul className="space-y-0.5 text-xs text-gray-600 mt-2">
                    {pkg.features.slice(0, 3).map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-xs text-gray-500 pl-4">+{pkg.features.length - 3} more</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white py-3.5 rounded-lg font-bold hover:opacity-90 transition-all shadow-md"
          >
            Book Now
          </button>
          <button 
            onClick={() => router.push(`/services/${slug}/consultation`)}
            className="w-full bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-3 rounded-lg font-bold hover:bg-[var(--color-neutral)] transition-colors"
          >
            Book a free consultation
          </button>
          <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded-lg mt-2">
            <Info className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="leading-tight">Professional arrives at your doorstep. Payment after service completion.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
