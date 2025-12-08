'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Trash2, ChevronDown, Tag, FileText } from 'lucide-react'
import Navbar from '@/components/navbar'

interface CartItem {
  id: string
  parentService?: string
  serviceName: string
  image: string
  tonnage: string
  quantity: number
  price: number
  originalPrice: number
  discount: number
  date: string
  timeSlot: string
  selected: boolean
}

export default function CartPage() {
  const router = useRouter()
  const [selectAll, setSelectAll] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      parentService: 'Hire AC Technician for',
      serviceName: 'AC Check Up',
      image: '/plumbing.jpg',
      tonnage: '1-2.5 Ton',
      quantity: 1,
      price: 382.625,
      originalPrice: 757.625,
      discount: 375,
      date: '16 Nov',
      timeSlot: '9:00 AM - 10:00 AM',
      selected: true,
    },
    {
      id: '2',
      serviceName: 'AC Check Up',
      image: '/plumbing.jpg',
      tonnage: '1-2.5 Ton',
      quantity: 1,
      price: 382.625,
      originalPrice: 757.625,
      discount: 375,
      date: '16 Nov',
      timeSlot: '10:00 AM - 11:00 AM',
      selected: true,
    },
  ])
  const [notes, setNotes] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

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
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const selectedItems = cartItems.filter(item => item.selected)
  const subtotal = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const totalDiscount = selectedItems.reduce((sum, item) => sum + item.discount * item.quantity, 0)
  const deliveryCharge = 0
  const total = subtotal - totalDiscount + deliveryCharge

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <p className="font-semibold text-gray-900">Sharif H (+8801773241632)</p>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                  </div>
                </div>
                <Link href="#" className="text-[var(--color-primary)] hover:opacity-80 font-medium">
                  Change
                </Link>
              </div>
            </div>

            {/* My Cart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Cart ({cartItems.length})</h2>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-gray-700">Select all items</span>
                  </label>
                  <button className="text-gray-500 hover:text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    {item.parentService && (
                      <div className="mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleItemSelect(item.id)}
                            className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)]"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {item.parentService}
                          </span>
                        </label>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleItemSelect(item.id)}
                          className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)]"
                        />
                        <div className="flex gap-4 flex-1">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.serviceName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.serviceName} X {item.quantity}
                            </h3>
                            <div className="mb-2">
                              <select
                                value={item.tonnage}
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              >
                                <option>1-2.5 Ton</option>
                                <option>3-5 Ton</option>
                                <option>Above 5 Ton</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold text-green-600">
                                ৳{item.price.toFixed(3)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ৳{item.originalPrice.toFixed(3)}
                              </span>
                              <span className="text-sm text-red-600 font-medium">
                                {item.discount} BDT off
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <span>{item.date},</span>
                              <span>{item.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 border rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  −
                                </button>
                                <span className="px-3 py-1">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment summary</h3>
              
              {/* Itemized Breakdown */}
              <div className="space-y-2 mb-4 text-sm">
                {selectedItems.map((item) => (
                  <div key={item.id} className="text-gray-700">
                    {item.parentService && (
                      <div className="font-medium mb-1">{item.parentService}</div>
                    )}
                    <div className="ml-4 text-gray-600">
                      → {item.serviceName} x {item.quantity} {item.tonnage} - ৳
                      {item.originalPrice.toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-medium">৳{deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount!</span>
                  <span className="font-medium text-green-600">৳{totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Amount to be paid</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p>* Prices are VAT exclusive</p>
                <p>* Price may vary depending on product availability</p>
              </div>

              {/* Add Promo & Offer */}
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Add promo & offer</span>
                  </div>
                    <div className="flex items-center gap-1 text-[var(--color-primary)]">
                      <span className="text-sm">0 offers</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
              </div>

              {/* Add Notes */}
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Add notes</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write comment here..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
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
                    className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)] mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    By placing order, I agree to the{' '}
                    <Link href="#" className="text-[var(--color-primary)] hover:opacity-80">
                      Terms & conditions
                    </Link>{' '}
                    &{' '}
                    <Link href="#" className="text-[var(--color-primary)] hover:opacity-80">
                      Privacy policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Proceed to Pay Button */}
              <button
                onClick={() => router.push('/checkout')}
                disabled={!agreeToTerms || selectedItems.length === 0}
                className="w-full bg-[var(--color-primary)] text-white py-4 rounded-lg font-bold hover:opacity-90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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

