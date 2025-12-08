'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { MapPin, Search, ShoppingCart, User, LayoutDashboard } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  
  // Check if user is authenticated (in production, this would come from auth context/provider)
  // Initialize from localStorage if available (client-side only)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      const user = localStorage.getItem('user')
      return !!(token || user)
    }
    return false
  })

  // Check if user is vendor
  const [isVendor, setIsVendor] = useState(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if (user) {
        try {
          const userData = JSON.parse(user)
          return userData.type === 'partner'
        } catch {
          return false
        }
      }
    }
    return false
  })

  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  // Check if we're on sign in or sign up pages
  const isAuthPage = pathname === '/signin' || pathname === '/signup'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown])

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
            
            <button className="flex items-center gap-1 text-gray-700 hover:text-[var(--color-primary)] transition-colors">
              <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm font-medium">Gulshan</span>
            </button>

            <Button 
              variant="outline" 
              className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-neutral)] font-medium"
              onClick={() => router.push('/all-services')}
            >
              All Services
            </Button>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-neutral)]">
              <Input
                placeholder="Find your service here e.g. AC, Car, Facial ..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button 
                className="bg-[var(--color-primary)] hover:opacity-90 text-white rounded-none border-0 px-4"
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
            
            {/* Show Sign In/Sign Up button when not authenticated */}
            {!isAuthenticated && (
              <Button
                onClick={() => router.push(pathname === '/signin' ? '/signup' : '/signin')}
                className="bg-[var(--color-primary)] hover:opacity-90 text-white font-medium"
              >
                {pathname === '/signin' ? 'Sign Up' : 'Sign In'}
              </Button>
            )}
            
            {/* Show profile icon when authenticated and not on auth pages */}
            {isAuthenticated && !isAuthPage && (
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <User className="w-5 h-5 text-gray-700" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      {isVendor ? (
                        // Vendor dropdown: Profile and Log Out
                        <>
                          <button
                            onClick={() => {
                              router.push('/vendor/profile')
                              setShowProfileDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Profile
                          </button>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={() => {
                              // Clear authentication data
                              localStorage.removeItem('authToken')
                              localStorage.removeItem('user')
                              setIsAuthenticated(false)
                              setIsVendor(false)
                              setShowProfileDropdown(false)
                              // Redirect to home page
                              router.push('/')
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Log Out
                          </button>
                        </>
                      ) : (
                        // Regular user dropdown: Profile, My Orders, and Sign Out
                        <>
                          <button
                            onClick={() => {
                              router.push('/account')
                              setShowProfileDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              router.push('/account/service-orders')
                              setShowProfileDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            My Orders
                          </button>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={() => {
                              // Clear authentication data
                              localStorage.removeItem('authToken')
                              localStorage.removeItem('user')
                              setIsAuthenticated(false)
                              setIsVendor(false)
                              setShowProfileDropdown(false)
                              // Redirect to home page
                              router.push('/')
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Sign Out
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Show cart/dashboard icon when authenticated */}
            {isAuthenticated && (
              <>
                {isVendor ? (
                  // Vendor: Dashboard icon
                  <button 
                    className="relative"
                    onClick={() => router.push('/vendor')}
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-6 h-6 text-gray-700" />
                  </button>
                ) : (
                  // Regular user: Cart icon
                  <button 
                    className="relative"
                    onClick={() => router.push('/cart')}
                  >
                    <ShoppingCart className="w-6 h-6 text-gray-700" />
                    <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      2
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

