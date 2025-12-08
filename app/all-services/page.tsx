'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Clock } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const serviceCategories = [
  {
    id: 'ac-repair',
    title: 'AC Repair Services',
    icon: '🔧',
    featured: [
      {
        title: 'AC Servicing',
        image: '/plumbing.jpg',
        slug: 'ac-servicing',
        rating: '4.9',
        description: 'Professional AC servicing and maintenance to keep your air conditioner running efficiently.',
        deliveryTime: '2-3 hours',
        startingPrice: '৳800',
      },
      {
        title: 'AC Doctor',
        image: '/moving_service.webp',
        slug: 'ac-doctor',
        rating: '4.8',
        description: 'Expert AC diagnosis and repair services for all your air conditioning needs.',
        deliveryTime: '1-2 hours',
        startingPrice: '৳600',
      },
      {
        title: 'AC Combo Packages',
        image: '/cleaning_service.jpg',
        slug: 'ac-combo-packages',
        rating: '4.7',
        description: 'Complete AC maintenance packages with multiple services at discounted rates.',
        deliveryTime: '3-4 hours',
        startingPrice: '৳1,200',
      },
    ],
    services: [
      { title: 'AC Cooling Problem', slug: 'ac-cooling-problem' },
      { title: 'AC Installation & Uninstallation', slug: 'ac-installation-uninstallation' },
      { title: 'VRF AC Service', slug: 'vrf-ac-service' },
    ],
  },

  {
    id: 'appliance-repair',
    title: 'Appliance Repair',
    icon: '🔌',
    subCategories: [
      {
        id: 'fridge-repair',
        title: 'Fridge Repair',
        icon: '🧊',
        featured: [
          {
            title: 'Fridge Servicing',
            image: '/plumbing.jpg',
            slug: 'fridge-servicing',
            rating: '4.8',
            description: 'Professional fridge servicing and maintenance to keep your refrigerator running efficiently.',
            deliveryTime: '2-3 hours',
            startingPrice: '৳700',
          },
          {
            title: 'Fridge Gas Refill',
            image: '/moving_service.webp',
            slug: 'fridge-gas-refill',
            rating: '4.7',
            description: 'Expert fridge gas refill service to restore cooling performance.',
            deliveryTime: '1-2 hours',
            startingPrice: '৳500',
          },
        ],
        services: [
          { title: 'Fridge Not Cooling', slug: 'fridge-not-cooling' },
          { title: 'Fridge Compressor Repair', slug: 'fridge-compressor-repair' },
          { title: 'Fridge Installation', slug: 'fridge-installation' },
        ],
      },
      {
        id: 'microwave-repair',
        title: 'Microwave Repair',
        icon: '🍽️',
        featured: [
          {
            title: 'Microwave Servicing',
            image: '/cleaning_service.jpg',
            slug: 'microwave-servicing',
            rating: '4.6',
            description: 'Complete microwave servicing and repair for all brands and models.',
            deliveryTime: '1-2 hours',
            startingPrice: '৳600',
          },
          {
            title: 'Microwave Installation',
            image: '/gas-cooker-repair.jpg',
            slug: 'microwave-installation',
            rating: '4.8',
            description: 'Professional microwave installation service with safety checks.',
            deliveryTime: '1 hour',
            startingPrice: '৳400',
          },
        ],
        services: [
          { title: 'Microwave Not Heating', slug: 'microwave-not-heating' },
          { title: 'Microwave Door Repair', slug: 'microwave-door-repair' },
          { title: 'Microwave Panel Replacement', slug: 'microwave-panel-replacement' },
        ],
      },
    ],
    featured: [
      {
        title: 'Exclusive Combo Offer',
        image: '/gas-cooker-repair.jpg',
        slug: 'exclusive-combo-offer',
        rating: '4.9',
        description: 'Special combo packages for multiple appliance services at discounted rates.',
        deliveryTime: '4-6 hours',
        startingPrice: '৳2,000',
      },
      {
        title: 'Oven Services',
        image: '/plumbing.jpg',
        slug: 'oven-services',
        rating: '4.7',
        description: 'Professional oven repair, servicing, and installation services.',
        deliveryTime: '2-3 hours',
        startingPrice: '৳800',
      },
      {
        title: 'TV Services',
        image: '/moving_service.webp',
        slug: 'tv-services',
        rating: '4.8',
        description: 'Expert TV repair, installation, and maintenance services for all brands.',
        deliveryTime: '2-4 hours',
        startingPrice: '৳900',
      },
    ],
    services: [
      { title: 'Refrigerator Services', slug: 'refrigerator-services' },
      { title: 'Washing Machine Services', slug: 'washing-machine-services' },
      { title: 'Kitchen Hood Services', slug: 'kitchen-hood-services' },
      { title: 'IPS Services', slug: 'ips-services' },
      { title: 'Treadmill Services', slug: 'treadmill-services' },
      { title: 'Water Purifier Services', slug: 'water-purifier-services' },
      { title: 'Geyser Services', slug: 'geyser-services' },
      { title: 'Gas Stove/Burner Services', slug: 'gas-stove-burner-services' },
      { title: 'Generator Services', slug: 'generator-services' },
    ],
  },

  {
    id: 'cleaning-solution',
    title: 'Cleaning Solution',
    icon: '🧹',
    featured: [
      {
        title: 'Home Cleaning',
        image: '/cleaning_service.jpg',
        slug: 'home-cleaning',
        rating: '4.7',
        description: 'Comprehensive home cleaning services for a spotless and fresh living space.',
        deliveryTime: '3-5 hours',
        startingPrice: '৳1,500',
      },
      {
        title: 'Cleaning Combo',
        image: '/gas-cooker-repair.jpg',
        slug: 'cleaning-combo',
        rating: '4.8',
        description: 'Special combo packages combining multiple cleaning services at great value.',
        deliveryTime: '4-6 hours',
        startingPrice: '৳2,500',
      },
      {
        title: 'Furniture & Carpet Cleaning',
        image: '/plumbing.jpg',
        slug: 'furniture-carpet-cleaning',
        rating: '4.6',
        description: 'Deep cleaning services for furniture, carpets, and upholstery.',
        deliveryTime: '2-4 hours',
        startingPrice: '৳1,200',
      },
    ],
    services: [
      { title: 'Outdoor Cleaning', slug: 'outdoor-cleaning' },
      { title: 'Appliance Cleaning', slug: 'appliance-cleaning' },
      { title: 'Tank & Pipe Cleaning', slug: 'tank-pipe-cleaning' },
      { title: 'Special Cleaning Combo', slug: 'special-cleaning-combo' },
    ],
  },

  {
    id: 'beauty-wellness',
    title: 'Beauty & Wellness',
    icon: '💅',
    featured: [
      {
        title: 'Nail Extension',
        image: '/plumbing.jpg',
        slug: 'nail-extension',
        rating: '4.8',
        description: 'Professional nail extension services with premium quality materials.',
        deliveryTime: '2-3 hours',
        startingPrice: '৳1,500',
      },
      {
        title: 'Salon Care',
        image: '/moving_service.webp',
        slug: 'salon-care',
        rating: '4.7',
        description: 'Complete salon services including hair, makeup, and beauty treatments.',
        deliveryTime: '2-4 hours',
        startingPrice: '৳1,200',
      },
      {
        title: 'At-home Hair Studio',
        image: '/cleaning_service.jpg',
        slug: 'at-home-hair-studio',
        rating: '4.9',
        description: 'Premium hair styling and treatment services at your doorstep.',
        deliveryTime: '1-2 hours',
        startingPrice: '৳800',
      },
    ],
    services: [
      { title: 'Makeup', slug: 'makeup' },
      { title: 'Spa & Massage', slug: 'spa-massage' },
      { title: 'Hair Care', slug: 'hair-care' },
      { title: 'Skin Care', slug: 'skin-care' },
      { title: 'Nail Care', slug: 'nail-care' },
      { title: 'Bridal Package', slug: 'bridal-package' },
      { title: 'Body Treatment', slug: 'body-treatment' },
      { title: 'Waxing', slug: 'waxing' },
    ],
  },

  {
    id: 'shifting-moving',
    title: 'Shifting & Moving',
    icon: '📦',
    featured: [
      {
        title: 'House Shifting',
        image: '/moving_service.webp',
        slug: 'house-shifting',
        rating: '4.9',
        description: 'Complete house shifting solutions with packing, moving, and unpacking services.',
        deliveryTime: 'Same day',
        startingPrice: '৳3,000',
      },
      {
        title: 'Office Shifting',
        image: '/gas-cooker-repair.jpg',
        slug: 'office-shifting',
        rating: '4.8',
        description: 'Professional office relocation services with minimal business disruption.',
        deliveryTime: '1-2 days',
        startingPrice: '৳5,000',
      },
      {
        title: 'Local Shifting',
        image: '/moving_service.webp',
        slug: 'local-shifting',
        rating: '4.7',
        description: 'Affordable local shifting services within the city.',
        deliveryTime: 'Same day',
        startingPrice: '৳2,000',
      },
    ],
    services: [
      { title: 'Packing Service', slug: 'packing-service' },
      { title: 'Inter-city Shifting', slug: 'inter-city-shifting' },
      { title: 'International Shifting', slug: 'international-shifting' },
    ],
  },

  {
    id: 'home-repair',
    title: 'Home Repair',
    icon: '🏠',
    featured: [
      {
        title: 'Plumbing Services',
        image: '/plumbing.jpg',
        slug: 'plumbing-services',
        rating: '4.8',
        description: 'Professional plumbing and sanitary services for your home. Expert technicians available 24/7.',
        deliveryTime: '2-4 hours',
        startingPrice: '৳500',
      },
      {
        title: 'Electrical Services',
        image: '/moving_service.webp',
        slug: 'electrical-services',
        rating: '4.7',
        description: 'Expert electrical repair, installation, and maintenance services.',
        deliveryTime: '2-3 hours',
        startingPrice: '৳600',
      },
      {
        title: 'Painting Services',
        image: '/cleaning_service.jpg',
        slug: 'painting-services',
        rating: '4.6',
        description: 'Professional interior and exterior painting services with quality materials.',
        deliveryTime: '1-2 days',
        startingPrice: '৳2,500',
      },
    ],
    services: [
      { title: 'Carpentry Services', slug: 'carpentry-services' },
      { title: 'Sanitary Services', slug: 'sanitary-services' },
      { title: 'Interior Design', slug: 'interior-design' },
      { title: 'Door & Lock Services', slug: 'door-lock-services' },
      { title: 'Welding Services', slug: 'welding-services' },
      { title: 'Glass & Glazing', slug: 'glass-glazing' },
    ],
  },
]


