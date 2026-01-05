import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest } from 'next/server'
import { getSessionFromRequest } from './middleware-auth'

/**
 * Get session from NextAuth v4
 * For App Router routes, we use getServerSession
 * For middleware/edge runtime, we use the lightweight decoder
 */
export async function getSession(request?: NextRequest) {
  // If in middleware/edge runtime, use lightweight decoder
  if (request) {
    return await getSessionFromRequest(request)
  }
  
  // Otherwise, use getServerSession (works in API routes)
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
}

