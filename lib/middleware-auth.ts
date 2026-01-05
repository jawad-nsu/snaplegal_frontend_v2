import { NextRequest } from 'next/server'
import { UserType } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

/**
 * Lightweight session decoder for Edge middleware
 * NOTE: NextAuth v4 stores JWT sessions as encrypted JWE cookies by default.
 * Because of that, "manual" base64 decoding of `header.payload.signature` will fail.
 * We use NextAuth's `getToken()` here so middleware auth matches `useSession()`.
 */

export async function getSessionFromRequest(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
    })

    if (!token) {
      return null
    }

    const id = (token as any).id as string | undefined
    if (!id) return null

    const rawType = (token as any).type as UserType | string | undefined
    const userType: UserType =
      rawType && Object.values(UserType).includes(rawType as UserType) ? (rawType as UserType) : UserType.USER

    return {
      user: {
        id,
        type: userType,
        email: ((token as any).email as string | null | undefined) ?? null,
        name: ((token as any).name as string | null | undefined) ?? null,
      },
    }

    return null
  } catch (error) {
    // If any error occurs, treat as no session
    return null
  }
}

