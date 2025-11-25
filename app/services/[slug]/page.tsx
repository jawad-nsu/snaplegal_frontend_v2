'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, ChevronDown, ChevronUp, CheckCircle, Info, MessageCircle, BookOpen, Reply } from 'lucide-react'
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
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [expandedThread, setExpandedThread] = useState<number | null>(null)
  const router = useRouter()
  
  const { slug } = use(params)
  const service = serviceData[slug]
  console.log('serviceData', serviceData)
  console.log('service', service)

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
      <div className="container mx-auto px-4 py-8">
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
                  {['Overview', 'Details', 'Learning and Discussion', 'FAQ', 'How to Order', 'Review'].map((tab) => (
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
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-3">
                    {service.faqs.map((faq, index) => (
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
                    ))}
                  </div>
                )}

                {/* How to Order Tab */}
                {activeTab === 'how-to-order' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[var(--color-neutral)] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[var(--color-primary)] font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Select Your Package</h4>
                          <p className="text-gray-600">Choose from Basic, Standard, or Premium packages based on your needs.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[var(--color-neutral)] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[var(--color-primary)] font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Book Your Service</h4>
                          <p className="text-gray-600">Click &quot;Book Now&quot; and select your preferred date and time slot.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[var(--color-neutral)] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[var(--color-primary)] font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Confirm Your Details</h4>
                          <p className="text-gray-600">Review your booking details and provide your address information.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[var(--color-neutral)] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[var(--color-primary)] font-bold">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Service Delivery</h4>
                          <p className="text-gray-600">Our professional will arrive at your location at the scheduled time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Tab */}
                {activeTab === 'review' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{service.rating}</span>
                      </div>
                      <div className="text-gray-600">
                        Based on {service.reviewCount} reviews
                      </div>
                    </div>
                    <div className="space-y-4">
                      {/* Sample Reviews */}
                      <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">A</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Ahmed Rahman</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">Excellent service! The technician was professional and completed the work on time. Highly recommended!</p>
                        <p className="text-sm text-gray-500 mt-2">2 days ago</p>
                      </div>
                      <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">S</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Sara Khan</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">Very satisfied with the quality of service. The team was clean, efficient, and respectful of my home.</p>
                        <p className="text-sm text-gray-500 mt-2">1 week ago</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Service Category</h3>
                      <p className="text-gray-700">{service.category}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Service Name</h3>
                      <p className="text-gray-700">{service.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Rating</h3>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700">{service.rating} ({service.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Available Packages</h3>
                      <div className="space-y-2">
                        {service.packages.map((pkg, index) => (
                          <div key={index} className="text-gray-700">
                            • {pkg.name} - ৳{pkg.price}
                          </div>
                        ))}
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

                    {/* Community Discussion Section */}
                    <div className="border-t pt-8">
                      <div className="flex items-center gap-2 mb-6">
                        <MessageCircle className="w-6 h-6 text-[var(--color-primary)]" />
                        <h3 className="text-xl font-bold text-gray-900">Community Discussion</h3>
                      </div>

                      {/* Topic Pills */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <button
                          onClick={() => setSelectedTopic('all')}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedTopic === 'all'
                              ? 'bg-[var(--color-primary)] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          All Topics
                        </button>
                        <button
                          onClick={() => setSelectedTopic('tips')}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedTopic === 'tips'
                              ? 'bg-[var(--color-primary)] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Tips & Tricks
                        </button>
                        <button
                          onClick={() => setSelectedTopic('troubleshooting')}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedTopic === 'troubleshooting'
                              ? 'bg-[var(--color-primary)] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Troubleshooting
                        </button>
                        <button
                          onClick={() => setSelectedTopic('maintenance')}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedTopic === 'maintenance'
                              ? 'bg-[var(--color-primary)] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Maintenance
                        </button>
                        <button
                          onClick={() => setSelectedTopic('cost')}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedTopic === 'cost'
                              ? 'bg-[var(--color-primary)] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Cost & Pricing
                        </button>
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
                          .filter(thread => selectedTopic === 'all' || thread.topic === selectedTopic)
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

                      {/* Ask Question Section */}
                      <div className="mt-8 bg-[var(--color-neutral)] rounded-lg p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Have a Question?</h4>
                        <p className="text-sm text-gray-600 mb-4">Join the discussion and get help from our community</p>
                        <button className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all shadow-sm">
                          Ask a Question
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Choose Your Package</h3>
              
              <div className="space-y-3 mb-6">
                {service.packages.map((pkg, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPackage(index)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === index
                        ? 'border-[var(--color-primary)] bg-[var(--color-neutral)]'
                        : 'border-gray-200 hover:border-[var(--color-primary)]/50'
                    } ${pkg.popular ? 'relative' : ''}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-4 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-lg">{pkg.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[var(--color-primary)]">৳{pkg.price}</span>
                          {pkg.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">৳{pkg.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPackage === index
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedPackage === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => router.push('/cart')}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold hover:opacity-90 transition-colors mb-3"
              >
                Book Now - ৳{service.packages[selectedPackage].price}
              </button>

              <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>Our professional will arrive at your doorstep within your selected time slot. Payment after service completion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
