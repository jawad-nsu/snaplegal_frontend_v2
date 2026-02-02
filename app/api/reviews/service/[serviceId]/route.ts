import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params
    const { searchParams } = new URL(request.url)
    const reviewType = searchParams.get('reviewType') // "service" or "consultant"

    const where: any = {
      serviceId,
    }

    if (reviewType) {
      where.reviewType = reviewType
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
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
    })

    // Calculate statistics
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0

    // Count by rating
    const ratingCounts = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }

    return NextResponse.json({
      success: true,
      reviews,
      statistics: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingCounts,
      },
    })
  } catch (error) {
    console.error('Fetch service reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service reviews' },
      { status: 500 }
    )
  }
}

