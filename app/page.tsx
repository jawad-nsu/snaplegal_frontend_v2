'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Star, Clock, Scale, Building2, FileBadge, Car, Receipt, Grid2X2, LandPlot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { LogoSpinner } from '@/components/logo-spinner'

interface HomepageService {
  id: string
  title: string
  slug: string
  image: string
  rating: string
  description: string
  deliveryTime: string
  startingPrice: string
  discountType?: string
  discountValue?: string
}

export default function HomePage() {
  const router = useRouter()
  const categoriesScrollRef = useRef<HTMLDivElement>(null)
  const [trendingServices, setTrendingServices] = useState<HomepageService[]>([])
  const [recommended, setRecommended] = useState<HomepageService[]>([])
  const [legalServicesRows, setLegalServicesRows] = useState<{ categoryId: string; categoryTitle: string; services: HomepageService[] }[]>([])
  const [sectionsLoading, setSectionsLoading] = useState(true)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/homepage-sections')
        const data = await res.json()
        if (data.success) {
          setTrendingServices(data.trending || [])
          setRecommended(data.recommended || [])
          setLegalServicesRows(data.legalServices || [])
        }
      } catch (e) {
        console.error('Fetch homepage sections failed', e)
      } finally {
        setSectionsLoading(false)
      }
    }
    fetchSections()
  }, [])

  const getServiceSlug = (title: string): string => {
    const slugMap: Record<string, string> = {
      'AC Servicings': 'ac-servicing',
      'Home Cleaning': 'home-cleaning',
      'legal_service_image & Sanitary Services': 'legal_service_image-sanitary-services',
      'House Shifting Services': 'house-shifting-services',
      'Gas Stove/Burner Services': 'gas-stove-burner-services',
      'DigiGO': 'digigo',
      'On Demand Driver': 'on-demand-driver',
      'Salon Care': 'salon-care',
    }
    return slugMap[title] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleBookNow = (e: React.MouseEvent, service: HomepageService | { title: string; slug?: string }) => {
    e.stopPropagation()
    const slug = 'slug' in service && service.slug ? service.slug : getServiceSlug(service.title)
    router.push(`/services/${slug}`)
  }

  const handleScrollCategories = () => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 200 // Scroll by 200px
      categoriesScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const pricePrefix = (str: string) => (str.match(/^[^\d]*/) || [''])[0] || '৳'

  /** Get discounted starting price for display; returns null if no valid discount */
  const getDiscountedStartingPrice = (originalPriceStr: string, discountType?: string, discountValue?: string): string | null => {
    if (!discountType || !discountValue || (discountType !== 'amount' && discountType !== 'percentage')) return null
    const raw = String(originalPriceStr).replace(/[^\d.]/g, '')
    if (!raw) return null
    const original = parseFloat(raw)
    if (isNaN(original)) return null
    const val = parseFloat(String(discountValue).replace(/[^\d.]/g, ''))
    if (isNaN(val)) return null
    let discounted = 0
    if (discountType === 'amount') {
      discounted = Math.max(0, original - val)
    } else {
      discounted = Math.max(0, original * (1 - val / 100))
    }
    return `${pricePrefix(originalPriceStr)}${Math.round(discounted)}`
  }

  /** Get "Save X%" or "Save ৳X" label for discount badge; returns null if no valid discount */
  const getSaveLabel = (originalPriceStr: string, discountType?: string, discountValue?: string): string | null => {
    if (!discountType || !discountValue || (discountType !== 'amount' && discountType !== 'percentage')) return null
    const raw = String(originalPriceStr).replace(/[^\d.]/g, '')
    if (!raw) return null
    const val = parseFloat(String(discountValue).replace(/[^\d.]/g, ''))
    if (isNaN(val)) return null
    if (discountType === 'percentage') return `Save ${Math.round(val)}%`
    return `Save ${pricePrefix(originalPriceStr)}${Math.round(val)}`
  }

  const renderStartingPrice = (service: HomepageService) => {
    const discountedPrice = getDiscountedStartingPrice(service.startingPrice, service.discountType, service.discountValue)
    const saveLabel = getSaveLabel(service.startingPrice, service.discountType, service.discountValue)
    if (discountedPrice && saveLabel) {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex w-fit items-center rounded-md bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
            {saveLabel}
          </span>
          <span className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-800">{discountedPrice}</span>
            <span className="text-sm text-red-500 line-through">{service.startingPrice}</span>
          </span>
        </div>
      )
    }
    return <span className="text-sm font-semibold text-gray-900">Starting at {service.startingPrice}</span>
  }

