import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { Button } from '@/components/ui/button'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Leaderboard - PL Bank',
  description: 'View the server leaderboard',
}

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white">
                  Dashboard
                </Button>
              </Link>
              <Link href="/transfer">
                <Button variant="ghost" className="text-white">
                  Transfer
                </Button>
              </Link>
            </nav>
          </div>

          {/* Leaderboard Table */}
          <LeaderboardTable />
        </div>
      </div>
    </div>
  )
}
