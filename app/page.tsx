'use client'

import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

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
    },
    {
      title: 'House Shifting Services',
      image: '/moving_service.webp',
    },
    {
      title: 'Home Cleaning',
      image: '/cleaning_service.jpg',
    },
    {
      title: 'Gas Stove/Burner Services',
      image: '/gas-cooker-repair.jpg',
    },
  ]

  const recommended = [
    {
      title: 'AC Servicing',
      image: '/plumbing.jpg',
    },
    {
      title: 'Home Cleaning',
      image: '/moving_service.webp',
    },
    {
      title: 'DigiGO',
      image: '/cleaning_service.jpg',
    },
    {
      title: 'On Demand Driver',
      image: '/gas-cooker-repair.jpg',
    },
  ]

  const trending = [
    {
      title: 'AC Servicing',
      image: '/plumbing.jpg',
    },
    {
      title: 'Home Cleaning',
      image: '/cleaning_service.jpg',
    },
    {
      title: 'Salon Care',
      image: '/gas-cooker-repair.jpg',
    },
  ]

  return (
    <div className="min-h-screen">
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
            Your Personal Assistant
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            One-stop solution for your services. Order any service, anytime.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-2 flex gap-2">
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
          </div>

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
                  className="flex flex-col items-center gap-2 min-w-[100px] hover:opacity-75 transition-opacity"
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
      <section className="container mx-auto max-w-4xl px-4 py-8">
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
      </section>

      {/* For Your Home */}
      <section className="container mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">For Your Home</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {homeServices.map((service, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              onClick={() => router.push('/all-services')}
            >
              <div className="relative h-48">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-sm">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="container mx-auto max-w-4xl px-4 py-8">
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
              className="group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-sm">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto max-w-4xl px-4 py-8">
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
              className="group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-sm">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
