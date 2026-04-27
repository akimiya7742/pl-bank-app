import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { Button } from '@/components/ui/button'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type LeaderboardPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LeaderboardPageProps) {
  const { locale } = await params
  const titles = {
    en: 'Leaderboard - PL Bank',
    vi: 'Xếp hạng - PL BANK',
  }
  const descriptions = {
    en: 'View other members balance',
    vi: 'Xem số dư các thành viên khác',
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  }
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/${locale}/auth/signin`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="ghost" size="icon" className="text-white dark:text-slate-100 h-10 w-10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold text-white dark:text-slate-50">
                {locale === 'vi' ? 'Xếp hạng' : 'Leaderboard'}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <nav className="flex flex-wrap gap-2">
                <Link href={`/${locale}/dashboard`}>
                  <Button variant="ghost" className="text-white dark:text-slate-100 text-sm sm:text-base">
                    {locale === 'vi' ? 'Tổng quan' : 'Dashboard'}
                  </Button>
                </Link>
                <Link href={`/${locale}/transfer`}>
                  <Button variant="ghost" className="text-white dark:text-slate-100 text-sm sm:text-base">
                    {locale === 'vi' ? 'Chuyển khoản' : 'Transfer'}
                  </Button>
                </Link>
              </nav>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          {/* Leaderboard Table */}
          <LeaderboardTable locale={locale} />
        </div>
      </div>
    </div>
  )
}
