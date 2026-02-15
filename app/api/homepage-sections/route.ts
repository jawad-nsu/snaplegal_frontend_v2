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
  deliveryTime: string | null
  startingPrice: string | null
}) {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    image: service.image || '/placeholder.svg',
    rating: service.rating || '0',
    description: service.description || '',
    deliveryTime: service.deliveryTime || '',
    startingPrice: service.startingPrice || '',
  }
}

// GET – public: returns trending (by category) and recommended for the homepage
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
              deliveryTime: true,
              startingPrice: true,
            },
          })
    const serviceMap = Object.fromEntries(services.map((s) => [s.id, s]))

    const trendingRows = sections
      .filter((s) => s.type === 'trending' && s.categoryId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => {
        const category = s.category!
        const servicesForRow = s.serviceIds
          .map((id) => serviceMap[id])
          .filter(Boolean)
        return {
          categoryId: category.id,
          categoryTitle: category.title,
          services: servicesForRow.map(toHomepageService),
        }
      })

    const recommendedSection = sections.find((s) => s.type === 'recommended')
    const recommended = (recommendedSection?.serviceIds ?? [])
      .map((id) => serviceMap[id])
      .filter(Boolean)
      .map(toHomepageService)

    return NextResponse.json({
      success: true,
      trending: trendingRows,
      recommended,
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
      trending = [],
      recommendedServiceIds = [],
    }: {
      trending?: Array<{ categoryId: string; serviceIds: string[] }>
      recommendedServiceIds?: string[]
    } = body

    await prisma.$transaction(async (tx) => {
      await tx.homepageSection.deleteMany({})

      let sortOrder = 0
      for (const row of trending) {
        if (!row.categoryId || !Array.isArray(row.serviceIds)) continue
        await tx.homepageSection.create({
          data: {
            type: 'trending',
            categoryId: row.categoryId,
            serviceIds: row.serviceIds,
            sortOrder: sortOrder++,
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
