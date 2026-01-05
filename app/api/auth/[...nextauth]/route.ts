import NextAuth, { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { UserType } from '@prisma/client'

export const authConfig: NextAuthConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as unknown as any,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const username = credentials.username as string
        const password = credentials.password as string

        // Find user by email or phone (don't filter by type to allow ADMIN users to log in)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: username },
              { phone: username },
            ],
          },
        })

        if (!user || !user.password) {
          return null
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          phone: user.phone,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn() {
      // For OAuth providers, we need to handle user type
      // This will be set during the signup flow
      return true
    },
    async jwt({ token, user, trigger, session: updateSession }) {
      // When user first signs in, store all user data in token
      if (user) {
        token.id = user.id
        token.type = (user as { type?: UserType }).type || 'USER'
        token.name = user.name
        token.email = user.email
        token.phone = (user as { phone?: string | null }).phone || null
        
        // For OAuth providers, fetch phone and type from database if not in user object
        // Also refresh type to ensure it's up-to-date (important for ADMIN users)
        if ((!token.phone || !token.type) && token.id) {
          try {
            // This runs on server-side during sign-in, so Prisma should work
            const userData = await prisma.user.findUnique({
              where: { id: token.id },
              select: { phone: true, type: true },
            })
            if (userData) {
              if (!token.phone) token.phone = userData.phone
              // Always refresh type from database to ensure it's current
              token.type = userData.type || token.type
            }
          } catch (error) {
            // If Prisma fails, continue without phone
            console.error('Failed to fetch user data:', error)
          }
        } else if (token.id && !token.type) {
          // If type is missing, fetch it from database
          try {
            const userData = await prisma.user.findUnique({
              where: { id: token.id },
              select: { type: true },
            })
            if (userData) {
              token.type = userData.type || 'USER'
            }
          } catch (error) {
            console.error('Failed to fetch user type:', error)
          }
        }
      }
      
      // When session is updated (e.g., profile update), refresh token data
      // Note: This only runs on server-side API routes, not in middleware/edge
      if (trigger === 'update' && updateSession && token.id) {
        try {
          const userData = await prisma.user.findUnique({
            where: { id: token.id },
            select: { name: true, email: true, phone: true, type: true },
          })
          
          if (userData) {
            token.name = userData.name
            token.email = userData.email
            token.phone = userData.phone
            token.type = userData.type
          }
        } catch (error) {
          // If Prisma fails, keep existing token data
          console.error('Failed to update token from database:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Use data from token (works on both edge and node runtime)
        session.user.id = token.id as string
        session.user.type = (token.type as UserType) || 'USER'
        session.user.name = (token.name as string | null | undefined) || session.user.name
        session.user.email = (token.email as string | null | undefined) || session.user.email
        session.user.phone = (token.phone as string | null | undefined) || null
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects based on user type
      // This will be handled in the sign-in/sign-up pages
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export const { GET, POST } = handlers

