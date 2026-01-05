import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isValidEmail, isValidPhone, formatPhone } from '@/lib/auth'
import { UserType, UserStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

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
    console.error('Fetch user error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, phone, type, status } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

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

    // Check if email or phone is already taken by another user
    const duplicateUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { email },
              { phone: formatPhone(phone) },
            ],
          },
        ],
      },
    })

    if (duplicateUser) {
      if (duplicateUser.email === email) {
        return NextResponse.json(
          { error: 'Email already registered to another user' },
          { status: 400 }
        )
      }
      if (duplicateUser.phone === formatPhone(phone)) {
        return NextResponse.json(
          { error: 'Phone number already registered to another user' },
          { status: 400 }
        )
      }
    }

    // Update user
    const updateData: any = {
      name: name.trim(),
      email,
      phone: formatPhone(phone),
      type: (type || 'USER') as UserType,
    }

    // Update status if provided
    if (status) {
      updateData.status = status as UserStatus
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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
    console.error('Update user error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to update user', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

