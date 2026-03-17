import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { Button } from '@/components/ui/button'
import { ShopGrid } from '@/components/ShopGrid'
import { BalanceDisplay } from '@/components/BalanceDisplay'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

export default async function ShopPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Shop</h1>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 sm:gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-700 dark:text-slate-300 text-sm sm:text-base hover:bg-slate-200 dark:hover:bg-slate-800">
                  Dashboard
                </Button>
              </Link>
              <Link href="/transfer">
                <Button variant="ghost" className="text-slate-700 dark:text-slate-300 text-sm sm:text-base hover:bg-slate-200 dark:hover:bg-slate-800">
                  Transfer
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" className="text-slate-700 dark:text-slate-300 text-sm sm:text-base hover:bg-slate-200 dark:hover:bg-slate-800">
                  Leaderboard
                </Button>
              </Link>
            </nav>
          </div>

          {/* Current Balance */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Balance</h2>
            <BalanceDisplay />
          </div>

          {/* Shop Grid */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Available Items</h2>
            <ShopGrid />
          </div>
        </div>
      </div>
    </div>
  )
}
