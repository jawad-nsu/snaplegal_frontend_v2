'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { MapPin, Search, ShoppingCart, User, LayoutDashboard, Menu, X, Package, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  
  // Check if user is authenticated using NextAuth session
  const isAuthenticated = !!session
  const isLoading = status === 'loading'

  // Check if user is vendor/partner
  const isVendor = session?.user?.type === 'PARTNER'

  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Sync cart count from localStorage (key matches cart/cart page)
  const updateCartCount = () => {
    if (typeof window === 'undefined') return
    try {
      const cartKey = 'snaplegal_cart'
      const stored = localStorage.getItem(cartKey)
      const count = stored ? (JSON.parse(stored) as unknown[]).length : 0
      setCartCount(count)
    } catch {
      setCartCount(0)
    }
  }

  useEffect(() => {
    updateCartCount()
    const onCartUpdate = () => updateCartCount()
    window.addEventListener('snaplegal_cart_updated', onCartUpdate)
    window.addEventListener('storage', onCartUpdate)
    return () => {
      window.removeEventListener('snaplegal_cart_updated', onCartUpdate)
      window.removeEventListener('storage', onCartUpdate)
    }
  }, [])

  // Check if we're on sign in or sign up pages
  const isAuthPage = pathname === '/signin' || pathname === '/signup'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    if (showProfileDropdown || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown, showMobileMenu])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg sm:text-xl font-bold text-gray-900">SnapLegal</span>
          </Link>

          {/* Search Bar - Mobile */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-neutral)]">
              <Input
                placeholder="Search services..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm py-2 h-9"
              />
              <Button 
                className="bg-[var(--color-primary)] hover:opacity-90 text-white rounded-none border-0 px-2 sm:px-3 h-9"
                onClick={() => {
                  // Add search functionality here if needed
                }}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Menu Icon */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left Section - Logo and Location */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
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
                placeholder="Find your consultant here, e.g., Legal, Business, TAX..."
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
                            onClick={async () => {
                              setShowProfileDropdown(false)
                              await signOut({ redirect: true, callbackUrl: '/' })
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
                            onClick={async () => {
                              setShowProfileDropdown(false)
                              await signOut({ redirect: true, callbackUrl: '/' })
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
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden border-t border-gray-200 bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 space-y-1">
            {/* Location */}
            <button
              onClick={() => {
                setShowMobileMenu(false)
                // Add location change functionality
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MapPin className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
              <span className="font-medium">Gulshan</span>
            </button>

            {/* All Services */}
            <button
              onClick={() => {
                router.push('/all-services')
                setShowMobileMenu(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
              <span className="font-medium">All Services</span>
            </button>

            {/* Account / Sign In */}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    router.push('/account')
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                  <span className="font-medium">Account</span>
                </button>
                {!isVendor && (
                  <>
                    <button
                      onClick={() => {
                        router.push('/account/service-orders')
                        setShowMobileMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Package className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                      <span className="font-medium">Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/cart')
                        setShowMobileMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors relative"
                    >
                      <ShoppingCart className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                      <span className="font-medium">Cart</span>
                      {cartCount > 0 && (
                        <span className="ml-auto bg-[var(--color-primary)] text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </button>
                  </>
                )}
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={async () => {
                    setShowMobileMenu(false)
                    await signOut({ redirect: true, callbackUrl: '/' })
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="font-medium">{isVendor ? 'Log Out' : 'Sign Out'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  router.push(pathname === '/signin' ? '/signup' : '/signin')
                  setShowMobileMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                <span className="font-medium">{pathname === '/signin' ? 'Sign Up' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

