'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, ChevronRight, CreditCard, DollarSign, ArrowRight, ShoppingCart } from 'lucide-react'
import Navbar from '@/components/navbar'
import { LogoSpinner } from '@/components/logo-spinner'
import Link from 'next/link'

type PaymentMethod = 'bkash' | 'card' | 'cash'

interface CartItem {
  id: string
  parentService?: string
  serviceName: string
  tonnage: string
  quantity: number
  price: number
  originalPrice: number
  discount: number
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
}

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('bkash')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to map stored cart item to CartItem interface
  const mapStoredToCartItem = (stored: StoredCartItem): CartItem => {
    const discount = stored.originalPrice - stored.price
    
    return {
      id: stored.id,
      parentService: stored.packageName ? `Hire ${stored.serviceName} for` : undefined,
      serviceName: stored.packageName || stored.serviceName,
      tonnage: stored.tonnage || '1-2.5 Ton',
      quantity: stored.quantity || 1,
      price: stored.price,
      originalPrice: stored.originalPrice,
      discount: discount > 0 ? discount : 0,
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
            // Filter only selected items and map them
            const selectedItems = parsedCart
              .filter(item => item.selected !== false) // Include items where selected is true or undefined
              .map(mapStoredToCartItem)
            
            setCartItems(selectedItems)
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

  // Calculate totals based on cart items (already filtered to selected items)
  const selectedItems = cartItems
  const itemTotal = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const visitationFee = 0
  const deliveryCharge = 0
  const totalDiscount = selectedItems.reduce((sum, item) => sum + item.discount * item.quantity, 0)
  const subtotal = itemTotal + visitationFee + deliveryCharge - totalDiscount
  const amountToPay = subtotal

  // Redirect to cart if no items
  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Add services to your cart to proceed to checkout</p>
              <Link
                href="/cart"
                className="inline-block bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LogoSpinner fullPage={false} message="Loading checkout..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Payment Summary</h2>
            
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div className="text-sm sm:text-base font-bold text-gray-900">Amount to pay</div>
              <div className="text-base sm:text-lg font-medium text-gray-900">৳{amountToPay.toFixed(2)}</div>
            </div>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-1 text-[var(--color-primary)] hover:opacity-80 mb-3 sm:mb-4 text-sm sm:text-base"
            >
              {showBreakdown ? 'Hide breakdown' : 'Show breakdown'}
              {showBreakdown ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Cart Items - Shown when breakdown is expanded */}
            {showBreakdown && (
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between text-xs sm:text-sm">
                    <div className="flex-1 pr-2">
                      {item.parentService && (
                        <div className="text-gray-600 mb-1 text-[10px] sm:text-xs">{item.parentService}</div>
                      )}
                      <div className="text-gray-700 mb-1 font-medium">{item.serviceName}</div>
                      <div className="ml-1 space-y-0.5">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="break-words">{item.tonnage}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span>Quantity: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 flex-shrink-0">৳{(item.price * item.quantity).toFixed(3)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Totals - Always visible */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Item Total</span>
                <span className="font-medium text-gray-900">৳{itemTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Visitation Fee</span>
                <span className="font-medium text-gray-900">৳{visitationFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-medium text-gray-900">৳{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-medium text-green-600">-৳{totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold pt-2 border-t">
                <span className="text-gray-900">Subtotal</span>
                <span className="text-gray-900">৳{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[10px] sm:text-xs text-gray-500 space-y-0.5 sm:space-y-1">
              <p>* Prices are VAT exclusive</p>
              <p>* Price may vary depending on product availability</p>
            </div>
          </div>

          {/* Right Panel - Payment Methods */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Payment Methods</h2>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {/* bKash */}
              <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPayment === 'bkash' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  checked={selectedPayment === 'bkash'}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                />
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">bKash</span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">bKash</span>
                </div>
              </label>

              {/* Card */}
              <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPayment === 'card' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPayment === 'card'}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                />
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Card</span>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPayment === 'cash' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={selectedPayment === 'cash'}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                />
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Cash on Delivery</span>
                </div>
              </label>
            </div>

            {/* Proceed Button */}
            <button 
              onClick={() => {
                if (selectedPayment === 'bkash') {
                  router.push('/checkout/bkash')
                } else {
                  router.push('/account/service-orders/D-1108041')
                }
              }}
              className="group w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white py-3.5 sm:py-4 rounded-lg font-semibold sm:font-bold text-sm sm:text-base shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 hover:from-[var(--color-primary)] hover:to-[var(--color-primary)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

