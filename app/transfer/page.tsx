import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { Button } from '@/components/ui/button'
import { TransferForm } from '@/components/TransferForm'
import { TransactionHistory } from '@/components/TransactionHistory'
import { BalanceDisplay } from '@/components/BalanceDisplay'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Transfer Money - PL Bank',
  description: 'Transfer money to other members',
}

export default async function TransferPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="text-white h-10 w-10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Transfer Money</h1>
            </div>
            <nav className="flex flex-wrap gap-2 sm:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white text-sm sm:text-base">
                  Dashboard
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" className="text-white text-sm sm:text-base">
                  Leaderboard
                </Button>
              </Link>
            </nav>
          </div>

          {/* Current Balance */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Your Balance</h2>
            <BalanceDisplay />
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Transfer Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Send Money</h2>
              <TransferForm />
            </div>

            {/* Transaction History */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Recent Transactions</h2>
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
