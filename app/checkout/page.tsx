'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, ShoppingCart, ChevronDown, ChevronUp, ChevronRight, CreditCard, User } from 'lucide-react'
import Navbar from '@/components/navbar'

type PaymentMethod = 'bkash' | 'other-cards' | 'city-bank' | 'pay-later'

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('bkash')
  const [showBreakdown, setShowBreakdown] = useState(false)

  // These values would typically come from cart state or API
  const cartItems = [
    {
      id: '1',
      serviceName: 'AC Check Up',
      tonnage: '1-2.5 Ton',
      quantity: 1,
      price: 382.625,
    },
    {
      id: '2',
      serviceName: 'AC Check Up',
      tonnage: '1-2.5 Ton',
      quantity: 1,
      price: 382.625,
    },
  ]
  const itemTotal = 1515.25
  const visitationFee = 0
  const deliveryCharge = 0
  const discount = 750
  const subtotal = itemTotal + visitationFee + deliveryCharge - discount
  const amountToPay = subtotal

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>
            
            <div className="mb-6 flex items-center justify-between">
              <div className="text-base font-bold text-gray-900">Amount to pay</div>
              <div className="text-lg font-medium text-gray-900">৳{amountToPay.toFixed(2)}</div>
            </div>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 mb-4"
            >
              {showBreakdown ? 'Hide breakdown' : 'Show breakdown'}
              {showBreakdown ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* AC Check Up Items - Shown when breakdown is expanded */}
            {showBreakdown && (
              <div className="space-y-2 mb-4 pb-4 border-b">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between text-sm">
                    <div className="flex-1">
                      <div className="text-gray-700 mb-1">{item.serviceName}</div>
                      <div className="ml-1 space-y-0.5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <span>{item.tonnage}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <span>Quantity: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">৳{item.price.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Totals - Always visible */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Item Total</span>
                <span className="font-medium text-gray-900">৳{itemTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Visitation Fee</span>
                <span className="font-medium text-gray-900">৳{visitationFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-medium text-gray-900">৳{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-medium text-green-600">৳{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                <span className="text-gray-900">Subtotal</span>
                <span className="text-gray-900">৳{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>* Prices are VAT exclusive</p>
              <p>* Price may vary depending on product availability</p>
            </div>
          </div>

          {/* Right Panel - Payment Methods */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
            
            <div className="space-y-4 mb-6">
              {/* bKash */}
              <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  checked={selectedPayment === 'bkash'}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                  className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">bKash</span>
                  </div>
                  <span className="font-medium text-gray-900">bKash</span>
                </div>
              </label>

              {/* Other Cards */}
              <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="other-cards"
                  checked={selectedPayment === 'other-cards'}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                  className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Other Cards</span>
                </div>
              </label>

              {/* City Bank (American Express) */}
              <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="city-bank"
                  checked={selectedPayment === 'city-bank'}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                  className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-semibold text-xs text-center">city bank</span>
                  </div>
                  <span className="font-medium text-gray-900">City Bank (American Express)</span>
                </div>
              </label>

              {/* Pay Later */}
              <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="pay-later"
                  checked={selectedPayment === 'pay-later'}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                  className="w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">৳</span>
                  </div>
                  <span className="font-medium text-gray-900">Pay Later</span>
                </div>
              </label>
            </div>

            {/* Make Payment Button */}
            <button className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-colors">
              Make Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

