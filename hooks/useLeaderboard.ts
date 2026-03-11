'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export interface LeaderboardUser {
  user_id: string
  username: string
  avatar: string | null
  cash: number
  bank: number
  total: number
  rank: number
}

export function useLeaderboard(limit: number = 50) {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const loadingRef = useRef(false)

  const fetchLeaderboard = useCallback(async (page: number) => {
    // Prevent duplicate requests
    if (loadingRef.current || !hasMore) return

    try {
      loadingRef.current = true
      setLoading(true)
      
      const response = await fetch(
        `/api/leaderboard?limit=${limit}&page=${page}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }

      const data = await response.json()
      const newUsers = data.data || []

      // Append new users to existing ones
      setUsers(prev => [...prev, ...newUsers])

      // Check if there are more pages
      setHasMore(newUsers.length === limit)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [limit, hasMore])

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard(1)
  }, [])

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchLeaderboard(nextPage)
    }
  }, [currentPage, hasMore, fetchLeaderboard])

  return {
    users,
    loading,
    error,
    hasMore,
    currentPage,
    loadMore,
    refetch: () => {
      setUsers([])
      setCurrentPage(1)
      setHasMore(true)
      fetchLeaderboard(1)
    },
  }
}
