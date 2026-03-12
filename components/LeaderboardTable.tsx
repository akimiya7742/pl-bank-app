'use client'

import { Card } from '@/components/ui/card'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { Trophy, Loader } from 'lucide-react'
import { useEffect, useRef, useCallback } from 'react'

export function LeaderboardTable() {
  const { users, loading, error, hasMore, loadMore } = useLeaderboard(50)
  const observerTarget = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading, loadMore])

  if (error) {
    return (
      <Card className="p-6 bg-red-500/10 border-red-500/50">
        <p className="text-red-400">Error loading leaderboard: {error}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <Card className="overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-900/95 z-10">
              <tr className="border-b border-slate-700">
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-300">
                  Rank
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-300">
                  User
                </th>
                <th className="px-2 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-slate-300">
                  Cash
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-right text-sm font-semibold text-slate-300">
                  Bank
                </th>
                <th className="px-2 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-slate-300">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="text-slate-400">No users found</div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={`${user.user_id}-${user.rank}`}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                    style={{
                      animationDelay: `${index * 30}ms`,
                    }}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        {user.rank <= 3 && (
                          <Trophy className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500 animate-pulse flex-shrink-0" />
                        )}
                        <span className="truncate">#{user.rank}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-white text-sm">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {user.avatar ? (
                          <img
                            src={`https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar}.png`}
                            alt={user.username}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-slate-700 hover:ring-slate-600 transition-all flex-shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium truncate text-xs sm:text-base">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-green-400 font-semibold text-xs sm:text-base">
                      {user.cash.toLocaleString()}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-right text-blue-400 font-semibold">
                      {user.bank.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-purple-400 font-semibold text-xs sm:text-base">
                      {user.total.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className="flex justify-center py-8">
        {loading && hasMore ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Loading more users...</span>
          </div>
        ) : hasMore ? (
          <div className="text-slate-500 text-sm">Scroll to load more...</div>
        ) : (
          <div className="text-slate-500 text-sm">No more users to load</div>
        )}
      </div>
    </div>
  )
}
