import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, cartTotal } = body

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { valid: false, message: 'Promo code is required' },
        { status: 400 }
      )
    }
    const cartValue =
      typeof cartTotal === 'number' ? cartTotal : parseFloat(cartTotal)
    if (isNaN(cartValue) || cartValue < 0) {
      return NextResponse.json(
        { valid: false, message: 'Invalid cart total' },
        { status: 400 }
      )
    }

    const promotion = await prisma.promotion.findFirst({
      where: {
        code: code.trim().toUpperCase(),
        isActive: true,
      },
    })

    if (!promotion) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid or expired promo code',
      })
    }

    const now = new Date()
    if (now < promotion.validFrom) {
      return NextResponse.json({
        valid: false,
        message: 'This promo code is not yet valid',
      })
    }
    if (now > promotion.validTo) {
      return NextResponse.json({
        valid: false,
        message: 'This promo code has expired',
      })
    }

    if (
      promotion.usageLimit != null &&
      promotion.usedCount >= promotion.usageLimit
    ) {
      return NextResponse.json({
        valid: false,
        message: 'This promo code has reached its usage limit',
      })
    }

    if (
      promotion.minPurchase != null &&
      cartValue < promotion.minPurchase
    ) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order of ৳${promotion.minPurchase.toLocaleString()} required`,
      })
    }

    let discount = 0
    if (promotion.type === 'Percentage') {
      discount = (cartValue * promotion.value) / 100
      if (
        promotion.maxDiscount != null &&
        discount > promotion.maxDiscount
      ) {
        discount = promotion.maxDiscount
      }
    } else {
      discount = Math.min(promotion.value, cartValue)
    }

    return NextResponse.json({
      valid: true,
      code: promotion.code,
      discount: Math.round(discount * 100) / 100,
    })
  } catch (error) {
    console.error('Validate promo error:', error)
    return NextResponse.json(
      { valid: false, message: 'Failed to validate promo code' },
      { status: 500 }
    )
  }
}
