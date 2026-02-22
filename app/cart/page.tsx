'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Trash2, ChevronDown, Tag, FileText, ShoppingCart } from 'lucide-react'
import Navbar from '@/components/navbar'
import { LogoSpinner } from '@/components/logo-spinner'

interface CartItem {
  id: string
  parentService?: string
  serviceName: string
  serviceId?: string | null
  serviceSlug?: string
  packageName?: string
  image: string
  tonnage: string
  quantity: number
  price: number
  originalPrice: number
  discount: number
  date: string
  timeSlot: string
  selected: boolean
  whatsIncluded?: string
}

interface StoredCartItem {
  id: string
  serviceId?: string | null
  serviceSlug?: string
  serviceName: string
  packageName?: string
  image: string
  price: number
  originalPrice: number
  quantity: number
  tonnage?: string
  date?: string
  timeSlot?: string
  selected?: boolean
  whatsIncluded?: string
}

export default function CartPage() {
  const router = useRouter()
  const [selectAll, setSelectAll] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [notes, setNotes] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [isPromoExpanded, setIsPromoExpanded] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [appliedPromoDiscount, setAppliedPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isPromoValidating, setIsPromoValidating] = useState(false)

  // Function to map stored cart item to CartItem interface
  const mapStoredToCartItem = (stored: StoredCartItem): CartItem => {
    const discount = stored.originalPrice - stored.price
    let formattedDate = ''
    
    if (stored.date) {
      try {
        // Try to parse the date (could be ISO string or formatted string)
        const dateObj = new Date(stored.date)
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        } else {
          // If it's already formatted, use as is
          formattedDate = stored.date
        }
      } catch {
        formattedDate = stored.date
      }
    }
    
    return {
      id: stored.id,
      parentService: stored.packageName ? `Book a consultant for ${stored.serviceName}` : undefined,
      serviceName: stored.packageName || stored.serviceName,
      serviceId: stored.serviceId,
      serviceSlug: stored.serviceSlug,
      packageName: stored.packageName,
      image: stored.image || '/placeholder.svg',
      tonnage: stored.tonnage || '1-2.5 Ton',
      quantity: stored.quantity || 1,
      price: stored.price,
      originalPrice: stored.originalPrice,
      discount: discount > 0 ? discount : 0,
      date: formattedDate,
      timeSlot: stored.timeSlot || '',
      selected: stored.selected !== undefined ? stored.selected : true,
      whatsIncluded: stored.whatsIncluded,
    }
  }

  // Load cart items from localStorage on mount
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const cartKey = 'snaplegal_cart'
        const storedCart = localStorage.getItem(cartKey)
        
        if (storedCart) {
          const parsedCart: StoredCartItem[] = JSON.parse(storedCart)
          
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            const mappedItems = parsedCart.map(mapStoredToCartItem)
            setCartItems(mappedItems)
            setSelectAll(mappedItems.every(item => item.selected))
          } else {
            setCartItems([])
          }
        } else {
          setCartItems([])
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        setCartItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCartItems()
  }, [])

  // Load applied promo from localStorage on mount (one promo per cart)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem('snaplegal_cart_promo')
      if (stored) {
        const parsed = JSON.parse(stored) as { code: string; discount: number }
        if (parsed?.code && typeof parsed.discount === 'number' && parsed.discount >= 0) {
          setAppliedPromo(parsed.code)
          setAppliedPromoDiscount(parsed.discount)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Fetch and fill missing whatsIncluded from API for items that have serviceSlug
  const hydratedIdsRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (isLoading || cartItems.length === 0) return
    const itemsNeedingWhatsIncluded = cartItems.filter(
      (item) =>
        item.serviceSlug &&
        (!item.whatsIncluded || !item.whatsIncluded.trim()) &&
        !hydratedIdsRef.current.has(item.id)
    )
    if (itemsNeedingWhatsIncluded.length === 0) return

    let cancelled = false
    const fetchAndFill = async () => {
      for (const item of itemsNeedingWhatsIncluded) {
        if (cancelled || !item.serviceSlug) continue
        hydratedIdsRef.current.add(item.id)
        try {
          const res = await fetch(`/api/services/slug/${item.serviceSlug}`)
          if (!res.ok || cancelled) continue
          const data = await res.json()
          const service = data?.service
          if (!service?.packages && !service?.whatsIncluded) continue

          let whatsIncluded = ''
          if (Array.isArray(service.packages) && item.packageName) {
            const pkg = service.packages.find(
              (p: { name?: string; features?: string[] | string }) => p.name === item.packageName
            )
            if (pkg?.features) {
              whatsIncluded = Array.isArray(pkg.features) ? pkg.features.join('\n') : (typeof pkg.features === 'string' ? pkg.features : '')
            }
          }
          if (!whatsIncluded && service.whatsIncluded) {
            whatsIncluded = typeof service.whatsIncluded === 'string' ? service.whatsIncluded : (Array.isArray(service.whatsIncluded) ? service.whatsIncluded.join('\n') : '')
          }
          if (whatsIncluded.trim() && !cancelled) {
            setCartItems((prev) =>
              prev.map((i) => (i.id === item.id ? { ...i, whatsIncluded: whatsIncluded.trim() } : i))
            )
          }
        } catch {
          hydratedIdsRef.current.delete(item.id)
        }
      }
    }
    fetchAndFill()
    return () => { cancelled = true }
    // Intentionally omit cartItems to avoid re-running when we update whatsIncluded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, cartItems.length])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        const cartKey = 'snaplegal_cart'
        const itemsToStore: StoredCartItem[] = cartItems.map(item => {
          // Try to preserve the original date format if it exists
          let dateToStore = ''
          if (item.date) {
            // If date is already in a format like "16 Nov", keep it as is
            // Otherwise try to parse and convert to ISO
            try {
              const parsedDate = new Date(item.date)
              if (!isNaN(parsedDate.getTime())) {
                dateToStore = parsedDate.toISOString().split('T')[0]
              } else {
                dateToStore = item.date // Keep formatted string
              }
            } catch {
              dateToStore = item.date
            }
          }
          
          return {
            id: item.id,
            serviceId: item.serviceId ?? undefined,
            serviceSlug: item.serviceSlug,
            serviceName: item.packageName && item.parentService ? item.parentService.replace(/^Book a consultant for /, '') : item.serviceName,
            packageName: item.packageName,
            image: item.image,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity: item.quantity,
            tonnage: item.tonnage,
            date: dateToStore,
            timeSlot: item.timeSlot,
            selected: item.selected,
            whatsIncluded: item.whatsIncluded,
          }
        })
        
        if (itemsToStore.length > 0) {
          localStorage.setItem(cartKey, JSON.stringify(itemsToStore))
        } else {
          localStorage.removeItem(cartKey)
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('snaplegal_cart_updated'))
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cartItems, isLoading])

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setCartItems(items => items.map(item => ({ ...item, selected: newSelectAll })))
  }

  const handleItemSelect = (id: string) => {
    setCartItems(items => {
      const updated = items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
      setSelectAll(updated.every(item => item.selected))
      return updated
    })
  }

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  const handleDelete = (id: string) => {
    setCartItems(items => {
      const updated = items.filter(item => item.id !== id)
      setSelectAll(updated.length > 0 && updated.every(item => item.selected))
      return updated
    })
  }

  const handleApplyPromo = async () => {
    const code = promoCode.trim()
    if (!code) return
    setPromoError(null)
    setIsPromoValidating(true)
    try {
      const selectedItemsForTotal = cartItems.filter(item => item.selected)
      const subtotalForValidate = selectedItemsForTotal.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const res = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: subtotalForValidate }),
      })
      const data = await res.json()
      if (data.valid && typeof data.discount === 'number') {
        setAppliedPromo(data.code || code)
        setAppliedPromoDiscount(data.discount)
        setIsPromoExpanded(false)
        setPromoCode('')
        try {
          localStorage.setItem(
            'snaplegal_cart_promo',
            JSON.stringify({ code: data.code || code, discount: data.discount })
          )
        } catch {
          // ignore
        }
      } else {
        setAppliedPromo(null)
        setAppliedPromoDiscount(0)
        setPromoError(data.message || 'Invalid or expired promo code')
        try {
          localStorage.removeItem('snaplegal_cart_promo')
        } catch {
          // ignore
        }
      }
    } catch {
      setPromoError('Failed to validate promo code')
      setAppliedPromo(null)
      setAppliedPromoDiscount(0)
    } finally {
      setIsPromoValidating(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setAppliedPromoDiscount(0)
    setPromoCode('')
    setPromoError(null)
    try {
      localStorage.removeItem('snaplegal_cart_promo')
    } catch {
      // ignore
    }
  }

  const selectedItems = cartItems.filter(item => item.selected)
  const subtotalOriginal = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const totalDiscount = selectedItems.reduce((sum, item) => sum + item.discount * item.quantity, 0)
  const subtotal = subtotalOriginal - totalDiscount // discounted subtotal (what customer pays for items)
  const deliveryCharge = 0
  const total = Math.max(0, subtotal - appliedPromoDiscount + deliveryCharge)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LogoSpinner fullPage={false} message="Loading cart..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Home className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      Sharif H (+8801773241632)
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Delivery Address</p>
                  </div>
                </div>
                <Link 
                  href="#" 
                  className="text-[var(--color-primary)] hover:opacity-80 font-medium text-sm sm:text-base whitespace-nowrap sm:ml-4"
                >
                  Change
                </Link>
              </div>
            </div>

            {/* My Cart */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  My Cart ({cartItems.length})
                </h2>
                {cartItems.length > 0 && (
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">Select all items</span>
                    </label>
                    <button 
                      onClick={() => {
                        setCartItems([])
                        setSelectAll(false)
                      }}
                      className="text-gray-500 hover:text-red-600 p-1 sm:p-0"
                      aria-label="Clear all items"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Items */}
              {cartItems.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">Add services to your cart to get started</p>
                  <Link
                    href="/all-services"
                    className="inline-block bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
                  >
                    Browse Services
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    {item.parentService && (
                      <div className="mb-3 pb-3 border-b">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleItemSelect(item.id)}
                            className="w-4 h-4 sm:w-5 sm:h-5 accent-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)] flex-shrink-0"
                          />
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {item.parentService}
                          </span>
                        </label>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <label className="flex items-start gap-2 sm:gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleItemSelect(item.id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 accent-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)] mt-1 flex-shrink-0"
                        />
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 min-w-0 sm:grid sm:grid-cols-[1fr_minmax(280px,380px)] sm:gap-4">
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="relative w-full sm:w-24 sm:h-24 h-40 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={item.image}
                                alt={item.serviceName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1.5 text-sm sm:text-base break-words">
                                {item.serviceName} <span className="text-gray-500">× {item.quantity}</span>
                              </h3>
                            {/* <div className="mb-2">
                              <select
                                value={item.tonnage}
                                className="text-xs sm:text-sm border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full sm:w-auto"
                              >
                                <option>1-2.5 Ton</option>
                                <option>3-5 Ton</option>
                                <option>Above 5 Ton</option>
                              </select>
                            </div> */}
                            <div className="flex flex-col gap-0.5 mb-2">
                              {item.discount > 0 && (
                                <span className="inline-flex w-fit items-center rounded-md bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                                  {item.originalPrice > 0 && Math.round((item.discount / item.originalPrice) * 100) > 0
                                    ? `Save ${Math.round((item.discount / item.originalPrice) * 100)}%`
                                    : `Save ৳${Math.round(item.discount)}`}
                                </span>
                              )}
                              <span className="flex flex-wrap items-baseline gap-1.5">
                                <span className="text-sm sm:text-base font-bold text-gray-800">
                                  ৳{item.price.toFixed(2)}
                                </span>
                                {item.discount > 0 && (
                                  <span className="text-xs sm:text-sm text-red-500 line-through">
                                    ৳{item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </span>
                              {appliedPromo && item.discount > 0 && (
                                <span className="text-xs sm:text-sm text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded w-fit">
                                  {item.discount} BDT off
                                </span>
                              )}
                            </div>
                            {(item.date || item.timeSlot) && (
                              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                                {item.date && (
                                  <span className="flex items-center gap-1">
                                    <span className="font-medium">Date:</span>
                                    <span>{item.date}</span>
                                  </span>
                                )}
                                {item.timeSlot && (
                                  <span className="flex items-center gap-1">
                                    <span className="font-medium">Time:</span>
                                    <span>{item.timeSlot}</span>
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="px-3 sm:px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg font-medium min-w-[44px]"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="px-3 sm:px-4 py-2 min-w-[44px] text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="px-3 sm:px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg font-medium min-w-[44px]"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-700 active:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Delete item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:min-w-0 sm:flex-shrink-0 sm:border-l sm:border-gray-100 pl-0 sm:pl-4 pt-3 sm:pt-0 border-t border-gray-100 sm:border-t-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">What&apos;s included</p>
                          {item.whatsIncluded?.trim() ? (
                            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside max-h-32 overflow-y-auto flex flex-col">
                              {item.whatsIncluded.split('\n').filter((line) => line.trim()).map((line, i) => (
                                <li key={i} className="break-words block w-full">{line.trim()}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-400 italic">—</p>
                          )}
                        </div>
                      </div>
                      </label>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Payment summary</h3>
              
              {/* Itemized Breakdown */}
              {selectedItems.length > 0 && (
                <div className="space-y-2 mb-4 text-xs sm:text-sm max-h-40 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-baseline gap-2 text-gray-700">
                      <span className="text-gray-600 truncate">→ {item.serviceName} × {item.quantity}</span>
                      <span className="text-gray-700 font-medium shrink-0">৳{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 space-y-2.5 mb-4">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-right">৳{subtotal.toFixed(2)}</span>
                </div>
                {appliedPromoDiscount > 0 && (
                  <div className="flex justify-between items-baseline text-sm text-green-600">
                    <span>Promo ({appliedPromo})</span>
                    <span className="font-medium text-right">-৳{appliedPromoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-sm">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-medium text-right">৳{deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline text-base sm:text-lg font-bold pt-3 border-t mt-3">
                  <span>Amount to be paid</span>
                  <span className="text-[var(--color-primary)] text-right">৳{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-4 leading-relaxed">
                <p>* Prices are VAT exclusive</p>
                <p>* Price may vary depending on product availability</p>
              </div>

              {/* Add Promo & Offer */}
              <div className="border rounded-lg p-3 sm:p-4 mb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => !appliedPromo && setIsPromoExpanded(!isPromoExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Add promo & offer</span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--color-primary)]">
                    <span className="text-xs sm:text-sm">
                      {appliedPromo ? '1 offer' : '0 offers'}
                    </span>
                    {!appliedPromo && (
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${isPromoExpanded ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </div>
                </div>
                
                {appliedPromo ? (
                  <div className="mt-3 pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium text-green-600">{appliedPromo}</span>
                      <span className="text-xs sm:text-sm text-gray-500">Applied</span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : isPromoExpanded && (
                  <div className="mt-3 pt-3 border-t">
                    {promoError && (
                      <p className="text-xs sm:text-sm text-red-600 mb-2">{promoError}</p>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase())
                          setPromoError(null)
                        }}
                        placeholder="Enter promo code"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyPromo()
                          }
                        }}
                      />
                      <button
                        onClick={() => handleApplyPromo()}
                        disabled={!promoCode.trim() || isPromoValidating}
                        className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 active:opacity-75 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isPromoValidating ? 'Checking…' : 'Apply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Notes */}
              <div className="border rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Add notes</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write comment here..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                  rows={3}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="mb-4">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    By placing order, I agree to the{' '}
                    <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:opacity-80 underline">
                      Terms & conditions
                    </Link>{' '}
                    &{' '}
                    <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:opacity-80 underline">
                      Privacy policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Proceed to Pay Button */}
              <button
                onClick={() => router.push('/checkout')}
                disabled={!agreeToTerms || selectedItems.length === 0}
                className="w-full bg-[var(--color-primary)] text-white py-3 sm:py-4 rounded-lg font-bold hover:opacity-90 active:opacity-75 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base shadow-md hover:shadow-lg disabled:shadow-none"
              >
                Proceed to pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

