'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, ChevronDown, ChevronUp, CheckCircle, Info, MessageCircle, BookOpen, Reply, PlayCircle, Filter, ArrowUpDown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const serviceData: Record<string, {
  name: string
  category: string
  rating: number
  reviewCount: number
  image: string
  description: string
  features: string[]
  faqs: { question: string; answer: string }[]
  packages: {
    name: string
    price: number
    originalPrice?: number
    features: string[]
    popular?: boolean
  }[]
}> = {
  'ac-servicing': {
    name: 'AC Servicing',
    category: 'AC Repair Services',
    rating: 4.8,
    reviewCount: 1250,
    image: '/cleaning_service.jpg',
    description: 'Professional AC servicing to keep your air conditioner running efficiently. Our expert technicians will clean, inspect, and optimize your AC unit for maximum performance.',
    features: [
      'Complete AC inspection',
      'Filter cleaning and replacement',
      'Coil cleaning (indoor & outdoor)',
      'Gas pressure check',
      'Thermostat calibration',
      'Performance testing',
      'Expert technicians',
      '90-day service warranty'
    ],
    faqs: [
      {
        question: 'How often should I service my AC?',
        answer: 'We recommend servicing your AC every 3-4 months, especially before and after the summer season for optimal performance.'
      },
      {
        question: 'How long does the servicing take?',
        answer: 'Regular AC servicing typically takes 45-60 minutes depending on the condition of your unit.'
      },
      {
        question: 'Do you provide spare parts?',
        answer: 'Yes, if any parts need replacement, our technician will inform you and provide genuine spare parts at transparent prices.'
      },
      {
        question: 'What brands do you service?',
        answer: 'We service all major AC brands including Daikin, LG, Samsung, General, Gree, and more.'
      }
    ],
    packages: [
      {
        name: 'Basic Servicing',
        price: 599,
        originalPrice: 799,
        features: [
          'Filter cleaning',
          'Basic inspection',
          'Gas pressure check',
          'Performance test'
        ]
      },
      {
        name: 'Standard Servicing',
        price: 899,
        originalPrice: 1199,
        popular: true,
        features: [
          'Complete filter cleaning',
          'Indoor coil cleaning',
          'Outdoor unit cleaning',
          'Gas pressure check',
          'Thermostat calibration',
          'Performance optimization',
          '30-day warranty'
        ]
      },
      {
        name: 'Premium Servicing',
        price: 1299,
        originalPrice: 1699,
        features: [
          'Deep filter cleaning',
          'Deep indoor coil cleaning',
          'Deep outdoor coil cleaning',
          'Complete gas check & refill',
          'Electrical component check',
          'Thermostat calibration',
          'Anti-bacterial treatment',
          '90-day warranty'
        ]
      }
    ]
  },
  'home-cleaning': {
    name: 'Home Cleaning',
    category: 'Cleaning Services',
    rating: 4.7,
    reviewCount: 2100,
    image: '/cleaning_service.jpg',
    description: 'Professional home cleaning services to keep your space spotless. Our trained cleaning professionals use eco-friendly products and modern equipment.',
    features: [
      'Living room cleaning',
      'Bedroom cleaning',
      'Kitchen cleaning',
      'Bathroom cleaning',
      'Floor mopping & vacuuming',
      'Dusting furniture',
      'Eco-friendly products',
      'Trained professionals'
    ],
    faqs: [
      {
        question: 'What areas do you clean?',
        answer: 'We clean all rooms including living rooms, bedrooms, kitchens, bathrooms, and common areas. You can customize the service based on your needs.'
      },
      {
        question: 'Do I need to provide cleaning supplies?',
        answer: 'No, our professionals bring all necessary cleaning supplies and equipment.'
      },
      {
        question: 'How long does cleaning take?',
        answer: 'It depends on the size of your home. Typically, a 2-bedroom apartment takes 2-3 hours.'
      }
    ],
    packages: [
      {
        name: 'Basic Cleaning',
        price: 799,
        features: [
          '1 Bedroom cleaning',
          '1 Bathroom cleaning',
          'Living area cleaning',
          'Dusting & sweeping'
        ]
      },
      {
        name: 'Standard Cleaning',
        price: 1299,
        popular: true,
        features: [
          '2 Bedroom cleaning',
          '2 Bathroom cleaning',
          'Kitchen cleaning',
          'Living area cleaning',
          'Mopping & vacuuming',
          'Dusting all surfaces'
        ]
      },
      {
        name: 'Deep Cleaning',
        price: 2499,
        features: [
          '3 Bedroom cleaning',
          '3 Bathroom cleaning',
          'Kitchen deep cleaning',
          'All room cleaning',
          'Window cleaning',
          'Balcony cleaning',
          'Cabinet cleaning'
        ]
      }
    ]
  }
}

