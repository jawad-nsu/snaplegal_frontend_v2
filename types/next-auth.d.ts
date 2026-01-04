import { UserType } from '@prisma/client'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    type: UserType
    phone?: string | null
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      type: UserType
      phone?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    type: UserType
  }
}

