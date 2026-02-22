import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client'

// Helper function to convert OrderStatus enum to display format
const formatOrderStatus = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    Submitted: 'Initiated',
    Confirmed: 'Confirmed',
    Assigned: 'Assigned',
    InProgress: 'In Progress',
    Review: 'Review',
    Delivered: 'Delivered',
    Closed: 'Closed',
    Cancelled: 'Cancelled',
  }
  return statusMap[status] || status
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getSessionFromRequest(request)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    // Regular users see only their own orders
    // Admin/Employee can see all orders (future enhancement)
    if (session.user.type === 'USER') {
      where.customerId = session.user.id
    }
    // For ADMIN/EMPLOYEE, we can add logic later to see all orders

    // Filter by status
    if (status && status !== 'All' && status !== 'all') {
      // Map display status to enum
      const statusMap: Record<string, OrderStatus> = {
        'Initiated': 'Submitted',
        'In Progress': 'InProgress',
        'Confirmed': 'Confirmed',
        'Assigned': 'Assigned',
        'Review': 'Review',
        'Delivered': 'Delivered',
        'Closed': 'Closed',
        'Cancelled': 'Cancelled',
      }
      const enumStatus = statusMap[status] || status
      if (Object.values(OrderStatus).includes(enumStatus as OrderStatus)) {
        where.status = enumStatus as OrderStatus
      }
    }

    // Get total count for pagination
    const total = await prisma.order.count({ where })

    // Fetch orders with related data
    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            service: {
              select: {
                id: true,
                title: true,
                image: true,
                slug: true,
                requiredDocuments: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    // Transform orders for frontend
    const transformedOrders = orders.map((order) => {
      // Get first item's service for display
      const firstItem = order.items[0]
      const serviceImage = firstItem?.service?.image || '/legal_service_img.jpg'
      const serviceName = firstItem?.serviceName || 'Service'

      // Format scheduled date/time
      let schedule = 'Not scheduled'
      if (order.scheduledDate) {
        const date = new Date(order.scheduledDate)
        const dateStr = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        const timeStr = order.scheduledTime || ''
        schedule = timeStr ? `${timeStr}, ${dateStr}` : dateStr
      }

      // Get all unique required documents from all services in the order
      const allRequiredDocuments = new Set<string>()
      order.items.forEach((item) => {
        if (item.service?.requiredDocuments) {
          item.service.requiredDocuments.forEach((doc) => allRequiredDocuments.add(doc))
        }
      })

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: formatOrderStatus(order.status),
        statusEnum: order.status,
        service: serviceName,
        serviceImage: serviceImage,
        schedule: schedule,
        duePrice: order.total,
        subtotal: order.subtotal,
        additionalCost: order.additionalCost,
        deliveryCharge: order.deliveryCharge,
        discount: order.discount,
        promoCode: order.promoCode,
        promoDiscount: order.promoDiscount ?? 0,
        total: order.total,
        scheduledDate: order.scheduledDate?.toISOString(),
        scheduledTime: order.scheduledTime,
        customer: order.customer,
        vendor: order.vendor ? {
          id: order.vendor.id,
          name: order.vendor.name,
          email: order.vendor.email,
          phone: order.vendor.phone,
        } : null,
        items: order.items.map((item) => ({
          id: item.id,
          serviceName: item.serviceName,
          service: item.service,
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.originalPrice,
          details: item.details,
        })),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        address: order.address,
        notes: order.notes,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        requiredDocuments: Array.from(allRequiredDocuments).map((doc, index) => ({
          id: `doc-${index}`,
          name: doc,
          required: true, // All documents from service are required
        })),
      }
    })

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Fetch orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getSessionFromRequest(request)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      items,
      address,
      scheduledDate,
      scheduledTime,
      notes,
      paymentMethod,
      orderNumber,
      promoCode,
      promoDiscount,
    } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Validate payment method enum
    const validPaymentMethods = ['bKash', 'Card', 'Cash']
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    let totalDiscount = 0

    // Validate and process items
    const orderItems = []
    for (const item of items) {
      if (!item.serviceName || !item.price || !item.quantity) {
        return NextResponse.json(
          { error: 'Each item must have serviceName, price, and quantity' },
          { status: 400 }
        )
      }

      const itemSubtotal = item.originalPrice 
        ? item.originalPrice * item.quantity 
        : item.price * item.quantity
      const itemDiscount = item.originalPrice 
        ? (item.originalPrice - item.price) * item.quantity 
        : 0

      subtotal += itemSubtotal
      totalDiscount += itemDiscount

      orderItems.push({
        serviceId: item.serviceId || null,
        serviceName: item.serviceName,
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        details: item.details || item.tonnage || null,
      })
    }

    const additionalCost = 0
    const deliveryCharge = 0
    const discount = totalDiscount
    const promoDiscountAmount =
      typeof promoDiscount === 'number' && promoDiscount >= 0 ? promoDiscount : 0
    const total =
      subtotal -
      discount -
      promoDiscountAmount +
      additionalCost +
      deliveryCharge

    // Generate order number if not provided
    let finalOrderNumber = orderNumber
    if (!finalOrderNumber) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
      finalOrderNumber = `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`
    }

    // Check if order number already exists
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: finalOrderNumber },
    })

    if (existingOrder) {
      // If order exists, return it instead of creating a new one
      const orderWithItems = await prisma.order.findUnique({
        where: { id: existingOrder.id },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              address: true,
            },
          },
          items: {
            include: {
              service: {
                select: {
                  id: true,
                  title: true,
                  image: true,
                  slug: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json({
        success: true,
        order: {
          id: orderWithItems!.id,
          orderNumber: orderWithItems!.orderNumber,
          status: formatOrderStatus(orderWithItems!.status),
          statusEnum: orderWithItems!.status,
          total: orderWithItems!.total,
          paymentMethod: orderWithItems!.paymentMethod,
          paymentStatus: orderWithItems!.paymentStatus,
        },
        message: 'Order already exists',
      })
    }

    const promoCodeStr =
      typeof promoCode === 'string' && promoCode.trim()
        ? promoCode.trim().toUpperCase()
        : null

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber: finalOrderNumber,
        customerId: session.user.id,
        status: OrderStatus.Submitted,
        paymentMethod: paymentMethod as PaymentMethod,
        paymentStatus: PaymentStatus.Pending,
        subtotal,
        additionalCost,
        deliveryCharge,
        discount,
        promoCode: promoCodeStr,
        promoDiscount: promoDiscountAmount,
        total,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        scheduledTime: scheduledTime || null,
        address: address || null,
        notes: notes || null,
        items: {
          create: orderItems,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
          },
        },
        items: {
          include: {
            service: {
              select: {
                id: true,
                title: true,
                image: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    if (promoCodeStr && promoDiscountAmount > 0) {
      try {
        await prisma.promotion.updateMany({
          where: { code: promoCodeStr },
          data: { usedCount: { increment: 1 } },
        })
      } catch (e) {
        console.error('Failed to increment promo usedCount:', e)
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: formatOrderStatus(order.status),
        statusEnum: order.status,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      },
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

