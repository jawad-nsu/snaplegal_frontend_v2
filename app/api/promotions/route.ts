import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'
import { PromotionType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.type !== 'ADMIN' && session.user.type !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      promotions: promotions.map((p) => ({
        id: p.id,
        code: p.code,
        type: p.type,
        value: p.value,
        minPurchase: p.minPurchase,
        maxDiscount: p.maxDiscount,
        validFrom: p.validFrom.toISOString(),
        validTo: p.validTo.toISOString(),
        usageLimit: p.usageLimit,
        usedCount: p.usedCount,
        isActive: p.isActive,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Fetch promotions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.type !== 'ADMIN' && session.user.type !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      code,
      type,
      value,
      validFrom,
      validTo,
      minPurchase,
      maxDiscount,
      usageLimit,
    } = body

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      )
    }
    if (!type || !['Percentage', 'Fixed'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be Percentage or Fixed' },
        { status: 400 }
      )
    }
    const numValue = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      return NextResponse.json(
        { error: 'Value must be a positive number' },
        { status: 400 }
      )
    }
    if (type === 'Percentage' && numValue > 100) {
      return NextResponse.json(
        { error: 'Percentage value cannot exceed 100' },
        { status: 400 }
      )
    }
    const fromDate = validFrom ? new Date(validFrom) : null
    const toDate = validTo ? new Date(validTo) : null
    if (!fromDate || isNaN(fromDate.getTime())) {
      return NextResponse.json(
        { error: 'Valid from date is required' },
        { status: 400 }
      )
    }
    if (!toDate || isNaN(toDate.getTime())) {
      return NextResponse.json(
        { error: 'Valid to date is required' },
        { status: 400 }
      )
    }
    if (toDate < fromDate) {
      return NextResponse.json(
        { error: 'Valid to must be after valid from' },
        { status: 400 }
      )
    }

    const existing = await prisma.promotion.findUnique({
      where: { code: code.trim().toUpperCase() },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A promotion with this code already exists' },
        { status: 400 }
      )
    }

    const promotion = await prisma.promotion.create({
      data: {
        code: code.trim().toUpperCase(),
        type: type as PromotionType,
        value: numValue,
        validFrom: fromDate,
        validTo: toDate,
        minPurchase:
          minPurchase != null && minPurchase !== ''
            ? parseFloat(minPurchase)
            : null,
        maxDiscount:
          maxDiscount != null && maxDiscount !== ''
            ? parseFloat(maxDiscount)
            : null,
        usageLimit:
          usageLimit != null && usageLimit !== ''
            ? parseInt(usageLimit, 10)
            : null,
      },
    })

    return NextResponse.json({
      success: true,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
        minPurchase: promotion.minPurchase,
        maxDiscount: promotion.maxDiscount,
        validFrom: promotion.validFrom.toISOString(),
        validTo: promotion.validTo.toISOString(),
        usageLimit: promotion.usageLimit,
        usedCount: promotion.usedCount,
        isActive: promotion.isActive,
        createdAt: promotion.createdAt.toISOString(),
        updatedAt: promotion.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Create promotion error:', error)
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 500 }
    )
  }
}