const categories = [
  { name: 'Legal Services', icon: Scale },
  { name: 'Business Affairs', icon: Building2 },
  { name: 'Immigration Affairs', icon: FileBadge },
  { name: 'Land / Properties', icon: LandPlot },
  { name: 'Vehicle Licenses', icon: Car },
  { name: 'VAT/TAX', icon: Receipt },
  { name: 'Explore more', icon: Grid2X2 },
]

  if (sectionsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <LogoSpinner fullPage={false} message="Loading..." />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/hero_banner.png')",
          }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 h-full flex flex-col justify-center items-center text-center">
          {/* <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Your Personal Consultant - in a Snap.
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            One-stop solution for your Legal services. Order any service, anytime.
          </p> */}

          {/* Search Bar */}
          {/* <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-2 flex gap-2">
            <div className="flex items-center gap-2 px-4 border-r">
              <MapPin className="text-pink-600" size={20} />
              <span className="text-sm font-medium">Gulshan</span>
            </div>
            <Input
              placeholder="Find your service here e.g. AC, Car, Facial ..."
              className="flex-1 border-0 focus-visible:ring-0"
            />
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Search size={20} />
            </Button>
          </div> */}

          {/* Location Notice */}
          {/* <div className="mt-6 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
            <p className="font-medium">Set your Delivery Address</p>
            <p className="text-xs">Please check your delivery address and change it from here if necessary.</p>
            <Button variant="outline" size="sm" className="mt-2 bg-pink-600 text-white border-0 hover:bg-pink-700">
              Close
            </Button>
          </div> */}
        </div>
      </section>

      {/* Service Categories */}
      <section className="relative -mt-8 sm:-mt-12 md:-mt-16 pb-6 sm:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 w-full md:w-auto md:inline-block overflow-hidden relative">
            <div 
              ref={categoriesScrollRef}
              className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible scrollbar-hide md:scrollbar-hide pb-2 md:pb-0 pr-12 md:pr-0"
            >
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[90px] md:min-w-[100px] flex-shrink-0 hover:opacity-75 transition-opacity cursor-pointer"
                  onClick={() => router.push('/all-services')}
                >
                  {/* <div className="text-3xl sm:text-3xl md:text-4xl">{category.icon}</div> */}

                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-50 border-[3px] border-gray-500 hover:bg-orange-200 transition-colors">
                    <category.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-primary)]" />
                  </div>

                  <span className="text-[10px] sm:text-xs text-center font-medium leading-tight md:leading-normal">{category.name}</span>
                </button>
              ))}
            </div>
            {/* Arrow button - visible on mobile/tablet only */}
            <button 
              onClick={handleScrollCategories}
              className="md:hidden absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all z-10 border border-gray-200"
              aria-label="Scroll to next categories"
            >
              <ChevronRight className="text-[var(--color-primary)] w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Trending – single row, order by serial (admin list order) */}
      {!sectionsLoading && trendingServices.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending</h2>
            <button onClick={() => router.push('/all-services')} className="flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium">
              View All <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingServices.map((service) => (
              <div
                key={service.id}
                className="group cursor-pointer rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm md:shadow-md hover:shadow-md md:hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
                onClick={() => router.push(`/services/${service.slug}`)}
              >
                <div className="md:hidden">
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <Image src={service.image || '/placeholder.svg'} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-tight">{service.title}</h3>
                    <div className="mt-2 flex justify-center">{renderStartingPrice(service)}</div>
                  </div>
                </div>
                <div className="hidden md:flex md:flex-col md:flex-1 md:min-h-0">
                  <div className="relative h-56 overflow-hidden p-3 flex-shrink-0">
                    <div className="relative h-full w-full rounded-xl overflow-hidden">
                      <Image src={service.image || '/placeholder.svg'} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 min-h-0">
                    <div className="flex-1 min-h-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{service.title}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm">{service.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600"><Clock size={16} className="inline mr-1" />{service.deliveryTime}</span>
                        {renderStartingPrice(service)}
                      </div>
                    </div>
                    <button onClick={(e) => handleBookNow(e, service)} className="w-full mt-auto bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex-shrink-0">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EMI Banner */}
      {/* <section className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-gradient-to-r from-orange-400 to-orange-300 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">EMI</h2>
            <p className="text-white text-sm">Available</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Buy now, pay later in installments</h3>
            <p className="text-white text-sm">For any service greater than BDT 5,000</p>
          </div>
          <div className="text-6xl font-bold text-white/40">%</div>
          <p className="text-white text-xs">T&C apply</p>
        </div>
      </section> */}

      {/* Legal Services – one row per category, from admin homepage tab */}
      {!sectionsLoading && legalServicesRows.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          {legalServicesRows.map((row, rowIdx) => (
            <div key={`legal-${rowIdx}-${row.categoryId}`} className="mb-10 last:mb-0">
              <h2 className="text-2xl font-bold mb-6">{row.categoryTitle || 'Legal Services'}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {row.services.map((service) => (
                  <div
                    key={service.id}
                    className="group cursor-pointer rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm md:shadow-md hover:shadow-md md:hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
                    onClick={() => router.push(`/services/${service.slug}`)}
                  >
                    <div className="md:hidden">
                      <div className="relative h-32 sm:h-40 overflow-hidden">
                        <Image src={service.image || '/placeholder.svg'} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="p-3 sm:p-4 text-center">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-tight">{service.title}</h3>
                      </div>
                    </div>
                    <div className="hidden md:flex md:flex-col md:flex-1 md:min-h-0">
                      <div className="relative h-56 overflow-hidden p-3 flex-shrink-0">
                        <div className="relative h-full w-full rounded-xl overflow-hidden">
                          <Image src={service.image || '/placeholder.svg'} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1 min-h-0">
                        <div className="flex-1 min-h-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-900 leading-tight">{service.title}</h3>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                              <Star size={16} className="fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{service.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-600"><Clock size={16} className="inline mr-1" />{service.deliveryTime}</span>
                            {renderStartingPrice(service)}
                          </div>
                        </div>
                        <button onClick={(e) => handleBookNow(e, service)} className="w-full mt-auto bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex-shrink-0">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Recommended (fetched from admin) */}
      {!sectionsLoading && recommended.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended</h2>
            <button onClick={() => router.push('/all-services')} className="flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium">
              View All <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommended.map((service) => (
              <div
                key={service.id}
                className="group cursor-pointer rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm md:shadow-md hover:shadow-md md:hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
                onClick={() => router.push(`/services/${service.slug}`)}
              >
                <div className="md:hidden">
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <Image src={service.image || '/placeholder.svg'} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-tight">{service.title}</h3>
                    <div className="mt-2 flex justify-center">{renderStartingPrice(service)}</div>
                  </div>
                </div>
                <div className="hidden md:flex md:flex-col md:flex-1 md:min-h-0">
                  <div className="relative h-56 overflow-hidden p-3 flex-shrink-0">
                    <div className="relative h-full w-full rounded-xl overflow-hidden">
                      <Image src={service.image || '/placeholder.svg'} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 min-h-0">
                    <div className="flex-1 min-h-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{service.title}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm">{service.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600"><Clock size={16} className="inline mr-1" />{service.deliveryTime}</span>
                        {renderStartingPrice(service)}
                      </div>
                    </div>
                    <button onClick={(e) => handleBookNow(e, service)} className="w-full mt-auto bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex-shrink-0">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="container mx-auto max-w-6xl  px-4 pt-6">
        <div className="bg-blue-50 rounded-lg px-8 py-12 ">
          <div className="text-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-600 tracking-wide mb-2">
            WHY CHOOSE <span className="text-[var(--color-primary)]">SnapLegal</span>?
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Because your legal peace of mind matters most.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          {/* Features Grid */}

        {/* Card 1 */}
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-bold text-lg text-gray-900">
            Expert Legal Guidance
          </h3>
          <p className="text-gray-600">
            Access qualified legal consultants who ensure accuracy, compliance, and clarity in every service.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-bold text-lg text-gray-900">
            24/7 Client Support
          </h3>
          <p className="text-gray-600">
            Get assistance anytime — our system is always available for urgent legal needs and ongoing queries.
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-bold text-lg text-gray-900">
            Secure & Confidential Handling
          </h3>
          <p className="text-gray-600">
            Your documents and information are safeguarded with strict data-protection protocols.
          </p>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-bold text-lg text-gray-900">
            Transparent & Fair Pricing
          </h3>
          <p className="text-gray-600">
            No hidden charges — clear fees and honest service from start to finish.
          </p>
        </div>

        </div>
        </div>
        

        

        {/* Statistics */}
        {/* <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              15,000 +
            </h3>
            <p className="text-gray-600 text-lg">Service Providers</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              2,00,000 +
            </h3>
            <p className="text-gray-600 text-lg">Order Served</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              1,00,000 +
            </h3>
            <p className="text-gray-600 text-lg">5 Star Received</p>
          </div>
        </div> */}
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Quick answers about SnapLegal, booking, and support.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What is SnapLegal?</h3>
            <p className="text-gray-600 text-sm">
              A one-stop platform for legal and related services—connect with verified consultants, transparent pricing, and quick delivery.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">How do I book a service?</h3>
            <p className="text-gray-600 text-sm">
              Browse services, choose what you need, book or add to cart, pay securely (e.g. bKash), and we deliver.
            </p>
          </div>
        </div>
        <div className="text-center">
          <Button asChild variant="outline" className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-neutral)]">
            <Link href="/faq">View all FAQs</Link>
          </Button>
        </div>
      </section>

       {/* CTA Section for Requesting Services */}
       <section className="container mx-auto max-w-6xl px-4 py-12">
        <div className="bg-gray-100 rounded-lg px-8 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Looking for something else? We&apos;re here always.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-[var(--color-primary)] hover:opacity-90 text-white px-8 py-6 text-lg font-semibold">
              <Link href="/contact-sales">Book an Appointment</Link>
            </Button>

            <Button
              asChild
              variant="outline" 
              className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-neutral)] px-8 py-6 text-lg font-semibold"
            >
              <Link
                href="https://wa.me/8801304449988?text=Hello%2C%20I%27m%20reaching%20from%20snaplegal.com.bd%20website"
                target="blank"
                // href="tel:+8801304449988"
              >
                <svg
                  className="w-5 h-5 mr-2" 
                  viewBox="0 0 24 24" 
                            fill="currentColor"
                >
                  <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.46 0 .17 5.29.17 11.87c0 2.09.55 4.14 1.6 5.95L0 24l6.37-1.66c1.72.94 3.67 1.43 5.67 1.43h.01c6.58 0 11.87-5.29 11.87-11.87a11.8 11.8 0 0 0-3.4-8.42zM12.05 21.48c-1.74 0-3.45-.47-4.94-1.36l-.35-.21-3.78.98 1.01-3.68-.23-.38a9.85 9.85 0 0 1-1.49-5.22C2.27 6.55 6.51 2.3 12.04 2.3c2.63 0 5.1 1.02 6.96 2.88a9.75 9.75 0 0 1 2.88 6.96c-.01 5.53-4.26 9.77-9.83 9.77zm5.48-7.35c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.69.15-.2.3-.79.97-.96 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.69-1.65-.95-2.27-.25-.6-.5-.52-.69-.53-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.18 5.08 4.46.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.3.17-1.41-.07-.1-.27-.17-.57-.32z"/>
                </svg>
                +88 0130 444 99 88
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      
    </div>
  )
}
