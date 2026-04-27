import { Providers } from '@/components/providers'
import { Analytics } from '@vercel/analytics/next'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

const locales = ['en', 'vi']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
