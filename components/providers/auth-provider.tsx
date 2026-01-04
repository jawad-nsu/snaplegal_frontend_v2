'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { UserType } from '@prisma/client'

interface User {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  type: UserType
  image?: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isPartner: boolean
  isUser: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isPartner: false,
  isUser: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const user: User | null = session?.user
    ? {
        id: (session.user as any).id || '',
        name: session.user.name,
        email: session.user.email,
        phone: (session.user as any).phone || null,
        type: (session.user as any).type || 'USER',
        image: session.user.image,
      }
    : null

  const isLoading = status === 'loading'
  const isAuthenticated = !!user
  const isPartner = user?.type === 'PARTNER'
  const isUser = user?.type === 'USER'

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isPartner,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

