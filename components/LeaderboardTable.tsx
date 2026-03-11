'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react'

export function LeaderboardTable() {
  const { users, loading, error, currentPage, setCurrentPage, refetch } =
    useLeaderboard(50)

  if (error) {
    return (
      <Card className="p-6 bg-red-500/10 border-red-500/50">
        <p className="text-red-400">Error loading leaderboard: {error}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  User ID
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                  Cash
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                  Bank
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="animate-pulse text-slate-400">
                      Loading leaderboard...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="text-slate-400">No users found</div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.user_id}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-semibold">
                      <div className="flex items-center gap-2">
                        {user.rank <= 3 && (
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        )}
                        #{user.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      <div className="flex items-center gap-3">
                        {user.avatar && (
                          <img
                            src={`https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar}.png`}
                            alt={user.username}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-green-400 font-semibold">
                      {user.cash.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-blue-400 font-semibold">
                      {user.bank.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-purple-400 font-semibold">
                      {user.total.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-white text-sm">
          Page {currentPage}
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={users.length < 50 || loading}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
