import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { Button } from '@/components/ui/button'
import { ShopGrid } from '@/components/ShopGrid'
import { BalanceDisplay } from '@/components/BalanceDisplay'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

type ShopPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ShopPageProps) {
  const { locale } = await params
  const titles = {
    en: 'Shop - PL Bank',
    vi: 'Cửa hàng - PL BANK',
  }
  const descriptions = {
    en: 'Purchase items from the shop',
    vi: 'Mua các vật phẩm từ cửa hàng',
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/${locale}/auth/signin`)
  }

  const labels = {
    en: {
      balance: 'Your Balance',
      available: 'Available Items',
    },
    vi: {
      balance: 'Số dư của bạn',
      available: 'Vật phẩm có sẵn',
    },
  }

  const currentLabels = labels[locale as keyof typeof labels] || labels.en

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                  {locale === 'vi' ? 'Cửa hàng' : 'Shop'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <nav className="flex flex-wrap gap-2">
                <Link href={`/${locale}/dashboard`}>
                  <Button variant="ghost" className="text-slate-700 dark:text-slate-300 text-sm sm:text-base hover:bg-slate-200 dark:hover:bg-slate-800">
                    {locale === 'vi' ? 'Tổng quan' : 'Dashboard'}
                  </Button>
                </Link>
                <Link href={`/${locale}/transfer`}>
                  <Button variant="ghost" className="text-slate-700 dark:text-slate-300 text-sm sm:text-base hover:bg-slate-200 dark:hover:bg-slate-800">
                    {locale === 'vi' ? 'Chuyển khoản' : 'Transfer'}
                  </Button>
                </Link>
                <Link href={`/${locale}/leaderboard`}>
                  <Button variant="ghost" className="text-slate-700 dark:text-slate-300 text-sm sm:text-base hover:bg-slate-200 dark:hover:bg-slate-800">
                    {locale === 'vi' ? 'Xếp hạng' : 'Leaderboard'}
                  </Button>
                </Link>
              </nav>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          {/* Current Balance */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{currentLabels.balance}</h2>
            <BalanceDisplay locale={locale} />
          </div>

          {/* Shop Grid */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{currentLabels.available}</h2>
            <ShopGrid locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}
