import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
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

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

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
  } catch (error) {
    console.error('Fetch category error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if another category with the same title exists
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        title: title.trim(),
        id: { not: id },
      },
    })

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'Category with this title already exists' },
        { status: 400 }
      )
    }

    // Check if serial number already exists (if provided and changed)
    if (serialNumber !== undefined && serialNumber !== null && serialNumber !== existingCategory.serialNumber) {
      const existingSerial = await prisma.category.findFirst({
        where: {
          serialNumber: Number(serialNumber),
          id: { not: id },
        },
      })

      if (existingSerial) {
        return NextResponse.json(
          { error: 'Category with this serial number already exists' },
          { status: 400 }
        )
      }
    }

    // Only set lastModifiedById if the user exists in the DB (avoids FK violation if session is stale)
    let lastModifiedById: string | null = existingCategory.lastModifiedById
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    })
    if (existingUser) {
      lastModifiedById = session.user.id
    }

    // Update category with current user as lastModifiedBy
    const category = await prisma.category.update({
      where: { id },
      data: {
        title: title.trim(),
        icon: icon && icon.trim() ? icon.trim() : null,
        serialNumber: serialNumber !== undefined && serialNumber !== null ? Number(serialNumber) : existingCategory.serialNumber,
        status: status || existingCategory.status || 'active',
        lastModifiedById,
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
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
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
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

