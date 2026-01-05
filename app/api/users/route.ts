import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isValidEmail, isValidPhone, formatPhone } from '@/lib/auth'
import { UserType, UserStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') // 'all', 'active', 'inactive'
    const type = searchParams.get('type') // 'all', 'USER', 'PARTNER', 'ADMIN', 'EMPLOYEE'

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ]
    }

    // Filter by status
    if (status && status !== 'all') {
      where.status = status as UserStatus
    }

    // Filter by type
    if (type && type !== 'all') {
      where.type = type as UserType
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        type: user.type || 'USER',
        createdAt: user.createdAt.toISOString().split('T')[0],
        status: user.status,
      })),
    })
  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, type, status } = body

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      )
    }

    // Validate user type
    const validTypes: UserType[] = ['USER', 'PARTNER', 'ADMIN', 'EMPLOYEE']
    if (type && !validTypes.includes(type as UserType)) {
      return NextResponse.json(
        { error: 'Invalid user type. Must be one of: USER, PARTNER, ADMIN, EMPLOYEE' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses: UserStatus[] = ['active', 'inactive']
    if (status && !validStatuses.includes(status as UserStatus)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: active, inactive' },
        { status: 400 }
      )
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
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
      if (existingUser.phone === formatPhone(phone)) {
        return NextResponse.json(
          { error: 'Phone number already registered' },
          { status: 400 }
        )
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        phone: formatPhone(phone),
        type: (type || 'USER') as UserType,
        status: (status || 'active') as UserStatus,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        type: user.type || 'USER',
        createdAt: user.createdAt.toISOString().split('T')[0],
        status: user.status,
      },
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

