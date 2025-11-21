'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Search, ShoppingCart, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const router = useRouter()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Logo and Location */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                SnapLegal
              </div> */}
              <span className="text-xl font-bold text-gray-900">SnapLegal</span>
            </Link>
            
            <button className="flex items-center gap-1 text-gray-700 hover:text-pink-600 transition-colors">
              <MapPin className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium">Gulshan</span>
            </button>

            <Button 
              variant="outline" 
              className="border-pink-600 text-pink-600 hover:bg-pink-50 font-medium"
              onClick={() => router.push('/all-services')}
            >
              All Services
            </Button>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-pink-600 focus-within:ring-2 focus-within:ring-pink-100">
              <Input
                placeholder="Find your service here e.g. AC, Car, Facial ..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button 
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-none border-0 px-4"
                onClick={() => {
                  // Add search functionality here if needed
                }}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* <Button 
              variant="outline" 
              className="border-pink-600 text-pink-600 hover:bg-pink-50 font-medium"
            >
              Snap Pay
            </Button> */}
            
            <button 
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              onClick={() => router.push('/signin')}
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>
            
            <button 
              className="relative"
              onClick={() => router.push('/cart')}
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

