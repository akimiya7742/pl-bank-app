'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { NotificationCenter } from './NotificationCenter'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SessionProvider>
        <NotificationCenter />
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
}
