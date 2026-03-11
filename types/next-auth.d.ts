import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
    accessToken?: string
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
  }
}
