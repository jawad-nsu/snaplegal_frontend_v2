import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        lastModifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      categories: categories.map(category => ({
        id: category.id,
        serialNumber: category.serialNumber,
        title: category.title,
        icon: category.icon || '',
        status: category.status || 'active',
        lastModifiedBy: category.lastModifiedBy ? {
          id: category.lastModifiedBy.id,
          name: category.lastModifiedBy.name,
          email: category.lastModifiedBy.email,
        } : null,
        createdAt: category.createdAt.toISOString().split('T')[0],
        updatedAt: category.updatedAt.toISOString().split('T')[0],
      })),
    })
  } catch (error) {
    console.error('Fetch categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const session = await getSessionFromRequest(request)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, icon, serialNumber, status } = body

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Validate status
    if (status && status !== 'active' && status !== 'inactive') {
      return NextResponse.json(
        { error: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      )
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { title: title.trim() },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this title already exists' },
        { status: 400 }
      )
    }

    // Check if serial number already exists (if provided)
    if (serialNumber !== undefined && serialNumber !== null) {
      const existingSerial = await prisma.category.findUnique({
        where: { serialNumber: Number(serialNumber) },
      })

      if (existingSerial) {
        return NextResponse.json(
          { error: 'Category with this serial number already exists' },
          { status: 400 }
        )
      }
    }

    // Create category with current user as lastModifiedBy
    const category = await prisma.category.create({
      data: {
        title: title.trim(),
        icon: icon && icon.trim() ? icon.trim() : null,
        serialNumber: serialNumber !== undefined && serialNumber !== null ? Number(serialNumber) : null,
        status: (status || 'active') as string,
        lastModifiedById: session.user.id,
      },
      include: {
        lastModifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        serialNumber: category.serialNumber,
        title: category.title,
        icon: category.icon || '',
        status: category.status || 'active',
        lastModifiedBy: category.lastModifiedBy ? {
          id: category.lastModifiedBy.id,
          name: category.lastModifiedBy.name,
          email: category.lastModifiedBy.email,
        } : null,
        createdAt: category.createdAt.toISOString().split('T')[0],
        updatedAt: category.updatedAt.toISOString().split('T')[0],
      },
    })
  } catch (error: any) {
    console.error('Create category error:', error)
    // Provide more detailed error message
    const errorMessage = error?.message || 'Failed to create category'
    return NextResponse.json(
      { error: errorMessage, details: error?.code || 'UNKNOWN_ERROR' },
      { status: 500 }
    )
  }
}

