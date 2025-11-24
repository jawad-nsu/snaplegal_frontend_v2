'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, ChevronDown, ChevronUp, CheckCircle, Info } from 'lucide-react'
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
          <Link href="/all-services" className="text-pink-600 hover:underline">
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
            <Link href="/" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link href="/all-services" className="hover:text-pink-600">All Services</Link>
            <span>/</span>
            <Link href="/all-services" className="hover:text-pink-600">{service.category}</Link>
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
                  {['Overview', 'FAQ', 'How to Order', 'Review', 'Details'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, '-'))}
                      className={`py-4 px-1 font-medium transition-colors border-b-2 ${
                        activeTab === tab.toLowerCase().replace(/\s+/g, '-')
                          ? 'text-pink-600 border-pink-600'
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
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-pink-600 font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Select Your Package</h4>
                          <p className="text-gray-600">Choose from Basic, Standard, or Premium packages based on your needs.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-pink-600 font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Book Your Service</h4>
                          <p className="text-gray-600">Click &quot;Book Now&quot; and select your preferred date and time slot.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-pink-600 font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Confirm Your Details</h4>
                          <p className="text-gray-600">Review your booking details and provide your address information.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-pink-600 font-bold">4</span>
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
                        ? 'border-pink-600 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    } ${pkg.popular ? 'relative' : ''}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-lg">{pkg.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-pink-600">৳{pkg.price}</span>
                          {pkg.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">৳{pkg.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPackage === index
                            ? 'border-pink-600 bg-pink-600'
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
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors mb-3"
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
