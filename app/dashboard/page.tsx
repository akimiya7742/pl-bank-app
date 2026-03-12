import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { ProfileCard } from '@/components/ProfileCard'
import { BalanceDisplay } from '@/components/BalanceDisplay'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRightLeft, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Dashboard - PL Bank',
  description: 'View your balance and manage your account',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">PL Bank</h1>
            <nav className="flex flex-wrap gap-2 sm:gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-foreground text-sm sm:text-base hover:bg-surface-container-high">
                  Dashboard
                </Button>
              </Link>
              <Link href="/transfer">
                <Button variant="ghost" className="text-foreground text-sm sm:text-base hover:bg-surface-container-high">
                  Transfer
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" className="text-foreground text-sm sm:text-base hover:bg-surface-container-high">
                  Leaderboard
                </Button>
              </Link>
            </nav>
          </div>

          {/* Profile */}
          <ProfileCard />

          {/* Balance Cards */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Balance</h2>
            <BalanceDisplay />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/transfer" className="block">
                <Button className="w-full h-24 bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col gap-2">
                  <ArrowRightLeft className="w-6 h-6" />
                  <span>Transfer Money</span>
                </Button>
              </Link>
              <Link href="/leaderboard" className="block">
                <Button className="w-full h-24 bg-purple-600 hover:bg-purple-700 text-white flex flex-col gap-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>View Leaderboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
