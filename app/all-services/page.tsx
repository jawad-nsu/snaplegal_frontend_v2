'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Clock } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

// Helper function to convert title to slug
const titleToSlug = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Types for API responses
interface Category {
  id: string
  title: string
  icon: string
  status: string
  serialNumber?: number | null
}

interface SubCategory {
  id: string
  title: string
  icon: string
  categoryId: string
  status: string
  serialNumber?: number | null
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
  status: string
}

interface ServiceCategory {
  id: string
  title: string
  icon: string
  featured?: Array<{
    title: string
    image: string
    slug: string
    rating: string
    description: string
    deliveryTime: string
    startingPrice: string
  }>
  subCategories?: Array<{
    id: string
    title: string
    icon: string
    featured?: Array<{
      title: string
      image: string
      slug: string
      rating: string
      description: string
      deliveryTime: string
      startingPrice: string
    }>
    services: Array<{
      title: string
      slug: string
    }>
  }>
  services: Array<{
    title: string
    slug: string
  }>
}


export default function AllServicesPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('')
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [categoriesRes, subcategoriesRes, servicesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/subcategories'),
          fetch('/api/services'),
        ])

        if (!categoriesRes.ok || !subcategoriesRes.ok || !servicesRes.ok) {
          throw new Error('Failed to fetch data from server')
        }

        const categoriesData = await categoriesRes.json()
        const subcategoriesData = await subcategoriesRes.json()
        const servicesData = await servicesRes.json()

        if (!categoriesData.success || !subcategoriesData.success || !servicesData.success) {
          throw new Error('Invalid response from server')
        }

        const categories: Category[] = categoriesData.categories.filter((c: Category) => c.status === 'active')
        const subcategories: SubCategory[] = subcategoriesData.subcategories.filter((s: SubCategory) => s.status === 'active')
        const services: Service[] = servicesData.services.filter((s: Service) => s.status === 'active')

        // Transform data to match component structure
        const transformedCategories: ServiceCategory[] = categories.map((category) => {
          // Get subcategories for this category
          const categorySubcategories = subcategories.filter(
            (sub) => sub.categoryId === category.id
          )

          // Get services for this category (not in a subcategory)
          const categoryServices = services.filter(
            (service) => service.categoryId === category.id && !service.subCategoryId
          )

          // Get services for each subcategory
          // Sort subcategories by serialNumber if available
          const sortedSubcategories = [...categorySubcategories].sort((a, b) => {
            if (a.serialNumber !== null && a.serialNumber !== undefined && 
                b.serialNumber !== null && b.serialNumber !== undefined) {
              return a.serialNumber - b.serialNumber
            }
            return a.title.localeCompare(b.title)
          })

          const subCategoriesWithServices = sortedSubcategories.map((subCategory) => {
            const subCategoryServices = services.filter(
              (service) => service.subCategoryId === subCategory.id
            )

            // First 3 services as featured
            const featured = subCategoryServices.slice(0, 3).map((service) => ({
              title: service.title,
              image: service.image || '/placeholder.svg',
              slug: service.slug,
              rating: service.rating || '0',
              description: service.description || '',
              deliveryTime: service.deliveryTime || '',
              startingPrice: service.startingPrice || '',
            }))

            // Remaining services as list
            const servicesList = subCategoryServices.slice(3).map((service) => ({
              title: service.title,
              slug: service.slug,
            }))

            return {
              id: subCategory.id,
              title: subCategory.title,
              icon: subCategory.icon || '',
              featured: featured.length > 0 ? featured : undefined,
              services: servicesList,
            }
          })

          // First 3 services as featured for category
          const featured = categoryServices.slice(0, 3).map((service) => ({
            title: service.title,
            image: service.image || '/placeholder.svg',
            slug: service.slug,
            rating: service.rating || '0',
            description: service.description || '',
            deliveryTime: service.deliveryTime || '',
            startingPrice: service.startingPrice || '',
          }))

          // Remaining services as list
          const servicesList = categoryServices.slice(3).map((service) => ({
            title: service.title,
            slug: service.slug,
          }))

          return {
            id: category.id,
            title: category.title,
            icon: category.icon || '',
            featured: featured.length > 0 ? featured : undefined,
            subCategories: subCategoriesWithServices.length > 0 ? subCategoriesWithServices : undefined,
            services: servicesList,
          }
        })

        // Sort categories by serialNumber if available, otherwise by title
        transformedCategories.sort((a, b) => {
          const categoryA = categories.find((c) => c.id === a.id)
          const categoryB = categories.find((c) => c.id === b.id)
          if (categoryA?.serialNumber !== null && categoryA?.serialNumber !== undefined && 
              categoryB?.serialNumber !== null && categoryB?.serialNumber !== undefined) {
            return categoryA.serialNumber! - categoryB.serialNumber!
          }
          return a.title.localeCompare(b.title)
        })

        setServiceCategories(transformedCategories)
      } catch (err) {
        console.error('Error fetching services:', err)
        setError(err instanceof Error ? err.message : 'Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to convert service title to slug
  const getServiceSlug = (title: string): string => {
    // Try to find the slug from the service categories
    for (const category of serviceCategories) {
      if (category.featured) {
        const found = category.featured.find((s) => s.title === title)
        if (found) return found.slug
      }
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          if (subCategory.featured) {
            const found = subCategory.featured.find((s) => s.title === title)
            if (found) return found.slug
          }
        }
      }
    }
    // Fallback to generating slug from title
    return titleToSlug(title)
  }

  const handleBookNow = (e: React.MouseEvent, serviceTitle: string) => {
    e.stopPropagation() // Prevent card onClick from firing
    const slug = getServiceSlug(serviceTitle)
    router.push(`/services/${slug}`)
  }

  useEffect(() => {
    if (serviceCategories.length === 0) return

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
  }, [serviceCategories])

  const handleSidebarClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryId: string) => {
    e.preventDefault()
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">All Services</h1>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm lg:sticky lg:top-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Categories</h3>
              <nav className="space-y-1">
                {serviceCategories.map((category) => (
                  <div key={category.id}>
                    <a
                      href={`#${category.id}`}
                      onClick={(e) => handleSidebarClick(e, category.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                        activeSection === category.id && (!category.subCategories || !category.subCategories.some(sub => activeSection === sub.id))
                          ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-semibold'
                          : category.subCategories && category.subCategories.some(sub => activeSection === sub.id)
                          ? 'bg-[var(--color-neutral)] text-[var(--color-primary)] font-medium'
                          : 'text-gray-700 hover:bg-[var(--color-neutral)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{category.icon}</span>
                      <span>{category.title}</span>
                    </a>
                    {category.subCategories && (
                      <div className="ml-6 sm:ml-8 mt-1 space-y-1">
                        {category.subCategories.map((subCategory) => (
                          <a
                            key={subCategory.id}
                            href={`#${subCategory.id}`}
                            onClick={(e) => handleSidebarClick(e, subCategory.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                              activeSection === subCategory.id
                                ? 'bg-blue-100 text-blue-600 font-semibold'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            {subCategory.icon && <span className="text-base sm:text-lg">{subCategory.icon}</span>}
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
          <div className="flex-1 space-y-8 sm:space-y-12">
            {serviceCategories.map((category) => (
              <div key={category.id} className="space-y-8 sm:space-y-12">
                <section id={category.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  {/* Category Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {category.title}
                  </h2>

                  {/* Featured Services Grid */}
                  {category.featured && category.featured.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                          <div className="relative h-44 sm:h-56 overflow-hidden p-1.5 sm:p-3">
                            <div className="relative h-full w-full rounded-xl overflow-hidden">
                              <Image
                                src={service.image || "/placeholder.svg"}
                                alt={service.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </div>
                          <div className="p-3 sm:p-5">
                            <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-1.5 sm:gap-2">
                              <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-tight flex-1">{service.title}</h3>
                              {serviceWithDetails.rating && (
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0">
                                  <Star size={14} className="fill-yellow-400 text-yellow-400 sm:w-4 sm:h-4" />
                                  <span className="font-semibold text-xs sm:text-sm">{serviceWithDetails.rating}</span>
                                </div>
                              )}
                            </div>
                            {serviceWithDetails.description && (
                              <p className="hidden sm:block text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4 line-clamp-2">{serviceWithDetails.description}</p>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-0 mb-2.5 sm:mb-4">
                              {serviceWithDetails.deliveryTime && (
                                <span className="text-xs sm:text-sm text-gray-600">
                                  <Clock size={14} className="inline mr-1 sm:w-4 sm:h-4" />
                                  {serviceWithDetails.deliveryTime}
                                </span>
                              )}
                              {serviceWithDetails.startingPrice && (
                                <span className="text-xs sm:text-sm font-semibold text-gray-900">Starting at {serviceWithDetails.startingPrice}</span>
                              )}
                            </div>
                            <button 
                              onClick={(e) => handleBookNow(e, service.title)}
                              className="w-full mt-3 sm:mt-6 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
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
                  {category.services && category.services.length > 0 && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                        All {category.title.toLowerCase()} services
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {category.services.map((service, index) => (
                        <Link
                          key={index}
                          href={`/services/${service.slug}`}
                          className="flex items-center gap-2 text-left text-sm sm:text-base text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                          <span>{service.title}</span>
                        </Link>
                      ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Sub-Categories */}
                {category.subCategories && category.subCategories.map((subCategory) => (
                  <section key={subCategory.id} id={subCategory.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    {/* Sub-Category Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                      {subCategory.title}
                    </h2>

                    {/* Featured Services Grid */}
                    {subCategory.featured && subCategory.featured.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                              <div className="relative h-44 sm:h-56 overflow-hidden p-1.5 sm:p-3">
                                <div className="relative h-full w-full rounded-xl overflow-hidden">
                                  <Image
                                    src={service.image || "/placeholder.svg"}
                                    alt={service.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              </div>
                              <div className="p-3 sm:p-5">
                                <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-1.5 sm:gap-2">
                                  <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-tight flex-1">{service.title}</h3>
                                  {serviceWithDetails.rating && (
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0">
                                      <Star size={14} className="fill-yellow-400 text-yellow-400 sm:w-4 sm:h-4" />
                                      <span className="font-semibold text-xs sm:text-sm">{serviceWithDetails.rating}</span>
                                    </div>
                                  )}
                                </div>
                                {serviceWithDetails.description && (
                                  <p className="hidden sm:block text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4 line-clamp-2">{serviceWithDetails.description}</p>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-0 mb-2.5 sm:mb-4">
                                  {serviceWithDetails.deliveryTime && (
                                    <span className="text-xs sm:text-sm text-gray-600">
                                      <Clock size={14} className="inline mr-1 sm:w-4 sm:h-4" />
                                      {serviceWithDetails.deliveryTime}
                                    </span>
                                  )}
                                  {serviceWithDetails.startingPrice && (
                                    <span className="text-xs sm:text-sm font-semibold text-gray-900">Starting at {serviceWithDetails.startingPrice}</span>
                                  )}
                                </div>
                                <button 
                                  onClick={(e) => handleBookNow(e, service.title)}
                                  className="w-full mt-3 sm:mt-6 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
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
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          All {subCategory.title.toLowerCase()} services
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {subCategory.services.map((service, index) => (
                            <Link
                              key={index}
                              href={`/services/${service.slug}`}
                              className="flex items-center gap-2 text-left text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
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
