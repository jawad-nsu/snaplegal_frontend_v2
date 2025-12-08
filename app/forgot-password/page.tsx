'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'user' | 'partner'>('user')
  
  // User form data
  const [userFormData, setUserFormData] = useState({
    username: '',
  })
  
  // Partner form data
  const [partnerFormData, setPartnerFormData] = useState({
    username: '',
  })
  
  const [userErrors, setUserErrors] = useState<{
    username?: string
  }>({})
  
  const [partnerErrors, setPartnerErrors] = useState<{
    username?: string
  }>({})

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserFormData(prev => ({ ...prev, [name]: value }))
    if (userErrors[name as keyof typeof userErrors]) {
      setUserErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handlePartnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPartnerFormData(prev => ({ ...prev, [name]: value }))
    if (partnerErrors[name as keyof typeof partnerErrors]) {
      setPartnerErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof userErrors = {}

    if (!userFormData.username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setUserErrors(newErrors)
      return
    }

    // Handle forgot password logic here
    console.log('User forgot password:', userFormData)
    setIsSubmitted(true)
  }

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof partnerErrors = {}

    if (!partnerFormData.username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setPartnerErrors(newErrors)
      return
    }

    // Handle forgot password logic here
    console.log('Partner forgot password:', partnerFormData)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600 mb-8">Enter your username to receive password reset instructions.</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('user')
                  setIsSubmitted(false)
                }}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'user'
                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('partner')
                  setIsSubmitted(false)
                }}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'partner'
                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Consultant
              </button>
            </div>

            {/* User Forgot Password Form */}
            {activeTab === 'user' && (
              <>
                {!isSubmitted ? (
                  <form onSubmit={handleUserSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                      <label htmlFor="user-username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        id="user-username"
                        name="username"
                        value={userFormData.username}
                        onChange={handleUserChange}
                        placeholder="Enter your username"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                          userErrors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {userErrors.username && (
                        <p className="mt-1 text-sm text-red-600">{userErrors.username}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
                    >
                      Reset Password
                    </button>

                    {/* Back to Sign In Link */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link href="/signin" className="text-[var(--color-primary)] hover:opacity-80 font-medium">
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Reset Link Sent</h2>
                    <p className="text-gray-600">
                      We've sent password reset instructions to your registered email address. Please check your inbox.
                    </p>
                    <Link
                      href="/signin"
                      className="inline-block mt-4 text-[var(--color-primary)] hover:opacity-80 font-medium"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Consultant Forgot Password Form */}
            {activeTab === 'partner' && (
              <>
                {!isSubmitted ? (
                  <form onSubmit={handlePartnerSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                      <label htmlFor="partner-username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        id="partner-username"
                        name="username"
                        value={partnerFormData.username}
                        onChange={handlePartnerChange}
                        placeholder="Enter your username"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                          partnerErrors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {partnerErrors.username && (
                        <p className="mt-1 text-sm text-red-600">{partnerErrors.username}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
                    >
                      Reset Password
                    </button>

                    {/* Back to Sign In Link */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link href="/signin" className="text-[var(--color-primary)] hover:opacity-80 font-medium">
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Reset Link Sent</h2>
                    <p className="text-gray-600">
                      We've sent password reset instructions to your registered email address. Please check your inbox.
                    </p>
                    <Link
                      href="/signin"
                      className="inline-block mt-4 text-[var(--color-primary)] hover:opacity-80 font-medium"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

