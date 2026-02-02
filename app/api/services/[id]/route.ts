import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findUnique({
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
    console.error('Fetch service error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
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
    const { 
      title, slug, image, rating, description, deliveryTime, startingPrice, categoryId, subCategoryId, status,
      shortDescription, detailedDescription, providerAuthority, infoSource, requiredDocuments, whatsIncluded, whatsNotIncluded,
      timeline, additionalNotes, processFlow, videoUrl, faqs, consultantQualifications, packages,
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

    // Validate status
    if (status && status !== 'active' && status !== 'inactive') {
      return NextResponse.json(
        { error: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      )
    }

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if another service with the same slug exists
    const duplicateService = await prisma.service.findFirst({
      where: {
        slug: slug.trim(),
        id: { not: id },
      },
    })

    if (duplicateService) {
      return NextResponse.json(
        { error: 'Service with this slug already exists' },
        { status: 400 }
      )
    }

    // Check if category exists (if changed)
    if (categoryId && categoryId !== existingService.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
    }

    // Check if subcategory exists and belongs to category (if provided)
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

      const targetCategoryId = categoryId || existingService.categoryId
      if (subCategory.categoryId !== targetCategoryId) {
        return NextResponse.json(
          { error: 'Subcategory does not belong to the selected category' },
          { status: 400 }
        )
      }
    }

    // Update service with current user as lastModifiedBy
    const service = await prisma.service.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: slug.trim(),
        image: image && image.trim() ? image.trim() : null,
        rating: rating && rating.trim() ? rating.trim() : existingService.rating || '0',
        description: description && description.trim() ? description.trim() : null,
        deliveryTime: deliveryTime && deliveryTime.trim() ? deliveryTime.trim() : null,
        startingPrice: startingPrice && startingPrice.trim() ? startingPrice.trim() : null,
        categoryId: categoryId || existingService.categoryId,
        subCategoryId: subCategoryId && subCategoryId.trim() ? subCategoryId.trim() : null,
        status: status || existingService.status || 'active',
        // Overview fields
        shortDescription: shortDescription !== undefined ? (shortDescription && shortDescription.trim() ? shortDescription.trim() : null) : existingService.shortDescription,
        detailedDescription: detailedDescription !== undefined ? (detailedDescription && detailedDescription.trim() ? detailedDescription.trim() : null) : existingService.detailedDescription,
        providerAuthority: providerAuthority !== undefined ? (providerAuthority && providerAuthority.trim() ? providerAuthority.trim() : null) : existingService.providerAuthority,
        infoSource: infoSource !== undefined ? (infoSource && infoSource.trim() ? infoSource.trim() : null) : existingService.infoSource,
        requiredDocuments: requiredDocuments !== undefined ? (Array.isArray(requiredDocuments) ? requiredDocuments : []) : existingService.requiredDocuments,
        whatsIncluded: whatsIncluded !== undefined ? (whatsIncluded && whatsIncluded.trim() ? whatsIncluded.trim() : null) : existingService.whatsIncluded,
        whatsNotIncluded: whatsNotIncluded !== undefined ? (whatsNotIncluded && whatsNotIncluded.trim() ? whatsNotIncluded.trim() : null) : existingService.whatsNotIncluded,
        timeline: timeline !== undefined ? (timeline && timeline.trim() ? timeline.trim() : null) : existingService.timeline,
        additionalNotes: additionalNotes !== undefined ? (additionalNotes && additionalNotes.trim() ? additionalNotes.trim() : null) : existingService.additionalNotes,
        // Learning and Discussion
        processFlow: processFlow !== undefined ? (processFlow && processFlow.trim() ? processFlow.trim() : null) : existingService.processFlow,
        videoUrl: videoUrl !== undefined ? (videoUrl && videoUrl.trim() ? videoUrl.trim() : null) : existingService.videoUrl,
        // FAQ
        faqs: faqs !== undefined ? faqs : existingService.faqs,
        // Consultants
        consultantQualifications: consultantQualifications !== undefined ? (consultantQualifications && consultantQualifications.trim() ? consultantQualifications.trim() : null) : existingService.consultantQualifications,
        // Price Packages
        packages: packages !== undefined ? packages : existingService.packages,
        // Core cost breakdown
        coreFiling: coreFiling !== undefined ? (coreFiling && coreFiling.trim() ? coreFiling.trim() : null) : existingService.coreFiling,
        coreStamps: coreStamps !== undefined ? (coreStamps && coreStamps.trim() ? coreStamps.trim() : null) : existingService.coreStamps,
        coreCourtFee: coreCourtFee !== undefined ? (coreCourtFee && coreCourtFee.trim() ? coreCourtFee.trim() : null) : existingService.coreCourtFee,
        // Presented cost breakdown
        clientFiling: clientFiling !== undefined ? (clientFiling && clientFiling.trim() ? clientFiling.trim() : null) : existingService.clientFiling,
        clientStamps: clientStamps !== undefined ? (clientStamps && clientStamps.trim() ? clientStamps.trim() : null) : existingService.clientStamps,
        clientCourtFee: clientCourtFee !== undefined ? (clientCourtFee && clientCourtFee.trim() ? clientCourtFee.trim() : null) : existingService.clientCourtFee,
        clientConsultantFee: clientConsultantFee !== undefined ? (clientConsultantFee && clientConsultantFee.trim() ? clientConsultantFee.trim() : null) : existingService.clientConsultantFee,
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
  } catch (error: any) {
    console.error('Update service error:', error)
    const errorMessage = error?.message || 'Failed to update service'
    return NextResponse.json(
      { error: errorMessage, details: error?.code || 'UNKNOWN_ERROR' },
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
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Delete service
    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    })
  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}

