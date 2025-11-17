'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const serviceCategories = [
  {
    id: 'ac-repair',
    title: 'AC Repair Services',
    featured: [
      {
        title: 'AC Servicing',
        image: '/plumbing.jpg',
        slug: 'ac-servicing',
      },
      {
        title: 'AC Doctor',
        image: '/moving_service.webp',
        slug: 'home-cleaning',
      },
      {
        title: 'AC Combo Packages',
        image: '/cleaning_service.jpg',
        slug: 'home-cleaning',
      },
    ],
    services: [
      'AC Cooling Problem',
      'AC Installation & Uninstallation',
      'VRF AC Service',
    ],
  },
  {
    id: 'appliance-repair',
    title: 'Appliance Repair',
    featured: [
      {
        title: 'Exclusive Combo Offer',
        image: '/gas-cooker-repair.jpg',
        slug: 'home-cleaning',
      },
      {
        title: 'Oven Services',
        image: '/plumbing.jpg',
        slug: 'home-cleaning',
      },
      {
        title: 'TV Services',
        image: '/moving_service.webp',
        slug: 'home-cleaning',
      },
    ],
    services: [
      'Refrigerator Services',
      'Washing Machine Services',
      'Kitchen Hood Services',
      'IPS Services',
      'Treadmill Services',
      'Water Purifier Services',
      'Geyser Services',
      'Gas Stove/Burner Services',
      'Generator Services',
    ],
  },
  {
    id: 'cleaning-solution',
    title: 'Cleaning Solution',
    featured: [
      {
        title: 'Home Cleaning',
        image: '/cleaning_service.jpg',
        slug: 'home-cleaning',
      },
      {
        title: 'Cleaning Combo',
        image: '/gas-cooker-repair.jpg',
        slug: 'home-cleaning',
      },
      {
        title: 'Furniture & Carpet Cleaning',
        image: '/plumbing.jpg',
        slug: 'home-cleaning',
      },
    ],
    services: [
      'Outdoor Cleaning',
      'Appliance Cleaning',
      'Tank & Pipe Cleaning',
      'Special Cleaning Combo',
    ],
  },
  {
    id: 'beauty-wellness',
    title: 'Beauty & Wellness',
    featured: [
      {
        title: 'Nail Extension',
        image: '/plumbing.jpg',
        slug: 'home-cleaning',
      },
      {
        title: 'Salon Care',
        image: '/moving_service.webp',
        slug: 'home-cleaning',
      },
      {
        title: 'At-home Hair Studio',
        image: '/cleaning_service.jpg',
        slug: 'home-cleaning',
      },
    ],
    services: [
      'Makeup',
      'Spa & Massage',
      'Hair Care',
      'Skin Care',
      'Nail Care',
      'Bridal Package',
      'Body Treatment',
      'Waxing',
    ],
  },
  {
    id: 'shifting-moving',
    title: 'Shifting & Moving',
    featured: [
      {
        title: 'House Shifting',
        image: '/moving_service.webp',
        slug: 'home-cleaning',
      },
      {
        title: 'Office Shifting',
        image: '/gas-cooker-repair.jpg',
        slug: 'home-cleaning',
      },
      {
        title: 'Local Shifting',
        image: '/moving_service.webp',
        slug: 'home-cleaning',
      },
    ],
    services: [
      'Packing Service',
      'Inter-city Shifting',
      'International Shifting',
    ],
  },
  {
    id: 'home-repair',
    title: 'Home Repair',
    featured: [
      {
        title: 'Plumbing Services',
        image: '/plumbing.jpg',
        slug: 'home-cleaning',
      },
      {
        title: 'Electrical Services',
        image: '/moving_service.webp',
        slug: 'home-cleaning',
      },
      {
        title: 'Painting Services',
        image: '/cleaning_service.jpg',
        slug: 'home-cleaning',
      },
    ],
    services: [
      'Carpentry Services',
      'Sanitary Services',
      'Interior Design',
      'Door & Lock Services',
      'Welding Services',
      'Glass & Glazing',
    ],
  },
]

export default function AllServicesPage() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -70% 0px',
      }
    )

    serviceCategories.forEach((category) => {
      const element = document.getElementById(category.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              Sheba.xyz
            </Link>
            <div className="flex items-center gap-4">
              <button className="text-gray-700 hover:text-pink-600">
                Login
              </button>
              <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Services</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {serviceCategories.map((category) => (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    onClick={(e) => handleSidebarClick(e, category.id)}
                    className={`block px-3 py-2 rounded-md transition-colors ${
                      activeSection === category.id
                        ? 'bg-pink-100 text-pink-600 font-semibold'
                        : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    {category.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Service Categories */}
          <div className="flex-1 space-y-12">
            {serviceCategories.map((category) => (
              <section key={category.id} id={category.id} className="bg-white rounded-lg p-6 shadow-sm">
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
                        <span>{service}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Sheba.xyz</h3>
              <p className="text-gray-400">
                Your Personal Assistant for professional services at home
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    AC Repair
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cleaning
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Beauty
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sheba.xyz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
