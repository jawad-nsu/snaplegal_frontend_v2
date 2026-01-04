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

  // Send OTP when component mounts or verification method changes
  useEffect(() => {
    if (!userData) return

    const identifier = 
      verificationMethod === 'phone' || verificationMethod === 'whatsapp'
        ? userData.phone
        : userData.email

    if (identifier) {
      // Send OTP automatically
      fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          method: verificationMethod,
        }),
      })
        .then(async (response) => {
          const data = await response.json()
          // Auto-fill OTP if it's in the response
          if (data.otp && typeof data.otp === 'string' && data.otp.length === 6) {
            const otpArray = data.otp.split('')
            setOtp(otpArray)
            // Focus the last input
            setTimeout(() => {
              if (inputRefs.current[5]) {
                inputRefs.current[5].focus()
              }
            }, 100)
          }
        })
        .catch(console.error)
    }
  }, [userData, verificationMethod])

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

    if (!userData) {
      setError('User data not found. Please sign up again.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Determine identifier based on verification method
      const identifier = 
        verificationMethod === 'phone' || verificationMethod === 'whatsapp'
          ? userData.phone
          : userData.email

      if (!identifier) {
        setError('Contact information not found')
        setIsLoading(false)
        return
      }

      // Call verify OTP API
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          otp: otpString,
          method: verificationMethod,
          userData: {
            type: userData.type,
            email: userData.email,
            phone: userData.phone,
            name: userData.name,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid OTP. Please try again.')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        setIsLoading(false)
        return
      }

      // OTP verified successfully
      setIsVerified(true)

      // Clear pending verification
      localStorage.removeItem('pendingVerification')
      
      // After OTP verification, redirect to sign in page
      // The user can now sign in with their password
      // In a production app, you might want to automatically sign them in
      // using a session token or one-time password
      setTimeout(() => {
        router.push(`/signin?verified=true&email=${encodeURIComponent(userData.email || '')}`)
      }, 1500)
    } catch (error) {
      console.error('Verify OTP error:', error)
      setError('An error occurred. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!userData) {
      setError('User data not found')
      return
    }

    const identifier = 
      verificationMethod === 'phone' || verificationMethod === 'whatsapp'
        ? userData.phone
        : userData.email

    if (!identifier) {
      setError('Contact information not found')
      return
    }

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          method: verificationMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to resend OTP')
        return
      }

      // Auto-fill OTP if it's in the response
      if (data.otp && typeof data.otp === 'string' && data.otp.length === 6) {
        const otpArray = data.otp.split('')
        setOtp(otpArray)
        // Focus the last input
        setTimeout(() => {
          if (inputRefs.current[5]) {
            inputRefs.current[5].focus()
          }
        }, 100)
      } else {
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }

      setResendTimer(60)
      setCanResend(false)
      setError('')
    } catch (error) {
      console.error('Resend OTP error:', error)
      setError('Failed to resend OTP. Please try again.')
    }
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
        <div className="container mx-auto px-4 py-6 sm:py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Your account has been verified. Redirecting...</p>
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
      
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              We&apos;ve sent a 6-digit OTP to your {
                verificationMethod === 'phone' ? 'phone' : 
                verificationMethod === 'whatsapp' ? 'WhatsApp' : 
                'email'
              }
            </p>

            {/* Contact Info Display */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">OTP sent to:</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-all">{maskedContact}</p>
              <div className="mt-3 sm:mt-4 space-y-2">
                {userData.phone && verificationMethod !== 'phone' && (
                  <button
                    type="button"
                    onClick={() => handleChangeMethod('phone')}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm text-[var(--color-primary)] hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors border border-gray-200 touch-manipulation"
                  >
                    Verify via Phone instead
                  </button>
                )}
                {userData.email && verificationMethod !== 'email' && (
                  <button
                    type="button"
                    onClick={() => handleChangeMethod('email')}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm text-[var(--color-primary)] hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors border border-gray-200 touch-manipulation"
                  >
                    Verify via Email instead
                  </button>
                )}
                {userData.phone && verificationMethod !== 'whatsapp' && (
                  <button
                    type="button"
                    onClick={() => handleChangeMethod('whatsapp')}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm text-[var(--color-primary)] hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors border border-gray-200 touch-manipulation"
                  >
                    Verify via WhatsApp instead
                  </button>
                )}
              </div>
            </div>

            {/* OTP Input */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Enter OTP
              </label>
              <div className="flex gap-1.5 sm:gap-2 justify-center">
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
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] touch-manipulation"
                  />
                ))}
              </div>
              {error && (
                <p className="mt-2 text-xs sm:text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            {/* Resend OTP */}
            <div className="mb-4 sm:mb-6 text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-xs sm:text-sm text-[var(--color-primary)] hover:opacity-80 active:opacity-70 font-medium touch-manipulation py-2"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600">
                  Resend OTP in {resendTimer}s
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-[var(--color-primary)] text-white py-3.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:opacity-90 active:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Back to Signup */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Didn&apos;t receive the OTP?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className="text-[var(--color-primary)] hover:opacity-80 active:opacity-70 font-medium disabled:opacity-50 touch-manipulation"
                >
                  Resend
                </button>
              </p>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm">
                <Link href="/signup" className="text-[var(--color-primary)] hover:opacity-80 active:opacity-70">
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

