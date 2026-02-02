import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const service = await prisma.service.findUnique({
      where: { slug },
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
        subCategory: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Get review statistics
    const serviceReviews = await prisma.review.findMany({
      where: {
        serviceId: service.id,
        reviewType: 'service',
      },
      select: {
        rating: true,
      },
    })

    const reviewCount = serviceReviews.length
    const calculatedRating = reviewCount > 0
      ? (serviceReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
      : '0'

    return NextResponse.json({
      success: true,
      service: {
        id: service.id,
        title: service.title,
        slug: service.slug,
        image: service.image || '',
        rating: calculatedRating,
        reviewCount,
        description: service.description || '',
        deliveryTime: service.deliveryTime || '',
        startingPrice: service.startingPrice || '',
        categoryId: service.categoryId,
        categoryTitle: service.category.title,
        subCategoryId: service.subCategoryId || undefined,
        subCategoryTitle: service.subCategory?.title || undefined,
        status: service.status || 'active',
        // Overview fields
        shortDescription: service.shortDescription || '',
        detailedDescription: service.detailedDescription || '',
        providerAuthority: service.providerAuthority || '',
        infoSource: service.infoSource || '',
        requiredDocuments: service.requiredDocuments || [],
        whatsIncluded: service.whatsIncluded || '',
        whatsNotIncluded: service.whatsNotIncluded || '',
        timeline: service.timeline || '',
        additionalNotes: service.additionalNotes || '',
        // Learning and Discussion
        processFlow: service.processFlow || '',
        videoUrl: service.videoUrl || '',
        // FAQ
        faqs: service.faqs || [],
        // Consultants
        consultantQualifications: service.consultantQualifications || '',
        // Price Packages
        packages: service.packages || [],
        // Core cost breakdown
        coreFiling: service.coreFiling || '',
        coreStamps: service.coreStamps || '',
        coreCourtFee: service.coreCourtFee || '',
        // Presented cost breakdown
        clientFiling: service.clientFiling || '',
        clientStamps: service.clientStamps || '',
        clientCourtFee: service.clientCourtFee || '',
        clientConsultantFee: service.clientConsultantFee || '',
        lastModifiedBy: service.lastModifiedBy ? {
          id: service.lastModifiedBy.id,
          name: service.lastModifiedBy.name,
          email: service.lastModifiedBy.email,
        } : null,
        createdAt: service.createdAt.toISOString().split('T')[0],
        updatedAt: service.updatedAt.toISOString().split('T')[0],
      },
    })
  } catch (error) {
    console.error('Fetch service by slug error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

