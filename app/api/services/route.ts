import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      services: services.map(service => ({
        id: service.id,
        title: service.title,
        slug: service.slug,
        image: service.image || '',
        rating: service.rating || '0',
        description: service.description || '',
        deliveryTime: service.deliveryTime || '',
        startingPrice: service.startingPrice || '',
        categoryId: service.categoryId,
        subCategoryId: service.subCategoryId || undefined,
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
        communityDiscussions: service.communityDiscussions || [],
        // FAQ
        faqs: service.faqs || [],
        // Consultants
        consultantQualifications: service.consultantQualifications || '',
        whyChooseConsultants: service.whyChooseConsultants ?? [],
        howWeSelectConsultants: service.howWeSelectConsultants ?? [],
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
      })),
    })
  } catch (error) {
    console.error('Fetch services error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
    const { 
      title, slug, image, rating, description, deliveryTime, startingPrice, categoryId, subCategoryId, status,
      shortDescription, detailedDescription, providerAuthority, infoSource, requiredDocuments, whatsIncluded, whatsNotIncluded,
      timeline, additionalNotes, processFlow, videoUrl, communityDiscussions, faqs, consultantQualifications, whyChooseConsultants, howWeSelectConsultants, packages,
      coreFiling, coreStamps, coreCourtFee, clientFiling, clientStamps, clientCourtFee, clientConsultantFee
    } = body

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        { error: 'Slug is required' },
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

    // Check if subcategory exists (if provided)
    if (subCategoryId) {
      const subCategory = await prisma.subCategory.findUnique({
        where: { id: subCategoryId },
      })

      if (!subCategory) {
        return NextResponse.json(
          { error: 'Subcategory not found' },
          { status: 404 }
        )
      }

      // Verify subcategory belongs to the category
      if (subCategory.categoryId !== categoryId) {
        return NextResponse.json(
          { error: 'Subcategory does not belong to the selected category' },
          { status: 400 }
        )
      }
    }

    // Check if service with same slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug: slug.trim() },
    })

    if (existingService) {
      return NextResponse.json(
        { error: 'Service with this slug already exists' },
        { status: 400 }
      )
    }

    // Create service with current user as lastModifiedBy
    const service = await prisma.service.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        image: image && image.trim() ? image.trim() : null,
        rating: rating && rating.trim() ? rating.trim() : '0',
        description: description && description.trim() ? description.trim() : null,
        deliveryTime: deliveryTime && deliveryTime.trim() ? deliveryTime.trim() : null,
        startingPrice: startingPrice && startingPrice.trim() ? startingPrice.trim() : null,
        categoryId: categoryId,
        subCategoryId: subCategoryId && subCategoryId.trim() ? subCategoryId.trim() : null,
        status: (status || 'active') as string,
        // Overview fields
        shortDescription: shortDescription && shortDescription.trim() ? shortDescription.trim() : null,
        detailedDescription: detailedDescription && detailedDescription.trim() ? detailedDescription.trim() : null,
        providerAuthority: providerAuthority && providerAuthority.trim() ? providerAuthority.trim() : null,
        infoSource: infoSource && infoSource.trim() ? infoSource.trim() : null,
        requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : [],
        whatsIncluded: whatsIncluded && whatsIncluded.trim() ? whatsIncluded.trim() : null,
        whatsNotIncluded: whatsNotIncluded && whatsNotIncluded.trim() ? whatsNotIncluded.trim() : null,
        timeline: timeline && timeline.trim() ? timeline.trim() : null,
        additionalNotes: additionalNotes && additionalNotes.trim() ? additionalNotes.trim() : null,
        // Learning and Discussion
        processFlow: processFlow && processFlow.trim() ? processFlow.trim() : null,
        videoUrl: videoUrl && videoUrl.trim() ? videoUrl.trim() : null,
        communityDiscussions: communityDiscussions ?? null,
        // FAQ
        faqs: faqs ? faqs : null,
        // Consultants
        consultantQualifications: consultantQualifications && consultantQualifications.trim() ? consultantQualifications.trim() : null,
        whyChooseConsultants: whyChooseConsultants ?? null,
        howWeSelectConsultants: howWeSelectConsultants ?? null,
        // Price Packages
        packages: packages ? packages : null,
        // Core cost breakdown
        coreFiling: coreFiling && coreFiling.trim() ? coreFiling.trim() : null,
        coreStamps: coreStamps && coreStamps.trim() ? coreStamps.trim() : null,
        coreCourtFee: coreCourtFee && coreCourtFee.trim() ? coreCourtFee.trim() : null,
        // Presented cost breakdown
        clientFiling: clientFiling && clientFiling.trim() ? clientFiling.trim() : null,
        clientStamps: clientStamps && clientStamps.trim() ? clientStamps.trim() : null,
        clientCourtFee: clientCourtFee && clientCourtFee.trim() ? clientCourtFee.trim() : null,
        clientConsultantFee: clientConsultantFee && clientConsultantFee.trim() ? clientConsultantFee.trim() : null,
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
        subCategory: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      service: {
        id: service.id,
        title: service.title,
        slug: service.slug,
        image: service.image || '',
        rating: service.rating || '0',
        description: service.description || '',
        deliveryTime: service.deliveryTime || '',
        startingPrice: service.startingPrice || '',
        categoryId: service.categoryId,
        subCategoryId: service.subCategoryId || undefined,
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
        communityDiscussions: service.communityDiscussions || [],
        // FAQ
        faqs: service.faqs || [],
        // Consultants
        consultantQualifications: service.consultantQualifications || '',
        whyChooseConsultants: service.whyChooseConsultants ?? [],
        howWeSelectConsultants: service.howWeSelectConsultants ?? [],
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
  } catch (error: any) {
    console.error('Create service error:', error)
    const errorMessage = error?.message || 'Failed to create service'
    return NextResponse.json(
      { error: errorMessage, details: error?.code || 'UNKNOWN_ERROR' },
      { status: 500 }
    )
  }
}

