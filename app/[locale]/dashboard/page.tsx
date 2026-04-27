import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { ProfileCard } from '@/components/ProfileCard'
import { BalanceDisplay } from '@/components/BalanceDisplay'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { TaxPaymentButton } from '@/components/TaxPaymentButton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRightLeft, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Dashboard - PL Bank',
  description: 'View your balance and manage your account',
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const session = await getServerSession(authOptions)
  const { locale } = await params

  if (!session) {
    redirect(`/${locale}/auth/signin`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white dark:text-slate-50">PL Bank</h1>
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
                <Link href={`/${locale}/leaderboard`}>
                  <Button variant="ghost" className="text-white dark:text-slate-100 text-sm sm:text-base">
                    {locale === 'vi' ? 'Xếp hạng' : 'Leaderboard'}
                  </Button>
                </Link>
              </nav>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          {/* Profile */}
          <ProfileCard />

          {/* Balance Display */}
          <BalanceDisplay
            locale={locale}
            labels={
              locale === 'vi'
                ? {
                    cash: 'Số dư khả dụng',
                    bank: 'Số dư ví',
                    total: 'Tổng số dư',
                  }
                : {
                    cash: 'Available Balance',
                    bank: 'Wallet Balance',
                    total: 'Total Balance',
                  }
            }
          />

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href={`/${locale}/transfer`} className="block">
              <Button className="w-full h-24 bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col gap-2">
                <ArrowRightLeft className="w-6 h-6" />
                <span>{locale === 'vi' ? 'Chuyển khoản nhanh' : 'Quick Transfer'}</span>
              </Button>
            </Link>
            <Link href={`/${locale}/leaderboard`} className="block">
              <Button className="w-full h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>{locale === 'vi' ? 'Xem số dư' : 'View Leaderboard'}</span>
              </Button>
            </Link>
            <TaxPaymentButton locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}
