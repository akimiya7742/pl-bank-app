'use client'

import { useEffect, useState, useCallback } from 'react'

export interface LeaderboardUser {
  user_id: string
  cash: number
  bank: number
  total: number
  rank: number
}

export function useLeaderboard(limit: number = 50, offset: number = 0) {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentOffset, setCurrentOffset] = useState(offset)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/leaderboard?limit=${limit}&offset=${currentOffset}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }

      const data = await response.json()
      setUsers(data.data)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [limit, currentOffset])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return {
    users,
    loading,
    error,
    currentOffset,
    setCurrentOffset,
    refetch: fetchLeaderboard,
  }
}
