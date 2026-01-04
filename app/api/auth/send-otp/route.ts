import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, storeOTP } from '@/lib/otp'
import { isValidEmail, isValidPhone, formatPhone } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, method = 'phone' } = body // method: 'phone', 'email', 'whatsapp'

    if (!identifier) {
      return NextResponse.json(
        { error: 'Identifier (phone or email) is required' },
        { status: 400 }
      )
    }

    // Validate identifier based on method
    if (method === 'phone' || method === 'whatsapp') {
      if (!isValidPhone(identifier)) {
        return NextResponse.json(
          { error: 'Invalid phone number' },
          { status: 400 }
        )
      }
    } else if (method === 'email') {
      if (!isValidEmail(identifier)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        )
      }
    }

    // Generate OTP
    const otp = generateOTP()

    // Format identifier for storage
    const formattedIdentifier =
      method === 'phone' || method === 'whatsapp'
        ? formatPhone(identifier)
        : identifier.toLowerCase()

    // Store OTP in database
    await storeOTP(formattedIdentifier, otp, 10) // 10 minutes expiration

    // Check if OTP should be returned in response (for development/testing)
    const shouldShowOTP = process.env.SHOW_OTP_IN_RESPONSE === 'true'
    
    if (shouldShowOTP) {
      console.log(`OTP for ${formattedIdentifier}: ${otp}`)
    }

    // Return response with OTP if SHOW_OTP_IN_RESPONSE is true
    return NextResponse.json({
      success: true,
      message: `OTP sent to your ${method === 'whatsapp' ? 'WhatsApp' : method}`,
      otp: shouldShowOTP ? otp : undefined,
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'An error occurred while sending OTP' },
      { status: 500 }
    )
  }
}

