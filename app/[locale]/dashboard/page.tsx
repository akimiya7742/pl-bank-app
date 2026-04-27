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

// dashboard/page.tsx
export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getServerSession(authOptions)
  const { locale } = await params

  if (!session) redirect(`/${locale}/auth/signin`)

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-emerald-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              PL Bank <span className="text-emerald-500 text-sm font-mono ml-2 border border-emerald-500/30 px-2 py-0.5 rounded">v2.0</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/40 p-1.5 rounded-2xl backdrop-blur-md border border-slate-700/50">
            <nav className="hidden sm:flex gap-1">
              {['dashboard', 'transfer', 'leaderboard'].map((item) => (
                <Link key={item} href={`/${locale}/${item}`}>
                  <Button variant="ghost" className="hover:bg-slate-700/50 rounded-xl transition-all">
                    {locale === 'vi' ? (item === 'dashboard' ? 'Tổng quan' : item === 'transfer' ? 'Chuyển khoản' : 'Xếp hạng') : item}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="w-[1px] h-6 bg-slate-700 mx-1 hidden sm:block" />
            <LanguageSwitcher locale={locale} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <BalanceDisplay locale={locale} />

            {/* Quick Actions - Re-styled as elegant tiles */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <QuickActionLink
                href={`/${locale}/transfer`}
                icon={<ArrowRightLeft className="w-5 h-5" />}
                label={locale === 'vi' ? 'Chuyển khoản' : 'Transfer'}
                color="emerald"
              />
              <QuickActionLink
                href={`/${locale}/leaderboard`}
                icon={<TrendingUp className="w-5 h-5" />}
                label={locale === 'vi' ? 'Bảng xếp hạng' : 'Leaderboard'}
                color="blue"
              />
              <TaxPaymentButton locale={locale} />
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <ProfileCard />
            {/* Thêm một card 'Recent Activity' hoặc 'Market Info' ở đây để giao diện balance hơn */}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActionLink({ href, icon, label, color }: { href: string, icon: any, label: string, color: string }) {
  const colors: any = {
    emerald: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
    blue: "hover:border-blue-500/50 hover:bg-blue-500/5"
  }
  return (
    <Link href={href} className={`group p-4 rounded-2xl border border-slate-800 bg-slate-900/50 transition-all duration-300 ${colors[color]}`}>
      <div className={`mb-3 p-2 w-fit rounded-lg bg-slate-800 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}