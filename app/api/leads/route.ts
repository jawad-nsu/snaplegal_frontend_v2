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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const stage = searchParams.get('stage')
    const source = searchParams.get('source')
    const owner = searchParams.get('owner')

    const where: any = {}

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
        { whatsapp: { contains: search } },
        { desiredService: { contains: search, mode: 'insensitive' } },
        { leadOwner: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (stage && stage !== 'all') {
      where.stage = toPrismaEnum(stage) as any
    }

    if (source && source !== 'all') {
      where.leadSource = toPrismaEnum(source) as any
    }

    if (owner && owner !== 'all') {
      where.leadOwner = owner
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      leads: leads.map(lead => ({
        id: lead.id,
        clientName: lead.clientName,
        whatsapp: lead.whatsapp,
        mobile: lead.mobile,
        facebook: lead.facebook,
        email: lead.email,
        profession: lead.profession,
        street: lead.street,
        city: lead.city,
        thana: lead.thana,
        district: lead.district,
        country: lead.country,
        postalCode: lead.postalCode,
        desiredService: lead.desiredService,
        initialDiscussion: lead.initialDiscussion,
        stage: fromPrismaEnum(lead.stage),
        closedReason: lead.closedReason ? fromPrismaEnum(lead.closedReason) : undefined,
        closedReasonText: lead.closedReasonText,
        leadSource: fromPrismaEnum(lead.leadSource),
        leadSubSource: lead.leadSubSource ? fromPrismaEnum(lead.leadSubSource) : undefined,
        leadOwner: lead.leadOwner,
        comment: lead.comment,
        createdAt: lead.createdAt.toISOString().split('T')[0],
      })),
    })
  } catch (error) {
    console.error('Fetch leads error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.clientName || !body.leadSource || !body.leadOwner) {
      return NextResponse.json(
        { error: 'Client Name, Lead Source, and Lead Owner are required' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.create({
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
        createdAt: lead.createdAt.toISOString().split('T')[0],
      },
    })
  } catch (error) {
    console.error('Create lead error:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}

