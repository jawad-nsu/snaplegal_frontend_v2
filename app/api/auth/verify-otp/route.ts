import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'
import { prisma } from '@/lib/prisma'
import { formatPhone } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, otp, method = 'phone', userData } = body

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: 'Identifier and OTP are required' },
        { status: 400 }
      )
    }

    // Format identifier
    const formattedIdentifier =
      method === 'phone' || method === 'whatsapp'
        ? formatPhone(identifier)
        : identifier.toLowerCase()

    // Verify OTP
    const isValid = await verifyOTP(formattedIdentifier, otp)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // If userData is provided (from signup flow), verify the user
    if (userData) {
      const { type, email, phone, name } = userData

      // Find the user
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { phone: formatPhone(phone) },
          ],
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Mark email/phone as verified
      const updateData: any = {}
      if (method === 'email' || formattedIdentifier === email?.toLowerCase()) {
        updateData.emailVerified = new Date()
      }
      if (method === 'phone' || method === 'whatsapp' || formattedIdentifier === formatPhone(phone)) {
        updateData.phoneVerified = new Date()
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      })

      // Create session using NextAuth
      // Note: In NextAuth v5, we need to handle this differently
      // For now, return success and let the client handle sign-in
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          type: user.type,
        },
      })
    }

    // For sign-in flow (OTP-based login)
    // Find user by identifier
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: formattedIdentifier },
          { phone: formattedIdentifier },
        ],
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Mark as verified
    const updateData: any = {}
    if (formattedIdentifier === user.email?.toLowerCase()) {
      updateData.emailVerified = new Date()
    }
    if (formattedIdentifier === user.phone) {
      updateData.phoneVerified = new Date()
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
      },
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'An error occurred while verifying OTP' },
      { status: 500 }
    )
  }
}

