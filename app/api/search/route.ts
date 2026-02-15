import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** Normalize string for search so Unicode (e.g. Bangla) matches regardless of NFC/NFD form */
function normalizeForSearch(str: string): string {
  if (typeof str !== 'string') return ''
  return str.trim().normalize('NFC').toLowerCase()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const raw = (searchParams.get('q') || searchParams.get('search') || '').trim()
    const q = raw ? normalizeForSearch(raw) : ''

    if (!q) {
      return NextResponse.json({
        success: true,
        services: [],
        categories: [],
        subcategories: [],
      })
    }

    const [services, categories, subcategories] = await Promise.all([
      prisma.service.findMany({
        where: { status: 'active' },
        include: {
          category: { select: { id: true, title: true } },
          subCategory: { select: { id: true, title: true } },
        },
        orderBy: [{ serialNumber: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.category.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subCategory.findMany({
        where: { status: 'active' },
        include: {
          category: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const filteredServices = services.filter(
      (s) =>
        normalizeForSearch(s.title).includes(q) ||
        (s.keywords || []).some((k) => typeof k === 'string' && normalizeForSearch(k).includes(q))
    )

    const filteredCategories = categories.filter((c) =>
      normalizeForSearch(c.title).includes(q)
    )

    const filteredSubcategories = subcategories.filter((s) =>
      normalizeForSearch(s.title).includes(q)
    )

    return NextResponse.json({
      success: true,
      services: filteredServices.map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        startingPrice: s.startingPrice || '',
        categoryTitle: s.category?.title || '',
        subCategoryTitle: s.subCategory?.title || '',
      })),
      categories: filteredCategories.map((c) => ({
        id: c.id,
        title: c.title,
        icon: c.icon || '',
      })),
      subcategories: filteredSubcategories.map((s) => ({
        id: s.id,
        title: s.title,
        categoryId: s.categoryId,
        categoryTitle: s.category?.title || '',
        icon: s.icon || '',
      })),
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}
