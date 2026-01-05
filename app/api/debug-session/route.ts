import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/middleware-auth'

export async function GET(request: NextRequest) {
  // Get all cookies
  const cookies: Record<string, string> = {}
  const cookieList = request.cookies.getAll()
  cookieList.forEach(cookie => {
    cookies[cookie.name] = cookie.value.length > 50 
      ? cookie.value.substring(0, 50) + '...' 
      : cookie.value
  })

  // Get cookie header directly
  const cookieHeader = request.headers.get('cookie') || ''

  // Try NextAuth getServerSession (v4)
  // Note: getServerSession doesn't work directly in App Router without req/res
  // We'll use the decoder instead
  let nextAuthSession = null
  try {
    // For App Router, we need to pass the request context
    // This is a limitation - getServerSession works better in Pages Router
    nextAuthSession = { note: 'getServerSession requires req/res context in v4' }
  } catch (error) {
    nextAuthSession = { error: String(error) }
  }

  // Try our decoder
  const decodedSession = await getSessionFromRequest(request)

  return NextResponse.json({
    cookieHeader: cookieHeader.substring(0, 200), // First 200 chars
    cookieCount: cookieList.length,
    cookies: Object.keys(cookies),
    cookieNames: Object.keys(cookies),
    allCookies: cookies,
    nextAuthSession,
    decodedSession,
  }, { status: 200 })
}

