import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const review = await prisma.review.findUnique({
      where: { id },
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

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      review,
    })
  } catch (error) {
    console.error('Fetch review error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
      reviewType,
      rating,
      comment,
      reviewerName,
      images,
      isVerified,
    } = body

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Check permissions: user can only edit their own review, admin can edit any
    const isAdmin = session.user.type === 'ADMIN'
    const isOwner = existingReview.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You can only edit your own reviews' },
        { status: 403 }
      )
    }

    // Validation
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (reviewType && reviewType !== 'service' && reviewType !== 'consultant') {
      return NextResponse.json(
        { error: 'Review type must be either "service" or "consultant"' },
        { status: 400 }
      )
    }

    // Update review
    const review = await prisma.review.update({
      where: { id },
      data: {
        reviewType: reviewType !== undefined ? reviewType : existingReview.reviewType,
        rating: rating !== undefined ? parseInt(rating) : existingReview.rating,
        comment: comment !== undefined ? (comment?.trim() || null) : existingReview.comment,
        reviewerName: reviewerName?.trim() || existingReview.reviewerName,
        images: images !== undefined ? (Array.isArray(images) ? images : []) : existingReview.images,
        isVerified: isVerified !== undefined ? isVerified : existingReview.isVerified,
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

    // Recalculate service rating
    await updateServiceRating(existingReview.serviceId)

    return NextResponse.json({
      success: true,
      review,
    })
  } catch (error: any) {
    console.error('Update review error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Check permissions: user can only delete their own review, admin can delete any
    const isAdmin = session.user.type === 'ADMIN'
    const isOwner = existingReview.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own reviews' },
        { status: 403 }
      )
    }

    const serviceId = existingReview.serviceId

    // Delete review
    await prisma.review.delete({
      where: { id },
    })

    // Recalculate service rating
    await updateServiceRating(serviceId)

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    })
  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
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
    } else {
      // No reviews, set rating to 0
      await prisma.service.update({
        where: { id: serviceId },
        data: {
          rating: '0',
        },
      })
    }
  } catch (error) {
    console.error('Error updating service rating:', error)
  }
}

