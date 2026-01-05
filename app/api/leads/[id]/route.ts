import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper functions to convert between frontend format (spaces) and Prisma format (underscores)
const toPrismaEnum = (value: string): string => {
  return value.replace(/ /g, '_').replace(/\(/g, '').replace(/\)/g, '')
}

const fromPrismaEnum = (value: string): string => {
  return value
    .replace(/_/g, ' ')
    .replace(/Lost Unqualified/g, 'Lost (Unqualified)')
    .replace(/Social Media/g, 'Social Media')
    .replace(/Cold Call/g, 'Cold Call')
    .replace(/Facebook Ads/g, 'Facebook Ads')
    .replace(/Google Ads/g, 'Google Ads')
    .replace(/Word of Mouth/g, 'Word of Mouth')
    .replace(/Email Campaign/g, 'Email Campaign')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await prisma.lead.findUnique({
      where: { id },
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lead: {
        ...lead,
        stage: fromPrismaEnum(lead.stage),
        closedReason: lead.closedReason ? fromPrismaEnum(lead.closedReason) : undefined,
        leadSource: fromPrismaEnum(lead.leadSource),
        leadSubSource: lead.leadSubSource ? fromPrismaEnum(lead.leadSubSource) : undefined,
        createdAt: lead.createdAt.toISOString().split('T')[0],
      },
    })
  } catch (error) {
    console.error('Fetch lead error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    if (!body.clientName || !body.leadSource || !body.leadOwner) {
      return NextResponse.json(
        { error: 'Client Name, Lead Source, and Lead Owner are required' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        clientName: body.clientName,
        whatsapp: body.whatsapp || null,
        mobile: body.mobile || null,
        facebook: body.facebook || null,
        email: body.email || null,
        profession: body.profession || null,
        street: body.street || null,
        city: body.city || null,
        thana: body.thana || null,
        district: body.district || null,
        country: body.country || 'Bangladesh',
        postalCode: body.postalCode || null,
        desiredService: body.desiredService || null,
        initialDiscussion: body.initialDiscussion || null,
        stage: toPrismaEnum(body.stage || 'New') as any,
        closedReason: body.closedReason ? (toPrismaEnum(body.closedReason) as any) : null,
        closedReasonText: body.closedReasonText || null,
        leadSource: toPrismaEnum(body.leadSource) as any,
        leadSubSource: body.leadSubSource ? (toPrismaEnum(body.leadSubSource) as any) : null,
        leadOwner: body.leadOwner,
        comment: body.comment || null,
      },
    })

    return NextResponse.json({
      success: true,
      lead: {
        ...lead,
        stage: fromPrismaEnum(lead.stage),
        closedReason: lead.closedReason ? fromPrismaEnum(lead.closedReason) : undefined,
        leadSource: fromPrismaEnum(lead.leadSource),
        leadSubSource: lead.leadSubSource ? fromPrismaEnum(lead.leadSubSource) : undefined,
        createdAt: lead.createdAt.toISOString().split('T')[0],
      },
    })
  } catch (error) {
    console.error('Update lead error:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
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
    await prisma.lead.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    })
  } catch (error) {
    console.error('Delete lead error:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}

