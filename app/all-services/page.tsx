'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
      },
      {
        title: 'AC Doctor',
        image: '/moving_service.webp',
        slug: 'ac-doctor',
      },
      {
        title: 'AC Combo Packages',
        image: '/cleaning_service.jpg',
        slug: 'ac-combo-packages',
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
          },
          {
            title: 'Fridge Gas Refill',
            image: '/moving_service.webp',
            slug: 'fridge-gas-refill',
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
          },
          {
            title: 'Microwave Installation',
            image: '/gas-cooker-repair.jpg',
            slug: 'microwave-installation',
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
      },
      {
        title: 'Oven Services',
        image: '/plumbing.jpg',
        slug: 'oven-services',
      },
      {
        title: 'TV Services',
        image: '/moving_service.webp',
        slug: 'tv-services',
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
      },
      {
        title: 'Cleaning Combo',
        image: '/gas-cooker-repair.jpg',
        slug: 'cleaning-combo',
      },
      {
        title: 'Furniture & Carpet Cleaning',
        image: '/plumbing.jpg',
        slug: 'furniture-carpet-cleaning',
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
      },
      {
        title: 'Salon Care',
        image: '/moving_service.webp',
        slug: 'salon-care',
      },
      {
        title: 'At-home Hair Studio',
        image: '/cleaning_service.jpg',
        slug: 'at-home-hair-studio',
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
      },
      {
        title: 'Office Shifting',
        image: '/gas-cooker-repair.jpg',
        slug: 'office-shifting',
      },
      {
        title: 'Local Shifting',
        image: '/moving_service.webp',
        slug: 'local-shifting',
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
      },
      {
        title: 'Electrical Services',
        image: '/moving_service.webp',
        slug: 'electrical-services',
      },
      {
        title: 'Painting Services',
        image: '/cleaning_service.jpg',
        slug: 'painting-services',
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
  const [activeSection, setActiveSection] = useState('')

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
                          ? 'bg-pink-100 text-pink-600 font-semibold'
                          : category.subCategories && category.subCategories.some(sub => activeSection === sub.id)
                          ? 'bg-pink-50 text-pink-600 font-medium'
                          : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.title}</span>
                    </a>
                    {category.subCategories && (
                      <div className="ml-8 mt-1 space-y-1">
                        {category.subCategories.map((subCategory) => (
                          <a
                            key={subCategory.id}
                            href={`#${subCategory.id}`}
                            onClick={(e) => handleSidebarClick(e, subCategory.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                              activeSection === subCategory.id
                                ? 'bg-blue-100 text-blue-600 font-semibold'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            {subCategory.icon && <span className="text-lg">{subCategory.icon}</span>}
                            <span>{subCategory.title}</span>
                          </a>
                        ))}
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
                    {category.featured.map((service, index) => (
                     <Link
                          key={index}
                          href={`/services/${service.slug}`}
                          className="group relative overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-[4/3] relative">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 text-center">
                          <h3 className="font-semibold text-gray-900">
                            {service.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
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
                          className="flex items-center gap-2 text-left text-gray-700 hover:text-pink-600 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-pink-600" />
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
                        {subCategory.featured.map((service, index) => (
                         <Link
                              key={index}
                              href={`/services/${service.slug}`}
                              className="group relative overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow"
                          >
                            <div className="aspect-[4/3] relative">
                              <Image
                                src={service.image || "/placeholder.svg"}
                                alt={service.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-4 text-center">
                              <h3 className="font-semibold text-gray-900">
                                {service.title}
                              </h3>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* All Services List */}
                    {subCategory.services && subCategory.services.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          All {subCategory.title.toLowerCase()} services
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {subCategory.services.map((service, index) => (
                            <Link
                              key={index}
                              href={`/services/${service.slug}`}
                              className="flex items-center gap-2 text-left text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-600" />
                              <span>{service.title}</span>
                            </Link>
                          ))}
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
