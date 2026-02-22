import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  return session.user.id
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params

    const existing = await prisma.userAddress.findFirst({
      where: { id, userId },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    const body = await request.json()
    const { type, location, isDefault } = body

    const updateData: { type?: string; location?: string; isDefault?: boolean } = {}
    if (type !== undefined) updateData.type = String(type).trim()
    if (location !== undefined) updateData.location = String(location).trim()
    if (typeof isDefault === 'boolean') updateData.isDefault = isDefault

    const updated = await prisma.userAddress.update({
      where: { id },
      data: updateData,
    })

    if (updated.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId, id: { not: id } },
        data: { isDefault: false },
      })
    }

    return NextResponse.json({
      success: true,
      address: {
        id: updated.id,
        type: updated.type,
        location: updated.location,
        isDefault: updated.isDefault,
      },
    })
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params

    const existing = await prisma.userAddress.findFirst({
      where: { id, userId },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    await prisma.userAddress.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
