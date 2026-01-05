import { NextRequest } from 'next/server'
import { UserType } from '@prisma/client'

/**
 * Lightweight session decoder for Edge middleware
 * Decodes JWT token from NextAuth cookie without importing heavy dependencies
 * This keeps the middleware bundle size under Vercel's 1MB limit
 */

interface DecodedToken {
  id?: string
  type?: UserType
  email?: string | null
  name?: string | null
  exp?: number
}

/**
 * Decode base64 URL-safe string
 */
function base64UrlDecode(str: string): string {
  // Add padding if needed
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  return atob(base64)
}

/**
 * Decode JWT token from NextAuth cookie
 * NextAuth v5 stores JWT tokens in cookies with JWT strategy
 */
export async function getSessionFromRequest(request: NextRequest) {
  try {
    // NextAuth v5 cookie name patterns
    // In production: __Secure-authjs.session-token
    // In development: authjs.session-token
    const cookieName = process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token'

    const sessionToken = request.cookies.get(cookieName)?.value

    if (!sessionToken) {
      return null
    }

    // JWT format: header.payload.signature
    const parts = sessionToken.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (second part)
    let decoded: DecodedToken
    try {
      const payload = parts[1]
      const decodedPayload = base64UrlDecode(payload)
      decoded = JSON.parse(decodedPayload) as DecodedToken
    } catch (error) {
      // If decoding fails, treat as no session
      return null
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null
    }

    // Extract user data from token
    if (decoded.id && decoded.type) {
      return {
        user: {
          id: decoded.id,
          type: decoded.type,
          email: decoded.email || null,
          name: decoded.name || null,
        },
      }
    }

    return null
  } catch (error) {
    // If any error occurs, treat as no session
    return null
  }
}

