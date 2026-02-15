import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'

// Shape of a service as shown on the homepage
function toHomepageService(service: {
  id: string
  title: string
  slug: string
  image: string | null
  rating: string | null
  description: string | null
  shortDescription: string | null
  deliveryTime: string | null
  startingPrice: string | null
}) {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    image: service.image || '/placeholder.svg',
    rating: service.rating || '0',
    description: service.shortDescription || service.description || '',
    deliveryTime: service.deliveryTime || '',
    startingPrice: service.startingPrice || '',
  }
}

// GET – public: returns trending and recommended for the homepage
export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany({
      include: {
        category: {
          select: { id: true, title: true },
        },
      },
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
    })

    const serviceIds = new Set<string>()
    sections.forEach((s) => s.serviceIds.forEach((id) => serviceIds.add(id)))
    const ids = Array.from(serviceIds)
    const services =
      ids.length === 0
        ? []
        : await prisma.service.findMany({
            where: { id: { in: ids }, status: 'active' },
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
              rating: true,
              description: true,
              shortDescription: true,
              deliveryTime: true,
              startingPrice: true,
            },
          })
    const serviceMap = Object.fromEntries(services.map((s) => [s.id, s]))

    // Single trending row: merge all trending sections by sortOrder, then preserve serviceIds order (serial)
    const trendingSectionRows = sections
      .filter((s) => s.type === 'trending')
      .sort((a, b) => a.sortOrder - b.sortOrder)
    const trendingServiceIds = trendingSectionRows.flatMap((s) => s.serviceIds)
    const trending = trendingServiceIds
      .map((id) => serviceMap[id])
      .filter(Boolean)
      .map(toHomepageService)

    const recommendedSection = sections.find((s) => s.type === 'recommended')
    const recommended = (recommendedSection?.serviceIds ?? [])
      .map((id) => serviceMap[id])
      .filter(Boolean)
      .map(toHomepageService)

    // Legal Services: one row per category, ordered by sortOrder; items in row by serviceIds order
    const legalSections = sections
      .filter((s) => s.type === 'legal_services' && s.categoryId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    const legalServices = legalSections.map((sec) => {
      const categoryTitle = sec.category?.title ?? ''
      const services = (sec.serviceIds ?? [])
        .map((id) => serviceMap[id])
        .filter(Boolean)
        .map(toHomepageService)
      return { categoryId: sec.categoryId!, categoryTitle, services }
    })

    return NextResponse.json({
      success: true,
      trending,
      recommended,
      legalServices,
    })
  } catch (error) {
    console.error('Fetch homepage sections error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch homepage sections' },
      { status: 500 }
    )
  }
}

// PUT – admin: set trending rows and recommended list
export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      trendingServiceIds = [],
      recommendedServiceIds = [],
      legalServicesRows = [],
    }: {
      trendingServiceIds?: string[]
      recommendedServiceIds?: string[]
      legalServicesRows?: { categoryId: string; serviceIds: string[] }[]
    } = body

    const trendingIds = Array.isArray(trendingServiceIds) ? trendingServiceIds : []
    const legalRows = Array.isArray(legalServicesRows) ? legalServicesRows : []

    await prisma.$transaction(async (tx) => {
      await tx.homepageSection.deleteMany({})

      if (trendingIds.length > 0) {
        await tx.homepageSection.create({
          data: {
            type: 'trending',
            categoryId: null,
            serviceIds: trendingIds,
            sortOrder: 0,
          },
        })
      }

      if (Array.isArray(recommendedServiceIds) && recommendedServiceIds.length > 0) {
        await tx.homepageSection.create({
          data: {
            type: 'recommended',
            categoryId: null,
            serviceIds: recommendedServiceIds,
            sortOrder: 0,
          },
        })
      }

      for (let i = 0; i < legalRows.length; i++) {
        const row = legalRows[i]
        if (row?.categoryId && Array.isArray(row.serviceIds)) {
          await tx.homepageSection.create({
            data: {
              type: 'legal_services',
              categoryId: row.categoryId,
              serviceIds: row.serviceIds,
              sortOrder: i,
            },
          })
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update homepage sections error:', error)
    return NextResponse.json(
      { error: 'Failed to update homepage sections' },
      { status: 500 }
    )
  }
}
