import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const subcategory = await prisma.subCategory.findUnique({
      where: { id },
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

    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      )
    }

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
  } catch (error) {
    console.error('Fetch subcategory error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subcategory' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user from session
    const session = await getSessionFromRequest(request)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
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

    // Check if subcategory exists
    const existingSubCategory = await prisma.subCategory.findUnique({
      where: { id },
    })

    if (!existingSubCategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
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

    // Check if another subcategory with the same title exists in this category
    const duplicateSubCategory = await prisma.subCategory.findFirst({
      where: {
        title: title.trim(),
        categoryId: categoryId,
        id: { not: id },
      },
    })

    if (duplicateSubCategory) {
      return NextResponse.json(
        { error: 'Subcategory with this title already exists in this category' },
        { status: 400 }
      )
    }

    // Check if serial number already exists (if provided and changed)
    if (serialNumber !== undefined && serialNumber !== null && serialNumber !== existingSubCategory.serialNumber) {
      const existingSerial = await prisma.subCategory.findFirst({
        where: {
          serialNumber: Number(serialNumber),
          id: { not: id },
        },
      })

      if (existingSerial) {
        return NextResponse.json(
          { error: 'Subcategory with this serial number already exists' },
          { status: 400 }
        )
      }
    }

    // Update subcategory with current user as lastModifiedBy
    const subcategory = await prisma.subCategory.update({
      where: { id },
      data: {
        title: title.trim(),
        icon: icon && icon.trim() ? icon.trim() : null,
        categoryId: categoryId,
        serialNumber: serialNumber !== undefined && serialNumber !== null ? Number(serialNumber) : existingSubCategory.serialNumber,
        status: status || existingSubCategory.status || 'active',
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
  } catch (error) {
    console.error('Update subcategory error:', error)
    return NextResponse.json(
      { error: 'Failed to update subcategory' },
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
    // Check if subcategory exists
    const existingSubCategory = await prisma.subCategory.findUnique({
      where: { id },
    })

    if (!existingSubCategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      )
    }

    // Delete subcategory
    await prisma.subCategory.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Subcategory deleted successfully',
    })
  } catch (error) {
    console.error('Delete subcategory error:', error)
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    )
  }
}

