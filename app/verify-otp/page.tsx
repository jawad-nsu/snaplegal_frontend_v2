'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'

function VerifyOTPContent() {
  const router = useRouter()
  // searchParams available if needed for future use
  const _searchParams = useSearchParams()
  const [verificationMethod, setVerificationMethod] = useState<'phone' | 'email' | 'whatsapp'>('phone')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get user data from localStorage (set during signup)
  const [userData, setUserData] = useState<{
    type: 'user' | 'partner'
    phone?: string
    email?: string
    name?: string
  } | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem('pendingVerification')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setUserData(data)
        // Default to phone if available, otherwise email
        if (data.phone) {
          setVerificationMethod('phone')
        } else if (data.email) {
          setVerificationMethod('email')
        }
        // WhatsApp uses the same phone number
      } catch (e) {
        console.error('Error parsing user data:', e)
        router.push('/signup')
      }
    } else {
      router.push('/signup')
    }
  }, [router])

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    // Resend timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('')
      const newOtp = [...otp]
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })
      setOtp(newOtp)
      // Focus last filled input or submit button
      const nextIndex = Math.min(index + pastedOtp.length, 5)
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus()
      }
      return
    }

    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any 6-digit OTP starting with 1
      if (otpString.startsWith('1')) {
        setIsVerified(true)
        // Set auth token and user data
        if (userData) {
          localStorage.setItem('authToken', `${userData.type}-token`)
          localStorage.setItem('user', JSON.stringify({
            type: userData.type,
            name: userData.name,
            phone: userData.phone,
            email: userData.email
          }))
          // Clear pending verification
          localStorage.removeItem('pendingVerification')
          
          // Redirect based on user type
          setTimeout(() => {
            if (userData.type === 'partner') {
              router.push('/vendor')
            } else {
              router.push('/')
            }
          }, 1500)
        }
      } else {
        setError('Invalid OTP. Please try again.')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleResendOtp = () => {
    setResendTimer(60)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    setError('')
    // Simulate resending OTP
    const contact = verificationMethod === 'phone' || verificationMethod === 'whatsapp' 
      ? userData?.phone 
      : userData?.email
    console.log(`Resending OTP via ${verificationMethod} to ${contact}`)
    inputRefs.current[0]?.focus()
  }

  const handleChangeMethod = (method: 'phone' | 'email' | 'whatsapp') => {
    setVerificationMethod(method)
    setOtp(['', '', '', '', '', ''])
    setError('')
    setResendTimer(60)
    setCanResend(false)
    inputRefs.current[0]?.focus()
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h2>
              <p className="text-gray-600 mb-6">Your account has been verified. Redirecting...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const contactInfo = verificationMethod === 'phone' || verificationMethod === 'whatsapp' 
    ? userData.phone 
    : userData.email
  const maskedContact = (verificationMethod === 'phone' || verificationMethod === 'whatsapp') && contactInfo
    ? contactInfo.slice(0, -4).replace(/\d/g, '*') + contactInfo.slice(-4)
    : contactInfo?.replace(/(.{2})(.*)(@.*)/, (_, start, middle, end) => 
        start + '*'.repeat(Math.min(middle.length, 5)) + end) || ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
            <p className="text-gray-600 mb-6">
              We've sent a 6-digit OTP to your {
                verificationMethod === 'phone' ? 'phone' : 
                verificationMethod === 'whatsapp' ? 'WhatsApp' : 
                'email'
              }
            </p>

            {/* Contact Info Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">OTP sent to:</p>
              <p className="text-lg font-semibold text-gray-900">{maskedContact}</p>
              <div className="mt-4 space-y-2">
                {userData.phone && verificationMethod !== 'phone' && (
                  <button
                    type="button"
                    onClick={() => handleChangeMethod('phone')}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    Verify via Phone instead
                  </button>
                )}
                {userData.email && verificationMethod !== 'email' && (
                  <button
                    type="button"
                    onClick={() => handleChangeMethod('email')}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    Verify via Email instead
                  </button>
                )}
                {userData.phone && verificationMethod !== 'whatsapp' && (
                  <button
                    type="button"
                    onClick={() => handleChangeMethod('whatsapp')}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    Verify via WhatsApp instead
                  </button>
                )}
              </div>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter OTP
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  />
                ))}
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            {/* Resend OTP */}
            <div className="mb-6 text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-[var(--color-primary)] hover:opacity-80 font-medium"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-600">
                  Resend OTP in {resendTimer}s
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Back to Signup */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the OTP?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className="text-[var(--color-primary)] hover:opacity-80 font-medium disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
              <p className="mt-4 text-sm">
                <Link href="/signup" className="text-[var(--color-primary)] hover:opacity-80">
                  Back to Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  )
}

