'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, ChevronRight, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Navbar from '@/components/navbar'

export default function HomePage() {
  const router = useRouter()
  const categories = [
    { name: 'AC Repair Services', icon: '🔧' },
    { name: 'Appliance Repair', icon: '🔌' },
    { name: 'Cleaning Solution', icon: '🧹' },
    { name: 'Beauty & Wellness', icon: '💅' },
    { name: 'Shifting', icon: '📦' },
    { name: 'Health & Care', icon: '❤️' },
  ]

  const homeServices = [
    {
      title: 'Plumbing & Sanitary Services',
      image: '/plumbing.jpg',
      rating: '4.8',
      description: 'Professional plumbing and sanitary services for your home. Expert technicians available 24/7.',
      deliveryTime: '2-4 hours',
      startingPrice: '৳500',
    },
    {
      title: 'House Shifting Services',
      image: '/moving_service.webp',
      rating: '4.9',
      description: 'Complete house shifting solutions with packing, moving, and unpacking services.',
      deliveryTime: 'Same day',
      startingPrice: '৳3,000',
    },
    {
      title: 'Home Cleaning',
      image: '/cleaning_service.jpg',
      rating: '4.7',
      description: 'Thorough home cleaning services including deep cleaning, regular maintenance, and more.',
      deliveryTime: '3-5 hours',
      startingPrice: '৳1,500',
    },
    {
      title: 'Gas Stove/Burner Services',
      image: '/gas-cooker-repair.jpg',
      rating: '4.6',
      description: 'Expert gas stove and burner repair, installation, and maintenance services.',
      deliveryTime: '1-2 hours',
      startingPrice: '৳400',
    },
  ]

  const recommended = [
    {
      title: 'AC Servicing',
      image: '/plumbing.jpg',
      rating: '4.9',
      description: 'Professional AC servicing and maintenance to keep your air conditioner running efficiently.',
      deliveryTime: '2-3 hours',
      startingPrice: '৳800',
    },
    {
      title: 'Home Cleaning',
      image: '/moving_service.webp',
      rating: '4.7',
      description: 'Comprehensive home cleaning services for a spotless and fresh living space.',
      deliveryTime: '3-5 hours',
      startingPrice: '৳1,500',
    },
    {
      title: 'DigiGO',
      image: '/cleaning_service.jpg',
      rating: '4.8',
      description: 'Digital services and solutions for all your tech needs and requirements.',
      deliveryTime: '1-2 hours',
      startingPrice: '৳600',
    },
    {
      title: 'On Demand Driver',
      image: '/gas-cooker-repair.jpg',
      rating: '4.6',
      description: 'Professional on-demand driver services for your transportation needs.',
      deliveryTime: '30 mins',
      startingPrice: '৳300',
    },
  ]

  const trending = [
    {
      title: 'AC Servicing',
      image: '/plumbing.jpg',
      rating: '4.9',
      description: 'Top-rated AC servicing with expert technicians and quality service guarantee.',
      deliveryTime: '2-3 hours',
      startingPrice: '৳800',
    },
    {
      title: 'Home Cleaning',
      image: '/cleaning_service.jpg',
      rating: '4.7',
      description: 'Popular home cleaning service trusted by thousands of satisfied customers.',
      deliveryTime: '3-5 hours',
      startingPrice: '৳1,500',
    },
    {
      title: 'Salon Care',
      image: '/gas-cooker-repair.jpg',
      rating: '4.8',
      description: 'Premium salon and beauty care services at your doorstep.',
      deliveryTime: '2-4 hours',
      startingPrice: '৳1,200',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/hero_banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Your Personal Consultant - in a Snap.
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            One-stop solution for your Legal services. Order any service, anytime.
          </p>

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
      <section className="relative -mt-16 pb-8">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg px-8 py-6 inline-block">
            <div className="flex items-center gap-8">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 min-w-[100px] hover:opacity-75 transition-opacity cursor-pointer"
                  onClick={() => router.push('/all-services')}
                >
                  <div className="text-4xl">{category.icon}</div>
                  <span className="text-xs text-center font-medium">{category.name}</span>
                </button>
              ))}
              <button className="flex items-center justify-center min-w-[50px]">
                <ChevronRight className="text-pink-600" size={32} />
              </button>
            </div>
          </div>
        </div>
      </section>

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

      {/* For Your Home */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">For Your Home</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {homeServices.map((service, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
              onClick={() => router.push('/all-services')}
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
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{service.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    <Clock size={16} className="inline mr-1" />
                    {service.deliveryTime}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">Starting at {service.startingPrice}</span>
                </div>
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recommended</h2>
          <button className="flex items-center gap-1 text-pink-600 hover:underline font-medium">
            View All <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.map((service, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
              onClick={() => router.push('/all-services')}
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
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{service.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    <Clock size={16} className="inline mr-1" />
                    {service.deliveryTime}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">Starting at {service.startingPrice}</span>
                </div>
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending</h2>
          <button className="flex items-center gap-1 text-pink-600 hover:underline font-medium">
            View All <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((service, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
              onClick={() => router.push('/all-services')}
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
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{service.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    <Clock size={16} className="inline mr-1" />
                    {service.deliveryTime}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">Starting at {service.startingPrice}</span>
                </div>
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      {/* Why Choose Us Section */}
      <section className="container mx-auto max-w-6xl  px-4 py-16">
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
            WHY CHOOSE US
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Because we care about your safety..
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-12 h-12 text-pink-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm1 14h-2v-1h2v1zm0-3h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">Ensuring</h3>
                <p className="text-gray-600">Masks</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-12 h-12 text-pink-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.1-.03-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">24/7</h3>
                <p className="text-gray-600">Support</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-12 h-12 text-pink-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9.5 14c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5zm5 .5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm6.5 3c0 1.11-.89 2-2 2H5c-1.11 0-2-.89-2-2V5c0-1.11.89-2 2-2h4c.55 0 1 .45 1 1v1h4V4c0-.55.45-1 1-1h4c1.11 0 2 .89 2 2v12.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">Sanitising</h3>
                <p className="text-gray-600">Hands & Equipment</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-12 h-12 text-pink-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21.16 7.26l-1.41-1.41-3.56 3.55 1.41 1.41s3.45-3.52 3.56-3.55zM11 3h2v5h-2V3zM6.4 10.81L7.81 9.4 4.26 5.84 2.84 7.26c.11.03 3.56 3.55 3.56 3.55zM20 14h-3.18C16.4 12.84 15.3 12 14 12h-4c-1.3 0-2.4.84-2.82 2H4c-.55 0-1 .45-1 1s.45 1 1 1h3.18c.42 1.16 1.52 2 2.82 2h4c1.3 0 2.4-.84 2.82-2H20c.55 0 1-.45 1-1s-.45-1-1-1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">Ensuring</h3>
                <p className="text-gray-600">Gloves</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/why-choose-us.webp"
                alt="Safety ensured workers in pink uniforms"
                width={600}
                height={400}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
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
        </div>
      </section>

       {/* CTA Section for Requesting Services */}
       <section className="container mx-auto max-w-6xl px-4 py-12">
        <div className="bg-gray-100 rounded-lg px-8 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Can&apos;t find your desired service? Let us know 24/7 in 16516.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg font-semibold">
              Book an Appointment
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-6 text-lg font-semibold"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.1-.03-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
              </svg>
              16516
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">CONTACT</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>16516 / 8809678001651</p>
                <p>info@sheba.xyz</p>
                <p className="mt-4 font-semibold text-white">Corporate Address</p>
                <p>M&S Tower, Plot: 2, Road: 11,</p>
                <p>Block: H, Banani, Dhaka</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">OTHER PAGES</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <Link href="#" className="block hover:text-white">Blog</Link>
                <Link href="#" className="block hover:text-white">Help</Link>
                <Link href="#" className="block hover:text-white">Terms of use</Link>
                <Link href="#" className="block hover:text-white">Privacy Policy</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">COMPANY</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <Link href="#" className="block hover:text-white">sManager</Link>
                <Link href="#" className="block hover:text-white">sBusiness</Link>
                <Link href="#" className="block hover:text-white">sDelivery</Link>
                <Link href="#" className="block hover:text-white">sBondhu</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">DOWNLOAD OUR APP</h3>
              <p className="text-sm text-gray-300 mb-4">
                Tackle your to-do list wherever you are with our mobile app & make your life easy.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>Copyright © 2025 Sheba Platform Limited | All Rights Reserved</p>
          </div>
        </div>
      </footer> */}

      {/* Comprehensive Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Categories Column */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/all-services#ac-services" className="text-gray-600 hover:text-pink-600 text-sm">
                    AC Repair Services
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#appliance" className="text-gray-600 hover:text-pink-600 text-sm">
                    Appliance Repair
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#cleaning" className="text-gray-600 hover:text-pink-600 text-sm">
                    Cleaning Solution
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#shifting" className="text-gray-600 hover:text-pink-600 text-sm">
                    Shifting
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#plumbing" className="text-gray-600 hover:text-pink-600 text-sm">
                    Plumbing & Sanitary
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#electrical" className="text-gray-600 hover:text-pink-600 text-sm">
                    Electrical Services
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#painting" className="text-gray-600 hover:text-pink-600 text-sm">
                    Painting
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#pest-control" className="text-gray-600 hover:text-pink-600 text-sm">
                    Pest Control
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#car-care" className="text-gray-600 hover:text-pink-600 text-sm">
                    Car Care
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#beauty" className="text-gray-600 hover:text-pink-600 text-sm">
                    Beauty & Wellness
                  </Link>
                </li>
                <li>
                  <Link href="/all-services#health" className="text-gray-600 hover:text-pink-600 text-sm">
                    Health & Care
                  </Link>
                </li>
                <li>
                  <Link href="/all-services" className="text-gray-600 hover:text-pink-600 text-sm">
                    All Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Customers Column */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">For Customers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/how-it-works" className="text-gray-600 hover:text-pink-600 text-sm">
                    How Sheba Works
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="text-gray-600 hover:text-pink-600 text-sm">
                    Customer Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/quality-guide" className="text-gray-600 hover:text-pink-600 text-sm">
                    Quality Guide
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-gray-600 hover:text-pink-600 text-sm">
                    Sheba Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-pink-600 text-sm">
                    Sheba Answers
                  </Link>
                </li>
                <li>
                  <Link href="/all-services" className="text-gray-600 hover:text-pink-600 text-sm">
                    Browse Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Professionals Column */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">For Professionals</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/become-provider" className="text-gray-600 hover:text-pink-600 text-sm">
                    Become a Service Provider
                  </Link>
                </li>
                <li>
                  <Link href="/partner-agency" className="text-gray-600 hover:text-pink-600 text-sm">
                    Partner as Agency
                  </Link>
                </li>
                <li>
                  <Link href="/provider-benefits" className="text-gray-600 hover:text-pink-600 text-sm">
                    Provider Benefits Program
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-gray-600 hover:text-pink-600 text-sm">
                    Community Hub
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="text-gray-600 hover:text-pink-600 text-sm">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-gray-600 hover:text-pink-600 text-sm">
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* Business Solutions Column */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Business Solutions</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/sheba-pro" className="text-gray-600 hover:text-pink-600 text-sm">
                    Sheba Pro
                  </Link>
                </li>
                <li>
                  <Link href="/project-management" className="text-gray-600 hover:text-pink-600 text-sm">
                    Project Management Service
                  </Link>
                </li>
                <li>
                  <Link href="/facility-management" className="text-gray-600 hover:text-pink-600 text-sm">
                    Facility Management
                  </Link>
                </li>
                <li>
                  <Link href="/corporate-services" className="text-gray-600 hover:text-pink-600 text-sm">
                    Corporate Services
                  </Link>
                </li>
                <li>
                  <Link href="/bulk-booking" className="text-gray-600 hover:text-pink-600 text-sm">
                    Bulk Booking
                  </Link>
                </li>
                <li>
                  <Link href="/sheba-pay" className="text-gray-600 hover:text-pink-600 text-sm">
                    Sheba Pay
                  </Link>
                </li>
                <li>
                  <Link href="/contact-sales" className="text-gray-600 hover:text-pink-600 text-sm">
                    Contact Sales
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-pink-600 text-sm">
                    About Sheba
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-pink-600 text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/trust-safety" className="text-gray-600 hover:text-pink-600 text-sm">
                    Trust & Safety
                  </Link>
                </li>
                <li>
                  <Link href="/social-impact" className="text-gray-600 hover:text-pink-600 text-sm">
                    Social Impact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 hover:text-pink-600 text-sm">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-pink-600 text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-pink-600 text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/partnerships" className="text-gray-600 hover:text-pink-600 text-sm">
                    Partnerships
                  </Link>
                </li>
                <li>
                  <Link href="/affiliates" className="text-gray-600 hover:text-pink-600 text-sm">
                    Affiliates
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-gray-600 hover:text-pink-600 text-sm">
                    Press & News
                  </Link>
                </li>
                <li>
                  <Link href="/investors" className="text-gray-600 hover:text-pink-600 text-sm">
                    Investor Relations
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo and Copyright */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-pink-600 text-white font-bold text-xl px-3 py-1 rounded">sheba</div>
                </div>
                <span className="text-gray-600 text-sm">© Sheba Platform Limited. 2025</span>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4">
                <Link href="https://tiktok.com" className="text-gray-600 hover:text-pink-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </Link>
                <Link href="https://instagram.com" className="text-gray-600 hover:text-pink-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.204.013-3.663.072-4.948.196-4.354 2.617-6.78 6.979-6.98 1.281-.057 1.689-.069 4.948-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                    <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </Link>
                <Link href="https://linkedin.com" className="text-gray-600 hover:text-pink-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
                <Link href="https://facebook.com" className="text-gray-600 hover:text-pink-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.372-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link href="https://pinterest.com" className="text-gray-600 hover:text-pink-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </Link>
                <Link href="https://twitter.com" className="text-gray-600 hover:text-pink-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
              </div>

              {/* Language and Settings */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-gray-600 hover:text-pink-600 text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  English
                </button>
                <button className="text-gray-600 hover:text-pink-600 text-sm font-medium">BDT ৳</button>
                <button className="text-gray-600 hover:text-pink-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  )
}
