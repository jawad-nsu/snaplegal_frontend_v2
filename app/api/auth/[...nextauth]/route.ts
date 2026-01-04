import NextAuth, { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { getRedirectPath } from '@/lib/auth'
import { UserType } from '@prisma/client'

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
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

        const userType = (credentials.userType as string) || 'user'
        const username = credentials.username as string
        const password = credentials.password as string

        // Find user by email or phone
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: username },
              { phone: username },
            ],
            type: userType === 'partner' ? 'PARTNER' : 'USER',
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
    async signIn({ user, account, profile }) {
      // For OAuth providers, we need to handle user type
      // This will be set during the signup flow
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.type = (user as any).type || 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.type = (token.type as UserType) || 'USER'
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
console.log('--process.env.NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET);
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export const { GET, POST } = handlers

