import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(request: NextRequest) {
  try {
    const subcategories = await prisma.subCategory.findMany({
      include: {
        lastModifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      subcategories: subcategories.map(subcategory => ({
        id: subcategory.id,
        serialNumber: subcategory.serialNumber,
        title: subcategory.title,
        icon: subcategory.icon || '',
        categoryId: subcategory.categoryId,
        categoryTitle: subcategory.category?.title || '',
        status: subcategory.status || 'active',
        lastModifiedBy: subcategory.lastModifiedBy ? {
          id: subcategory.lastModifiedBy.id,
          name: subcategory.lastModifiedBy.name,
          email: subcategory.lastModifiedBy.email,
        } : null,
        createdAt: subcategory.createdAt.toISOString().split('T')[0],
        updatedAt: subcategory.updatedAt.toISOString().split('T')[0],
      })),
    })
  } catch (error) {
    console.error('Fetch subcategories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
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
    const { title, icon, categoryId, serialNumber, status } = body

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if subcategory already exists in this category
    const existingSubCategory = await prisma.subCategory.findFirst({
      where: {
        title: title.trim(),
        categoryId: categoryId,
      },
    })

    if (existingSubCategory) {
      return NextResponse.json(
        { error: 'Subcategory with this title already exists in this category' },
        { status: 400 }
      )
    }

    // Check if serial number already exists (if provided)
    if (serialNumber !== undefined && serialNumber !== null) {
      const existingSerial = await prisma.subCategory.findUnique({
        where: { serialNumber: Number(serialNumber) },
      })

      if (existingSerial) {
        return NextResponse.json(
          { error: 'Subcategory with this serial number already exists' },
          { status: 400 }
        )
      }
    }

    // Create subcategory with current user as lastModifiedBy
    const subcategory = await prisma.subCategory.create({
      data: {
        title: title.trim(),
        icon: icon && icon.trim() ? icon.trim() : null,
        categoryId: categoryId,
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
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      subcategory: {
        id: subcategory.id,
        serialNumber: subcategory.serialNumber,
        title: subcategory.title,
        icon: subcategory.icon || '',
        categoryId: subcategory.categoryId,
        categoryTitle: subcategory.category?.title || '',
        status: subcategory.status || 'active',
        lastModifiedBy: subcategory.lastModifiedBy ? {
          id: subcategory.lastModifiedBy.id,
          name: subcategory.lastModifiedBy.name,
          email: subcategory.lastModifiedBy.email,
        } : null,
        createdAt: subcategory.createdAt.toISOString().split('T')[0],
        updatedAt: subcategory.updatedAt.toISOString().split('T')[0],
      },
    })
  } catch (error: any) {
    console.error('Create subcategory error:', error)
    const errorMessage = error?.message || 'Failed to create subcategory'
    return NextResponse.json(
      { error: errorMessage, details: error?.code || 'UNKNOWN_ERROR' },
      { status: 500 }
    )
  }
}