export default function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedPackage, setSelectedPackage] = useState(1)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedThread, setExpandedThread] = useState<number | null>(null)
  const [faqQuery, setFaqQuery] = useState('')
  const [comment, setComment] = useState('')
  const [providerFilterStar, setProviderFilterStar] = useState<number | null>(null)
  const [providerSortBy, setProviderSortBy] = useState<'rating' | 'date'>('rating')
  const [serviceFilterStar, setServiceFilterStar] = useState<number | null>(null)
  const [serviceSortBy, setServiceSortBy] = useState<'rating' | 'date'>('rating')
  const [isInfoSourceExpanded, setIsInfoSourceExpanded] = useState(false)
  const router = useRouter()
  
  const { slug } = use(params)
  const service = serviceData[slug]
  console.log('serviceData', serviceData)
  console.log('service', service)

  // Get current timestamp (calculated once on mount)
  const [now] = useState(() => typeof window !== 'undefined' ? Date.now() : 0)

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Link href="/all-services" className="text-[var(--color-primary)] hover:underline">
            Browse All Services
          </Link>
        </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <span>/</span>
            <Link href="/all-services" className="hover:text-[var(--color-primary)]">All Services</Link>
            <span>/</span>
            <Link href="/all-services" className="hover:text-[var(--color-primary)]">{service.category}</Link>
            <span>/</span>
            <span className="text-gray-900">{service.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-20 lg:pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex gap-6">
                <div className="relative w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-2">{service.category}</div>
                  <h1 className="text-3xl font-bold mb-3">{service.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{service.rating}</span>
                      <span className="text-gray-600 text-sm">({service.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b">
                <div className="flex gap-6 px-6">
                  {['Overview', 'Learning and Discussion', 'FAQ', 'Consultants', 'Reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, '-'))}
                      className={`py-4 px-1 font-medium transition-colors border-b-2 ${
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
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Service Description</h3>
                      <p className="text-gray-700 leading-relaxed">{service.description}</p>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Required Documents</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-700">•</span>
                          <span className="text-gray-700">Valid identification proof (NID/Passport)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-700">•</span>
                          <span className="text-gray-700">Property ownership documents or rental agreement (if applicable)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-700">•</span>
                          <span className="text-gray-700">Previous service records (if available)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-700">•</span>
                          <span className="text-gray-700">Any relevant warranty or guarantee documents</span>
                        </div>
                      </div>
                    </div>

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
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">What&apos;s Not Included</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">×</span>
                          <span className="text-gray-700">Major repairs or replacements requiring specialized parts</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">×</span>
                          <span className="text-gray-700">Structural modifications or alterations</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">×</span>
                          <span className="text-gray-700">Cost of replacement parts or materials (quoted separately)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">×</span>
                          <span className="text-gray-700">Services outside the scope of the selected package</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">×</span>
                          <span className="text-gray-700">Emergency services outside regular business hours (additional charges apply)</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Authority */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Service Authority</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Our service providers are licensed professionals with the necessary certifications and authority to perform {service.name.toLowerCase()} services. All consultants undergo thorough background checks and hold valid licenses from relevant regulatory bodies.
                      </p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Timeline</h3>
                      <div className="bg-gradient-to-br from-[var(--color-neutral)] to-white rounded-lg p-6 border border-gray-200">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                              1
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Booking Confirmation</h4>
                              <p className="text-sm text-gray-700">Within 24 hours of booking</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                              2
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Service Scheduling</h4>
                              <p className="text-sm text-gray-700">Service scheduled within 2-3 business days</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                              3
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Service Completion</h4>
                              <p className="text-sm text-gray-700">Typically completed within 1-3 hours depending on package selected</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                              4
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Follow-up & Support</h4>
                              <p className="text-sm text-gray-700">Post-service support available for 7 days after completion</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Notes</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Please ensure the service area is accessible and clear before the technician arrives.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Our technicians will arrive with all necessary tools and equipment.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Payment is due after service completion and your satisfaction confirmation.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>For any special requirements or concerns, please mention them during booking.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>We offer a satisfaction guarantee - if you&apos;re not happy, we&apos;ll make it right.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

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
                              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                The information provided on this page is based on industry standards, regulatory guidelines, and our service provider network. Details may vary based on specific service requirements, location, and individual circumstances. For the most accurate and up-to-date information, please contact our customer service team or consult with a service provider directly.
                              </p>
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-900">
                                  Source{' '}
                                  <a
                                    href="https://www.example.com/service-information"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--color-primary)] hover:underline"
                                  >
                                    URL
                                  </a>
                                  :
                                </p>
                                <ul className="space-y-1.5 ml-4">
                                  <li className="flex items-start gap-2">
                                    <span className="text-gray-700">•</span>
                                    <a
                                      href="https://www.example.com/service-information"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-[var(--color-primary)] hover:underline"
                                    >
                                      Service Information Guide
                                    </a>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-gray-700">•</span>
                                    <a
                                      href="https://www.regulatory-authority.gov/service-guidelines"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-[var(--color-primary)] hover:underline"
                                    >
                                      Regulatory Service Guidelines
                                    </a>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-gray-700">•</span>
                                    <a
                                      href="https://www.industry-standards.org/best-practices"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-[var(--color-primary)] hover:underline"
                                    >
                                      Industry Best Practices
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <p className="text-xs text-gray-500 mt-3">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
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
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{service.rating}</span>
                      </div>
                      <div className="text-gray-600">
                        Based on {service.reviewCount} reviews
                      </div>
                    </div>

                    {/* About Service Reviews */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">About Service Reviews</h3>
                      </div>
                      
                      {/* Filter and Sort Controls */}
                      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                        {(() => {
                          const serviceReviews = [
                          {
                              name: 'Sara Khan',
                              avatar: 'S',
                            rating: 5,
                              review: 'Very satisfied with the quality of service. The team was clean, efficient, and respectful of my home. The service exceeded my expectations!',
                              time: '3 days ago',
                              date: new Date(now - 3 * 24 * 60 * 60 * 1000)
                            },
                            {
                              name: 'Hasan Ali',
                              avatar: 'H',
                              rating: 4,
                              review: 'Good service overall. The technician was professional and the work was done well. Would use this service again in the future.',
                              time: '1 week ago',
                              date: new Date(now - 7 * 24 * 60 * 60 * 1000)
                            },
                            {
                              name: 'Nadia Islam',
                              avatar: 'N',
                              rating: 5,
                              review: 'Amazing experience! The service was thorough and the technician was very helpful. Everything was explained clearly and the results were perfect.',
                              time: '2 weeks ago',
                              date: new Date(now - 14 * 24 * 60 * 60 * 1000)
                            },
                            {
                              name: 'Rashid Ahmed',
                              avatar: 'R',
                              rating: 4,
                              review: 'Professional service. The technician was knowledgeable and completed the work on time. Very pleased with the results.',
                              time: '4 days ago',
                              date: new Date(now - 4 * 24 * 60 * 60 * 1000)
                          },
                          {
                            name: 'Fatima Khan',
                            avatar: 'F',
                            rating: 5,
                              review: 'Excellent service! Everything was done perfectly and the technician was very courteous. Highly recommend!',
                              time: '1 day ago',
                              date: new Date(now - 1 * 24 * 60 * 60 * 1000)
                          },
                          {
                            name: 'Karim Uddin',
                            avatar: 'K',
                              rating: 3,
                              review: 'Service was decent but could have been better. The technician was okay but took longer than expected.',
                              time: '10 days ago',
                              date: new Date(now - 10 * 24 * 60 * 60 * 1000)
                            }
                          ]

                          // Filter by star rating
                          let filtered = serviceFilterStar 
                            ? serviceReviews.filter(r => r.rating === serviceFilterStar)
                            : serviceReviews

                          // Sort
                          filtered = [...filtered].sort((a, b) => {
                            if (serviceSortBy === 'rating') {
                              return b.rating - a.rating
                            } else {
                              return b.date.getTime() - a.date.getTime()
                            }
                          })

                          return filtered.map((review, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
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
                                <p className="text-gray-700 leading-relaxed">{review.review}</p>
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
                        {[
                          {
                            title: 'Verified & Certified',
                            description: 'All our consultants undergo thorough background checks and hold relevant certifications for their expertise.'
                          },
                          {
                            title: 'Experienced Professionals',
                            description: 'Our consultants have years of hands-on experience and are trained in the latest industry practices.'
                          },
                          {
                            title: 'Customer-Focused',
                            description: 'We prioritize your satisfaction and ensure our consultants provide excellent customer service.'
                          },
                          {
                            title: 'Reliable & Punctual',
                            description: 'Our consultants arrive on time and complete work efficiently without compromising on quality.'
                          }
                        ].map((feature, index) => (
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
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                              1
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Application & Screening</h4>
                              <p className="text-sm text-gray-700">We review applications and verify qualifications, certifications, and work history.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                              2
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Skills Assessment</h4>
                              <p className="text-sm text-gray-700">Candidates undergo practical tests and interviews to assess their technical skills and knowledge.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                              3
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Training & Certification</h4>
                              <p className="text-sm text-gray-700">Selected consultants complete our comprehensive training program and certification process.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
                              4
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Ongoing Monitoring</h4>
                              <p className="text-sm text-gray-700">We continuously monitor performance and customer feedback to maintain our high standards.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Consultant Reviews */}
                    <div className="border-t pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Consultant Reviews</h3>
                      </div>
                      
                      {/* Filter and Sort Controls */}
                      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                        {(() => {
                          const providerReviews = [
                            {
                              name: 'Ahmed Rahman',
                              avatar: 'A',
                              providerName: 'TechPro Services',
                            rating: 5,
                              review: 'Excellent service! The technician was professional, punctual, and very knowledgeable. He explained everything clearly and completed the work efficiently.',
                              time: '2 days ago',
                              date: new Date(now - 2 * 24 * 60 * 60 * 1000)
                            },
                            {
                              name: 'Fatima Khan',
                              avatar: 'F',
                              providerName: 'Elite Home Solutions',
                              rating: 5,
                              review: 'Outstanding service provider! Very courteous and respectful. The technician arrived on time and did a thorough job. Highly recommend!',
                              time: '5 days ago',
                              date: new Date(now - 5 * 24 * 60 * 60 * 1000)
                            },
                            {
                              name: 'Karim Uddin',
                              avatar: 'K',
                              providerName: 'QuickFix Experts',
                            rating: 4,
                              review: 'Great service overall. The provider was professional and the work quality was excellent. Minor delay in arrival but made up for it with quality work.',
                              time: '1 week ago',
                              date: new Date(now - 7 * 24 * 60 * 60 * 1000)
                          },
                          {
                              name: 'Rashid Ahmed',
                              avatar: 'R',
                              providerName: 'ProFix Solutions',
                            rating: 5,
                              review: 'Amazing experience! The service provider was extremely professional and completed the job perfectly. Highly satisfied!',
                              time: '3 days ago',
                              date: new Date(now - 3 * 24 * 60 * 60 * 1000)
                            },
                            {
                              name: 'Sadia Rahman',
                              avatar: 'S',
                              providerName: 'Expert Services',
                              rating: 3,
                              review: 'Service was okay. The provider did the job but took longer than expected. Could be improved.',
                              time: '2 weeks ago',
                              date: new Date(now - 14 * 24 * 60 * 60 * 1000)
                            },
                            {
                              name: 'Hasan Ali',
                              avatar: 'H',
                              providerName: 'Quality Care Services',
                              rating: 4,
                              review: 'Good service provider. Professional and efficient. Would recommend to others.',
                              time: '6 days ago',
                              date: new Date(now - 6 * 24 * 60 * 60 * 1000)
                            }
                          ]

                          // Filter by star rating
                          let filtered = providerFilterStar 
                            ? providerReviews.filter(r => r.rating === providerFilterStar)
                            : providerReviews

                          // Sort
                          filtered = [...filtered].sort((a, b) => {
                            if (providerSortBy === 'rating') {
                              return b.rating - a.rating
                            } else {
                              return b.date.getTime() - a.date.getTime()
                            }
                          })

                          return filtered.map((review, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
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
                                      {/* <p className="text-xs font-medium text-[var(--color-primary)]">Service Provider</p> */}
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
                                <p className="text-gray-700 leading-relaxed">{review.review}</p>
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
                      </div>
                    </div>

                    {/* Video Section */}
                    <div className="border-t pt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <PlayCircle className="w-6 h-6 text-[var(--color-primary)]" />
                        <h3 className="text-xl font-bold text-gray-900">Video Tutorial</h3>
                      </div>
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
          <div className="lg:col-span-1">
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
                <button 
                  onClick={() => router.push('/cart')}
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

      {/* Mobile Floating Book Now Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-600">{service.packages[selectedPackage].name}</p>
              <p className="text-lg font-bold text-[var(--color-primary)]">
                ৳{service.packages[selectedPackage].price}
              </p>
            </div>
            <button 
              onClick={() => router.push('/cart')}
              className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-colors"
            >
              Book Now
            </button>
          </div>
          <button 
            onClick={() => router.push(`/services/${slug}/consultation`)}
            className="w-full bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-2.5 rounded-lg font-bold hover:bg-[var(--color-neutral)] transition-colors"
          >
            Book a free consultation
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
