'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Check, Loader2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

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

export default function BkashPaymentPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  // Generate order number on mount using lazy initialization
  const [orderNumber] = useState<string>(() => {
    // Generate order number in format: ORD-YYYYMMDD-HHMMSS-XXX
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    
    return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`
  })
  
  const [copied, setCopied] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [cartItems, setCartItems] = useState<StoredCartItem[]>([])

  // Load cart items from localStorage
  useEffect(() => {
    try {
      const cartKey = 'snaplegal_cart'
      const storedCart = localStorage.getItem(cartKey)
      
      if (storedCart) {
        const parsedCart: StoredCartItem[] = JSON.parse(storedCart)
        // Filter only selected items
        const selectedItems = parsedCart.filter(item => item.selected !== false)
        setCartItems(selectedItems)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  const handleCopyReference = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCompletePayment = async () => {
    // Check if user is authenticated
    if (status === 'loading') {
      return // Still loading session
    }

    if (!session?.user) {
      router.push('/signin?callbackUrl=/checkout/bkash')
      return
    }

    // Check if cart has items
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to your cart first.')
      router.push('/cart')
      return
    }

    setIsCreatingOrder(true)

    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        serviceId: item.serviceId || null,
        serviceName: item.packageName || item.serviceName,
        quantity: item.quantity || 1,
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        details: item.tonnage || null,
      }))

      // Get scheduled date/time from first item if available
      const firstItem = cartItems[0]
      let scheduledDate = null
      let scheduledTime = null
      
      if (firstItem?.date) {
        try {
          // Try to parse the date
          const dateObj = new Date(firstItem.date)
          if (!isNaN(dateObj.getTime())) {
            scheduledDate = dateObj.toISOString()
          }
        } catch {
          // Date parsing failed, ignore
        }
      }
      
      if (firstItem?.timeSlot) {
        scheduledTime = firstItem.timeSlot
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          paymentMethod: 'bKash',
          orderNumber: orderNumber,
          address: null, // Can be added later if needed
          scheduledDate: scheduledDate,
          scheduledTime: scheduledTime,
          notes: null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Clear cart after successful order creation
      localStorage.removeItem('snaplegal_cart')

      // Redirect to orders page
      router.push('/account/service-orders')
    } catch (error) {
      console.error('Error creating order:', error)
      alert(error instanceof Error ? error.message : 'Failed to create order. Please try again.')
      setIsCreatingOrder(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Back to Checkout</span>
          </Link>

          {/* Payment Information Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-white font-bold text-lg sm:text-xl">bKash</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Please send the payment to the merchant account using the details below.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Payment Type */}
              <div className="border-b pb-3 sm:pb-4">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Payment Type</div>
                <div className="text-base sm:text-lg font-semibold text-gray-900">Merchant</div>
              </div>

              {/* Number */}
              <div className="border-b pb-3 sm:pb-4">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Number</div>
                <div className="text-base sm:text-lg font-semibold text-gray-900">01681208097</div>
              </div>

              {/* Reference Number */}
              <div className="border-b pb-3 sm:pb-4">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Reference Number</div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-base sm:text-lg font-semibold text-gray-900 flex-1 break-all">
                    {orderNumber || 'Generating...'}
                  </div>
                  {orderNumber && (
                    <button
                      onClick={handleCopyReference}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-base font-semibold text-blue-900 mb-2 sm:mb-3">Payment Instructions</h2>
            <ol className="space-y-2 text-xs sm:text-sm text-blue-800 list-decimal list-inside">
              <li>Open your bKash app or dial *247#</li>
              <li>Go to &quot;Send Money&quot;</li>
              <li>Enter the merchant number: <strong>01681208097</strong></li>
              <li>Enter the amount you need to pay</li>
              <li>Enter the reference number: <strong>{orderNumber || 'Your order number'}</strong></li>
              <li>Complete the transaction</li>
              <li>Keep the transaction ID for your records</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/checkout"
              className="flex-1 text-center px-4 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Back to Checkout
            </Link>
            <button
              onClick={handleCompletePayment}
              disabled={isCreatingOrder || status === 'loading' || cartItems.length === 0}
              className="flex-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreatingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Order...</span>
                </>
              ) : (
                <span>I&apos;ve Completed Payment</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

