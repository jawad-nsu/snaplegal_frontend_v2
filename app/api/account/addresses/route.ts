import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const list = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        type: true,
        location: true,
        isDefault: true,
      },
    })

    const addresses = list.map((a) => ({
      id: a.id,
      type: a.type,
      location: a.location,
      isDefault: a.isDefault,
    }))

    return NextResponse.json({ success: true, addresses })
  } catch (error) {
    console.error('Fetch addresses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const body = await request.json()
    const { type, location, isDefault } = body

    if (!type?.trim()) {
      return NextResponse.json(
        { error: 'Address type is required' },
        { status: 400 }
      )
    }

    const setAsDefault = Boolean(isDefault)

    const created = await prisma.userAddress.create({
      data: {
        userId,
        type: type.trim(),
        location: (location ?? '').trim(),
        isDefault: setAsDefault,
      },
    })

    if (setAsDefault) {
      await prisma.userAddress.updateMany({
        where: { userId, id: { not: created.id } },
        data: { isDefault: false },
      })
    }

    return NextResponse.json({
      success: true,
      address: {
        id: created.id,
        type: created.type,
        location: created.location,
        isDefault: created.isDefault,
      },
    })
  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}
