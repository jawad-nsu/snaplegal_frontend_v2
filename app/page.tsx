'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, ChevronRight, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

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
                <ChevronRight className="text-[var(--color-primary)]" size={32} />
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
                <button className="w-full mt-6 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
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
          <button className="flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium">
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
                <button className="w-full mt-6 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
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
          <button className="flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium">
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
                <button className="w-full mt-6 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
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
                  className="w-12 h-12 text-[var(--color-primary)]"
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
                  className="w-12 h-12 text-[var(--color-primary)]"
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
                  className="w-12 h-12 text-[var(--color-primary)]"
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
                  className="w-12 h-12 text-[var(--color-primary)]"
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

       {/* CTA Section for Requesting Services */}
       <section className="container mx-auto max-w-6xl px-4 py-12">
        <div className="bg-gray-100 rounded-lg px-8 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Can&apos;t find your desired service? Let us know 24/7 in 16516.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-[var(--color-primary)] hover:opacity-90 text-white px-8 py-6 text-lg font-semibold">
              Book an Appointment
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-neutral)] px-8 py-6 text-lg font-semibold"
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
      <Footer />
      
    </div>
  )
}
