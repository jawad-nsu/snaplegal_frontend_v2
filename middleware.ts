import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/signin',
    '/signup',
    '/verify-otp',
    '/forgot-password',
    '/all-services',
    '/services',
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get session using lightweight decoder
  const session = await getSessionFromRequest(request)

  // Protected routes
  if (!session?.user) {
    // Redirect to sign in if not authenticated
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Admin-only routes
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (isAdminRoute && session.user.type !== 'ADMIN') {
    // Redirect non-admins away from admin routes
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Partner-only routes
  const partnerRoutes = ['/vendor']
  const isPartnerRoute = partnerRoutes.some(route => pathname.startsWith(route))
  
  if (isPartnerRoute && session.user.type !== 'PARTNER') {
    // Redirect non-partners away from partner routes
    return NextResponse.redirect(new URL('/', request.url))
  }

  // User-only routes (if any)
  const userRoutes = ['/account']
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route))
  
  // Only redirect if user type is explicitly PARTNER
  // Allow access if type is USER or undefined/null (defaults to USER)
  if (isUserRoute && session.user.type === 'PARTNER') {
    // Redirect partners away from user-only routes
    return NextResponse.redirect(new URL('/vendor', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

