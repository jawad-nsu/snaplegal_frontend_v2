import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/middleware-auth'
import { OrderStatus } from '@prisma/client'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const session = await getSessionFromRequest(request)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Build where clause
    const where: any = { id }

    // Regular users see only their own orders
    if (session.user.type === 'USER') {
      where.customerId = session.user.id
    }
    // For ADMIN/EMPLOYEE, they can see all orders

    // Fetch order with related data
    const order = await prisma.order.findFirst({
      where,
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
                requiredDocuments: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Format scheduled date/time
    let schedule = {
      dateRange: 'Not scheduled',
      day: '',
      timeSlot: '',
    }
    
    if (order.scheduledDate) {
      const date = new Date(order.scheduledDate)
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      const timeStr = order.scheduledTime || ''
      
      // Calculate if it's today, tomorrow, or a date range
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const scheduledDate = new Date(date)
      scheduledDate.setHours(0, 0, 0, 0)
      
      const diffTime = scheduledDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let dayLabel = ''
      if (diffDays === 0) {
        dayLabel = 'Today'
      } else if (diffDays === 1) {
        dayLabel = 'Tomorrow'
      } else {
        dayLabel = dateStr
      }
      
      schedule = {
        dateRange: dateStr,
        day: dayLabel,
        timeSlot: timeStr,
      }
    }

    // Get all unique required documents from all services in the order
    const allRequiredDocuments = new Set<string>()
    order.items.forEach((item) => {
      if (item.service?.requiredDocuments) {
        item.service.requiredDocuments.forEach((doc) => allRequiredDocuments.add(doc))
      }
    })

    // Transform order items
    const transformedItems = order.items.map((item) => ({
      id: item.id,
      name: item.serviceName,
      details: item.details || '',
      price: item.price * item.quantity,
      quantity: item.quantity,
      serviceId: item.serviceId,
      service: item.service ? {
        id: item.service.id,
        title: item.service.title,
        image: item.service.image,
        slug: item.service.slug,
      } : null,
    }))

    // Build timeline stages based on order status
    const statusOrder: OrderStatus[] = [
      'Submitted',
      'Confirmed',
      'Assigned',
      'InProgress',
      'Review',
      'Delivered',
      'Closed',
    ]
    
    const currentStatusIndex = statusOrder.indexOf(order.status)
    const timelineStages = statusOrder.map((status, index) => ({
      label: formatOrderStatus(status),
      completed: index <= currentStatusIndex && order.status !== 'Cancelled',
    }))

    // Get first item's service image for display
    const firstItem = order.items[0]
    const serviceImage = firstItem?.service?.image || '/legal_service_img.jpg'
    const serviceName = firstItem?.serviceName || 'Service'

    // Transform order for frontend
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: formatOrderStatus(order.status),
      statusEnum: order.status,
      service: serviceName,
      serviceImage: serviceImage,
      price: order.total,
      schedule: schedule,
      customer: {
        name: order.customer.name || 'N/A',
        phone: order.customer.phone || 'N/A',
        address: order.customer.address || 'N/A',
      },
      items: transformedItems,
      subtotal: order.subtotal,
      additionalCost: order.additionalCost,
      deliveryCharge: order.deliveryCharge,
      discount: order.discount,
      total: order.total,
      scheduledDate: order.scheduledDate?.toISOString(),
      scheduledTime: order.scheduledTime,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      address: order.address,
      notes: order.notes,
      promoCode: order.promoCode,
      promoDiscount: order.promoDiscount ?? 0,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      timelineStages: timelineStages,
      requiredDocuments: Array.from(allRequiredDocuments).map((doc, index) => ({
        id: `doc-${index}`,
        name: doc,
        required: true, // All documents from service are required
      })),
    }

    return NextResponse.json({
      success: true,
      order: transformedOrder,
    })
  } catch (error) {
    console.error('Fetch order error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const session = await getSessionFromRequest(request)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only ADMIN and EMPLOYEE can update order status
    if (session.user.type !== 'ADMIN' && session.user.type !== 'EMPLOYEE') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and employees can update order status' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status, vendorId } = body

    // Validate status if provided
    if (status) {
      const validStatuses: OrderStatus[] = [
        'Submitted',
        'Confirmed',
        'Assigned',
        'InProgress',
        'Review',
        'Delivered',
        'Closed',
        'Cancelled',
      ]
      
      if (!validStatuses.includes(status as OrderStatus)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    if (status) {
      updateData.status = status as OrderStatus
    }
    if (vendorId !== undefined) {
      updateData.vendorId = vendorId || null
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
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
    })

    // Format scheduled date/time
    let schedule = {
      dateRange: 'Not scheduled',
      day: '',
      timeSlot: '',
    }
    
    if (updatedOrder.scheduledDate) {
      const date = new Date(updatedOrder.scheduledDate)
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      const timeStr = updatedOrder.scheduledTime || ''
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const scheduledDate = new Date(date)
      scheduledDate.setHours(0, 0, 0, 0)
      
      const diffTime = scheduledDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let dayLabel = ''
      if (diffDays === 0) {
        dayLabel = 'Today'
      } else if (diffDays === 1) {
        dayLabel = 'Tomorrow'
      } else {
        dayLabel = dateStr
      }
      
      schedule = {
        dateRange: dateStr,
        day: dayLabel,
        timeSlot: timeStr,
      }
    }

    // Get all unique required documents from all services in the order
    const allRequiredDocuments = new Set<string>()
    updatedOrder.items.forEach((item) => {
      if (item.service?.requiredDocuments) {
        item.service.requiredDocuments.forEach((doc) => allRequiredDocuments.add(doc))
      }
    })

    // Transform order items
    const transformedItems = updatedOrder.items.map((item) => ({
      id: item.id,
      name: item.serviceName,
      details: item.details || '',
      price: item.price * item.quantity,
      quantity: item.quantity,
      serviceId: item.serviceId,
      service: item.service ? {
        id: item.service.id,
        title: item.service.title,
        image: item.service.image,
        slug: item.service.slug,
      } : null,
    }))

    // Build timeline stages based on order status
    const statusOrder: OrderStatus[] = [
      'Submitted',
      'Confirmed',
      'Assigned',
      'InProgress',
      'Review',
      'Delivered',
      'Closed',
    ]
    
    const currentStatusIndex = statusOrder.indexOf(updatedOrder.status)
    const timelineStages = statusOrder.map((status, index) => ({
      label: formatOrderStatus(status),
      completed: index <= currentStatusIndex && updatedOrder.status !== 'Cancelled',
    }))

    // Get first item's service image for display
    const firstItem = updatedOrder.items[0]
    const serviceImage = firstItem?.service?.image || '/legal_service_img.jpg'
    const serviceName = firstItem?.serviceName || 'Service'

    // Transform order for frontend
    const transformedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      status: formatOrderStatus(updatedOrder.status),
      statusEnum: updatedOrder.status,
      service: serviceName,
      serviceImage: serviceImage,
      price: updatedOrder.total,
      schedule: schedule,
      customer: {
        name: updatedOrder.customer.name || 'N/A',
        phone: updatedOrder.customer.phone || 'N/A',
        address: updatedOrder.customer.address || 'N/A',
      },
      vendor: updatedOrder.vendor ? {
        id: updatedOrder.vendor.id,
        name: updatedOrder.vendor.name,
      } : undefined,
      items: transformedItems,
      subtotal: updatedOrder.subtotal,
      additionalCost: updatedOrder.additionalCost,
      deliveryCharge: updatedOrder.deliveryCharge,
      discount: updatedOrder.discount,
      total: updatedOrder.total,
      scheduledDate: updatedOrder.scheduledDate?.toISOString(),
      scheduledTime: updatedOrder.scheduledTime,
      paymentMethod: updatedOrder.paymentMethod,
      paymentStatus: updatedOrder.paymentStatus,
      address: updatedOrder.address,
      notes: updatedOrder.notes,
      promoCode: updatedOrder.promoCode,
      promoDiscount: updatedOrder.promoDiscount ?? 0,
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString(),
      timelineStages: timelineStages,
      requiredDocuments: Array.from(allRequiredDocuments).map((doc, index) => ({
        id: `doc-${index}`,
        name: doc,
        required: true,
      })),
    }

    return NextResponse.json({
      success: true,
      order: transformedOrder,
    })
  } catch (error) {
    console.error('Update order error:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}