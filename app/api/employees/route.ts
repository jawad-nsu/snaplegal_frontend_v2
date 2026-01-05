import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch all users with type ADMIN or EMPLOYEE (exclude regular USER and PARTNER)
    // Note: Prisma client needs to be regenerated after adding EMPLOYEE to UserType enum
    const employees = await prisma.user.findMany({
      where: {
        OR: [
          // @ts-expect-error - Temporary workaround until Prisma client is regenerated
          { type: 'ADMIN' },
          // @ts-expect-error - Temporary workaround until Prisma client is regenerated
          { type: 'EMPLOYEE' },
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

