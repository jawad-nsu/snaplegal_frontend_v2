import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { UserType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is a PARTNER
    const userId = session.user.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
        status: true,
        image: true,
        address: true,
        district: true,
        serviceCategories: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.type !== UserType.PARTNER) {
      return NextResponse.json(
        { error: 'Access denied. Partner account required.' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      partner: {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        businessName: user.name || '', // Using name as business name for now
        businessType: 'Service Provider', // Default value, can be extended in schema later
        registrationNumber: user.id.substring(0, 8).toUpperCase(), // Using first 8 chars of ID as registration number
        address: user.address || '',
        district: user.district || '',
        serviceCategories: user.serviceCategories || [],
        image: user.image || null,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Fetch partner profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partner profile' },
      { status: 500 }
    )
  }
}

