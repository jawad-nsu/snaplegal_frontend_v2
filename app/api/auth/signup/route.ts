import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword } from '@/lib/password'
import { isValidEmail, isValidPhone, formatPhone } from '@/lib/auth'
import { UserType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      userType = 'user',
      address,
      district,
      serviceCategories = [],
    } = body

    // Validation
    const errors: Record<string, string> = {}

    if (!name?.trim()) {
      errors.name = 'Name is required'
    }

    if (!phone) {
      errors.phone = 'Phone number is required'
    } else if (!isValidPhone(phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (!email) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        errors.password = passwordValidation.message
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Partner-specific validations
    if (userType === 'partner') {
      if (!address?.trim()) {
        errors.address = 'Address is required'
      }
      if (!district) {
        errors.district = 'District is required'
      }
      if (!Array.isArray(serviceCategories) || serviceCategories.length === 0) {
        errors.serviceCategories = 'Please select at least one service category'
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: formatPhone(phone) },
        ],
      },
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { errors: { email: 'Email already registered' } },
          { status: 400 }
        )
      }
      if (existingUser.phone === formatPhone(phone)) {
        return NextResponse.json(
          { errors: { phone: 'Phone number already registered' } },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        phone: formatPhone(phone),
        password: hashedPassword,
        type: userType === 'partner' ? UserType.PARTNER : UserType.USER,
        address: userType === 'partner' ? address?.trim() : undefined,
        district: userType === 'partner' ? district : undefined,
        serviceCategories: userType === 'partner' ? serviceCategories : [],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
      },
    })

    // Store user data for OTP verification
    // In a real app, you'd send OTP here
    // For now, we'll return the user data to be stored in localStorage temporarily
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
      },
      message: 'User created successfully. Please verify your account.',
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}

