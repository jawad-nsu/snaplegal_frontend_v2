import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const reviewType = searchParams.get('reviewType') // "service" or "consultant"
    const rating = searchParams.get('rating')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (serviceId) {
      where.serviceId = serviceId
    }
    
    if (reviewType) {
      where.reviewType = reviewType
    }
    
    if (rating) {
      where.rating = parseInt(rating)
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          service: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          user: {
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
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Fetch reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      serviceId,
      userId,
      orderId,
      reviewType,
      rating,
      comment,
      reviewerName,
      images,
      isVerified,
    } = body

    // Validation
    if (!serviceId?.trim()) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }

    if (!reviewerName?.trim()) {
      return NextResponse.json(
        { error: 'Reviewer name is required' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!reviewType || (reviewType !== 'service' && reviewType !== 'consultant')) {
      return NextResponse.json(
        { error: 'Review type must be either "service" or "consultant"' },
        { status: 400 }
      )
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if user exists (if userId provided)
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        serviceId,
        userId: userId || null,
        orderId: orderId || null,
        reviewType: reviewType || 'service',
        rating: parseInt(rating),
        comment: comment?.trim() || null,
        reviewerName: reviewerName.trim(),
        images: Array.isArray(images) ? images : [],
        isVerified: isVerified || false,
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Calculate and update service rating
    await updateServiceRating(serviceId)

    return NextResponse.json({
      success: true,
      review,
    })
  } catch (error: any) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create review' },
      { status: 500 }
    )
  }
}

// Helper function to calculate and update service rating
async function updateServiceRating(serviceId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        serviceId,
        reviewType: 'service', // Only calculate from service reviews
      },
      select: {
        rating: true,
      },
    })

    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      const roundedRating = Math.round(averageRating * 10) / 10 // Round to 1 decimal place

      await prisma.service.update({
        where: { id: serviceId },
        data: {
          rating: roundedRating.toFixed(1),
        },
      })
    }
  } catch (error) {
    console.error('Error updating service rating:', error)
  }
}