export default function AllServicesPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('')

  // Helper function to convert service title to slug
  const getServiceSlug = (title: string): string => {
    // Try to find the slug from the service categories
    for (const category of serviceCategories) {
      if (category.featured) {
        const found = category.featured.find(s => s.title === title)
        if (found) return found.slug
      }
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          if (subCategory.featured) {
            const found = subCategory.featured.find(s => s.title === title)
            if (found) return found.slug
          }
        }
      }
    }
    // Fallback to generating slug from title
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleBookNow = (e: React.MouseEvent, serviceTitle: string) => {
    e.stopPropagation() // Prevent card onClick from firing
    const slug = getServiceSlug(serviceTitle)
    router.push(`/services/${slug}`)
  }

  useEffect(() => {
    const updateActiveSection = () => {
      const allSections: { id: string; element: HTMLElement }[] = []

      serviceCategories.forEach((category) => {
        const element = document.getElementById(category.id)
        if (element) {
          allSections.push({ id: category.id, element })
        }
        
        if (category.subCategories) {
          category.subCategories.forEach((subCategory) => {
            const subElement = document.getElementById(subCategory.id)
            if (subElement) {
              allSections.push({ id: subCategory.id, element: subElement })
            }
          })
        }
      })

      // Find the section closest to the top of the viewport
      const viewportTop = window.scrollY + window.innerHeight * 0.2
      let closestSection = ''
      let closestDistance = Infinity

      allSections.forEach(({ id, element }) => {
        const rect = element.getBoundingClientRect()
        const elementTop = window.scrollY + rect.top
        
        // Check if section is in the viewport area we care about
        if (elementTop <= viewportTop + 100) {
          const distance = Math.abs(elementTop - viewportTop)
          if (distance < closestDistance) {
            closestDistance = distance
            closestSection = id
          }
        }
      })

      if (closestSection) {
        setActiveSection(closestSection)
      }
    }

    // Initial check
    updateActiveSection()

    // Update on scroll
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    
    // Also use IntersectionObserver for more accurate detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect
            // Only update if the section is in the upper portion of the viewport
            if (rect.top < window.innerHeight * 0.3) {
              setActiveSection(entry.target.id)
            }
          }
        })
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      }
    )

    // Observe all sections
    serviceCategories.forEach((category) => {
      const element = document.getElementById(category.id)
      if (element) {
        observer.observe(element)
      }
      
      if (category.subCategories) {
        category.subCategories.forEach((subCategory) => {
          const subElement = document.getElementById(subCategory.id)
          if (subElement) {
            observer.observe(subElement)
          }
        })
      }
    })

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      observer.disconnect()
    }
  }, [])

  const handleSidebarClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryId: string) => {
    e.preventDefault()
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Services</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-1">
                {serviceCategories.map((category) => (
                  <div key={category.id}>
                    <a
                      href={`#${category.id}`}
                      onClick={(e) => handleSidebarClick(e, category.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        activeSection === category.id && (!category.subCategories || !category.subCategories.some(sub => activeSection === sub.id))
                          ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-semibold'
                          : category.subCategories && category.subCategories.some(sub => activeSection === sub.id)
                          ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-medium'
                          : 'text-gray-700 hover:bg-[var(--color-neutral)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.title}</span>
                    </a>
                    {category.subCategories && (
                      <div className="ml-8 mt-1 space-y-1">
                        {category.subCategories.map((subCategory) => {
                          const isPrimary = subCategory.id === 'fridge-repair' || subCategory.id === 'microwave-repair'
                          return (
                            <a
                              key={subCategory.id}
                              href={`#${subCategory.id}`}
                              onClick={(e) => handleSidebarClick(e, subCategory.id)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                activeSection === subCategory.id
                                  ? isPrimary
                                    ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-semibold'
                                    : 'bg-blue-100 text-blue-600 font-semibold'
                                  : isPrimary
                                  ? 'text-gray-600 hover:bg-[var(--color-neutral)] hover:text-[var(--color-primary)]'
                                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                              }`}
                            >
                              {subCategory.icon && <span className="text-lg">{subCategory.icon}</span>}
                              <span>{subCategory.title}</span>
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Service Categories */}
          <div className="flex-1 space-y-12">
            {serviceCategories.map((category) => (
              <div key={category.id} className="space-y-12">
                <section id={category.id} className="bg-white rounded-lg p-6 shadow-sm">
                  {/* Category Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {category.title}
                  </h2>

                  {/* Featured Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {category.featured.map((service, index) => {
                      const serviceWithDetails = service as typeof service & {
                        rating?: string
                        description?: string
                        deliveryTime?: string
                        startingPrice?: string
                      }

                      return (
                        <div
                          key={index}
                          className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
                          onClick={() => router.push(`/services/${service.slug}`)}
                        >
                          <div className="relative h-56 overflow-hidden p-3">
                            <div className="relative h-full w-full rounded-xl overflow-hidden">
                              <Image
                                src={service.image || "/placeholder.svg"}
                                alt={service.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-900 leading-tight">{service.title}</h3>
                              {serviceWithDetails.rating && (
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold text-sm">{serviceWithDetails.rating}</span>
                                </div>
                              )}
                            </div>
                            {serviceWithDetails.description && (
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{serviceWithDetails.description}</p>
                            )}
                            <div className="flex items-center justify-between mb-4">
                              {serviceWithDetails.deliveryTime && (
                                <span className="text-sm text-gray-600">
                                  <Clock size={16} className="inline mr-1" />
                                  {serviceWithDetails.deliveryTime}
                                </span>
                              )}
                              {serviceWithDetails.startingPrice && (
                                <span className="text-sm font-semibold text-gray-900">Starting at {serviceWithDetails.startingPrice}</span>
                              )}
                            </div>
                            <button 
                              onClick={(e) => handleBookNow(e, service.title)}
                              className="w-full mt-6 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* All Services List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      All {category.title.toLowerCase()} services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {category.services.map((service, index) => (
                        <Link
                          key={index}
                          href={`/services/${service.slug}`}
                          className="flex items-center gap-2 text-left text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                          <span>{service.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Sub-Categories */}
                {category.subCategories && category.subCategories.map((subCategory) => (
                  <section key={subCategory.id} id={subCategory.id} className="bg-white rounded-lg p-6 shadow-sm">
                    {/* Sub-Category Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {subCategory.title}
                    </h2>

                    {/* Featured Services Grid */}
                    {subCategory.featured && subCategory.featured.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {subCategory.featured.map((service, index) => {
                          const serviceWithDetails = service as typeof service & {
                            rating?: string
                            description?: string
                            deliveryTime?: string
                            startingPrice?: string
                          }

                          return (
                            <div
                              key={index}
                              className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
                              onClick={() => router.push(`/services/${service.slug}`)}
                            >
                              <div className="relative h-56 overflow-hidden p-3">
                                <div className="relative h-full w-full rounded-xl overflow-hidden">
                                  <Image
                                    src={service.image || "/placeholder.svg"}
                                    alt={service.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              </div>
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{service.title}</h3>
                                  {serviceWithDetails.rating && (
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                      <span className="font-semibold text-sm">{serviceWithDetails.rating}</span>
                                    </div>
                                  )}
                                </div>
                                {serviceWithDetails.description && (
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{serviceWithDetails.description}</p>
                                )}
                                <div className="flex items-center justify-between mb-4">
                                  {serviceWithDetails.deliveryTime && (
                                    <span className="text-sm text-gray-600">
                                      <Clock size={16} className="inline mr-1" />
                                      {serviceWithDetails.deliveryTime}
                                    </span>
                                  )}
                                  {serviceWithDetails.startingPrice && (
                                    <span className="text-sm font-semibold text-gray-900">Starting at {serviceWithDetails.startingPrice}</span>
                                  )}
                                </div>
                                <button 
                                  onClick={(e) => handleBookNow(e, service.title)}
                                  className="w-full mt-6 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* All Services List */}
                    {subCategory.services && subCategory.services.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          All {subCategory.title.toLowerCase()} services
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {subCategory.services.map((service, index) => {
                            const isPrimary = subCategory.id === 'fridge-repair' || subCategory.id === 'microwave-repair'
                            return (
                              <Link
                                key={index}
                                href={`/services/${service.slug}`}
                                className={`flex items-center gap-2 text-left text-gray-700 transition-colors ${
                                  isPrimary
                                    ? 'hover:text-[var(--color-primary)]'
                                    : 'hover:text-blue-600'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${
                                  isPrimary
                                    ? 'bg-[var(--color-primary)]'
                                    : 'bg-blue-600'
                                }`} />
                                <span>{service.title}</span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
