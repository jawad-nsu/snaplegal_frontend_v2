import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserType } from '@prisma/client'

export async function GET() {
  try {
    // Fetch all users with type ADMIN or EMPLOYEE (exclude regular USER and PARTNER)
    const employees = await prisma.user.findMany({
      where: {
        OR: [
          { type: 'ADMIN' as UserType },
          { type: 'EMPLOYEE' as UserType },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      employees: employees.map(emp => ({
        id: emp.id,
        name: emp.name || 'Unnamed Employee',
        email: emp.email || '',
        phone: emp.phone || '',
      })),
    })
  } catch (error) {
    console.error('Fetch employees error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

