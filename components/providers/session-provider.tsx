'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export function NextAuthSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}

