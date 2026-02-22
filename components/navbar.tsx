'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { MapPin, Search, ShoppingCart, User, LayoutDashboard, Menu, X, Package, LogOut, ArrowRight, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchResultService {
  id: string
  title: string
  slug: string
  startingPrice: string
  categoryTitle?: string
  subCategoryTitle?: string
}

interface SearchResultCategory {
  id: string
  title: string
  icon: string
}

interface SearchResultSubcategory {
  id: string
  title: string
  categoryId: string
  categoryTitle: string
  icon: string
}

const SEARCH_DEBOUNCE_MS = 300
const MAX_DROPDOWN_RESULTS = 8
const MAX_CATEGORIES = 4
const MAX_SUBCATEGORIES = 4

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const searchDropdownRefMobile = useRef<HTMLDivElement>(null)
  const searchDropdownRefDesktop = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { data: session, status } = useSession()
  
  // Check if user is authenticated using NextAuth session
  const isAuthenticated = !!session
  const isLoading = status === 'loading'

  // Check if user is vendor/partner
  const isVendor = session?.user?.type === 'PARTNER'

  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResultService[]>([])
  const [searchCategories, setSearchCategories] = useState<SearchResultCategory[]>([])
  const [searchSubcategories, setSearchSubcategories] = useState<SearchResultSubcategory[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const fetchSearchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([])
      setSearchCategories([])
      setSearchSubcategories([])
      return
    }
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      if (data.success) {
        setSearchResults((data.services || []).slice(0, MAX_DROPDOWN_RESULTS))
        setSearchCategories((data.categories || []).slice(0, MAX_CATEGORIES))
        setSearchSubcategories((data.subcategories || []).slice(0, MAX_SUBCATEGORIES))
      } else {
        setSearchResults([])
        setSearchCategories([])
        setSearchSubcategories([])
      }
    } catch {
      setSearchResults([])
      setSearchCategories([])
      setSearchSubcategories([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2) {
      setSearchResults([])
      setSearchCategories([])
      setSearchSubcategories([])
      setShowSearchDropdown(false)
      return
    }
    setShowSearchDropdown(true)
    const t = setTimeout(() => fetchSearchResults(q), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchQuery, fetchSearchResults])

  const openDropdownIfHasQuery = () => {
    if (searchQuery.trim().length >= 2) setShowSearchDropdown(true)
  }

  const handleSearch = () => {
    const q = searchQuery.trim()
    if (q) {
      router.push(`/all-services?search=${encodeURIComponent(q)}`)
    } else {
      router.push('/all-services')
    }
    setShowSearchDropdown(false)
  }

  const goToService = (slug: string) => {
    setShowSearchDropdown(false)
    setSearchQuery('')
    router.push(`/services/${slug}`)
  }

  const goToAllResults = () => {
    const q = searchQuery.trim()
    setShowSearchDropdown(false)
    if (q) router.push(`/all-services?search=${encodeURIComponent(q)}`)
    else router.push('/all-services')
  }

  const goToCategory = (categoryId: string) => {
    setShowSearchDropdown(false)
    setSearchQuery('')
    router.push(`/all-services?category=${encodeURIComponent(categoryId)}`)
  }

  const goToSubcategory = (categoryId: string, subcategoryId: string) => {
    setShowSearchDropdown(false)
    setSearchQuery('')
    router.push(`/all-services?category=${encodeURIComponent(categoryId)}&subcategory=${encodeURIComponent(subcategoryId)}`)
  }

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
      const inSearch = searchDropdownRefMobile.current?.contains(event.target as Node) || searchDropdownRefDesktop.current?.contains(event.target as Node)
      if (!inSearch) setShowSearchDropdown(false)
    }

    if (showProfileDropdown || showMobileMenu || showSearchDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown, showMobileMenu, showSearchDropdown])

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showSearchDropdown) {
        if (searchCategories.length > 0) {
          e.preventDefault()
          goToCategory(searchCategories[0].id)
        } else if (searchSubcategories.length > 0) {
          e.preventDefault()
          const sub = searchSubcategories[0]
          goToSubcategory(sub.categoryId, sub.id)
        } else if (searchResults.length > 0) {
          e.preventDefault()
          goToService(searchResults[0].slug)
        } else {
          handleSearch()
        }
      } else {
        handleSearch()
      }
    }
    if (e.key === 'Escape') {
      setShowSearchDropdown(false)
      searchInputRef.current?.blur()
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo_without_tm.png"
              alt="SnapLegal"
              width={600}
              height={200}
              className="h-6 sm:h-12 w-auto max-w-full object-contain"
              priority
            />
          </Link>

          {/* Search Bar - Mobile */}
          <div className="flex-1 min-w-0 relative" ref={searchDropdownRefMobile}>
            <div className="flex items-center gap-1 sm:gap-2 bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-neutral)]">
              <Input
                ref={searchInputRef}
                placeholder="Search services..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm py-2 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={openDropdownIfHasQuery}
                onKeyDown={handleSearchKeyDown}
              />
              <Button 
                className="bg-[var(--color-primary)] hover:opacity-90 text-white rounded-none border-0 px-2 sm:px-3 h-9"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            {showSearchDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-[100] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden max-h-[min(70vh,320px)] overflow-y-auto">
                {searchLoading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Searching...</span>
                  </div>
                ) : (searchCategories.length > 0 || searchSubcategories.length > 0 || searchResults.length > 0) ? (
                  <>
                    {searchCategories.length > 0 && (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] uppercase tracking-wide">Categories</p>
                        </div>
                        <ul className="py-1 px-1.5 space-y-0.5">
                          {searchCategories.map((c) => (
                            <li key={c.id}>
                              <button
                                type="button"
                                onClick={() => goToCategory(c.id)}
                                className="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg border-l-4 border-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-200 group active:scale-[0.99]"
                              >
                                {c.icon && <span className="text-lg">{c.icon}</span>}
                                <span className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{c.title}</span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-primary)] flex-shrink-0 ml-auto" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {searchSubcategories.length > 0 && (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] uppercase tracking-wide">Subcategories</p>
                        </div>
                        <ul className="py-1 px-1.5 space-y-0.5">
                          {searchSubcategories.map((sub) => (
                            <li key={sub.id}>
                              <button
                                type="button"
                                onClick={() => goToSubcategory(sub.categoryId, sub.id)}
                                className="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg border-l-4 border-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-200 group active:scale-[0.99]"
                              >
                                {sub.icon && <span className="text-base">{sub.icon}</span>}
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{sub.title}</p>
                                  {sub.categoryTitle && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{sub.categoryTitle}</p>
                                  )}
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-primary)] flex-shrink-0" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {searchResults.length > 0 && (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] uppercase tracking-wide">Services</p>
                        </div>
                        <ul className="py-1 px-1.5 space-y-0.5">
                          {searchResults.map((s) => (
                            <li key={s.id}>
                              <button
                                type="button"
                                onClick={() => goToService(s.slug)}
                                className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 rounded-lg border-l-4 border-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-200 group active:scale-[0.99]"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{s.title}</p>
                                  {(s.categoryTitle || s.subCategoryTitle) && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 group-hover:text-[var(--color-primary)]/90 transition-colors">
                                      {[s.categoryTitle, s.subCategoryTitle].filter(Boolean).join(' › ')}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {s.startingPrice && (
                                    <span className="text-sm font-bold text-[var(--color-primary)] group-hover:text-[var(--color-primary)] group-hover:drop-shadow-sm">From {s.startingPrice}</span>
                                  )}
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
                      <button
                        type="button"
                        onClick={goToAllResults}
                        className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 text-[var(--color-primary)] font-semibold rounded-lg hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-200 group"
                      >
                        View all results for &quot;{searchQuery.trim()}&quot;
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No services or categories found. Try different keywords or{' '}
                    <button type="button" onClick={goToAllResults} className="text-[var(--color-primary)] font-medium hover:underline">
                      browse all services
                    </button>
                  </div>
                )}
              </div>
            )}
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
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/logo_without_tm.png"
                alt="SnapLegal"
                width={300}
                height={100}
                className="h-8 w-auto object-contain"
              />
            </Link>
            
            <button className="flex items-center gap-1 text-gray-700 hover:text-[var(--color-primary)] dark:text-white dark:hover:text-white transition-colors">
              <MapPin className="w-4 h-4 text-[var(--color-primary)] dark:text-white" />
              <span className="text-sm font-medium">Gulshan</span>
            </button>

            <Button 
              variant="outline" 
              className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-neutral)] dark:border-white dark:text-white dark:hover:bg-gray-700 font-medium"
              onClick={() => router.push('/all-services')}
            >
              All Services
            </Button>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 relative" ref={searchDropdownRefDesktop}>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-neutral)]">
              <Input
                placeholder="Find your consultant here, e.g., Legal, Business, TAX..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={openDropdownIfHasQuery}
                onKeyDown={handleSearchKeyDown}
              />
              <Button 
                className="bg-[var(--color-primary)] hover:opacity-90 text-white rounded-none border-0 px-4"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            {showSearchDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-[100] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden max-h-[min(70vh,360px)] overflow-y-auto">
                {searchLoading ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Searching...</span>
                  </div>
                ) : (searchCategories.length > 0 || searchSubcategories.length > 0 || searchResults.length > 0) ? (
                  <>
                    {searchCategories.length > 0 && (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] uppercase tracking-wide">Categories</p>
                        </div>
                        <ul className="py-1 px-1.5 space-y-0.5">
                          {searchCategories.map((c) => (
                            <li key={c.id}>
                              <button
                                type="button"
                                onClick={() => goToCategory(c.id)}
                                className="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg border-l-4 border-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-200 group active:scale-[0.99]"
                              >
                                {c.icon && <span className="text-lg">{c.icon}</span>}
                                <span className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{c.title}</span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-primary)] flex-shrink-0 ml-auto" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {searchSubcategories.length > 0 && (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] uppercase tracking-wide">Subcategories</p>
                        </div>
                        <ul className="py-1 px-1.5 space-y-0.5">
                          {searchSubcategories.map((sub) => (
                            <li key={sub.id}>
                              <button
                                type="button"
                                onClick={() => goToSubcategory(sub.categoryId, sub.id)}
                                className="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg border-l-4 border-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-200 group active:scale-[0.99]"
                              >
                                {sub.icon && <span className="text-base">{sub.icon}</span>}
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{sub.title}</p>
                                  {sub.categoryTitle && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{sub.categoryTitle}</p>
                                  )}
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-primary)] flex-shrink-0" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {searchResults.length > 0 && (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] uppercase tracking-wide">Services</p>
                        </div>
                        <ul className="py-1 px-1.5 space-y-0.5">
                          {searchResults.map((s) => (
                            <li key={s.id}>
                              <button
                                type="button"
                                onClick={() => goToService(s.slug)}
                                className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 rounded-lg border-l-4 border-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-200 group active:scale-[0.99]"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{s.title}</p>
                                  {(s.categoryTitle || s.subCategoryTitle) && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 group-hover:text-[var(--color-primary)]/90 transition-colors">
                                      {[s.categoryTitle, s.subCategoryTitle].filter(Boolean).join(' › ')}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {s.startingPrice && (
                                    <span className="text-sm font-bold text-[var(--color-primary)] group-hover:text-[var(--color-primary)] group-hover:drop-shadow-sm">From {s.startingPrice}</span>
                                  )}
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
                      <button
                        type="button"
                        onClick={goToAllResults}
                        className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 text-[var(--color-primary)] font-semibold rounded-lg hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20 transition-all duration-200 group"
                      >
                        View all results for &quot;{searchQuery.trim()}&quot;
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No services or categories found. Try different keywords or{' '}
                    <button type="button" onClick={goToAllResults} className="text-[var(--color-primary)] font-medium hover:underline">
                      browse all services
                    </button>
                  </div>
                )}
              </div>
            )}
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
          className="md:hidden border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 space-y-1">
            {/* Location */}
            <button
              onClick={() => {
                setShowMobileMenu(false)
                // Add location change functionality
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MapPin className="w-5 h-5 text-[var(--color-primary)] dark:text-white flex-shrink-0" />
              <span className="font-medium">Gulshan</span>
            </button>

            {/* All Services */}
            <button
              onClick={() => {
                router.push('/all-services')
                setShowMobileMenu(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 text-[var(--color-primary)] dark:text-white flex-shrink-0" />
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

