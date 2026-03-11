'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { NotificationCenter } from './NotificationCenter'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NotificationCenter />
      {children}
    </SessionProvider>
  )
}
