'use client'

import { useEffect, useState, useCallback } from 'react'
import { useBalanceStore } from '@/lib/store'

export function useBalance(pollInterval: number = 5000) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setBalance } = useBalanceStore()

  const fetchBalance = useCallback(async () => {
    try {
      const response = await fetch('/api/balance')

      if (!response.ok) {
        throw new Error('Failed to fetch balance')
      }

      const data = await response.json()
      setBalance(data.cash, data.bank)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [setBalance])

  useEffect(() => {
    fetchBalance()
    const interval = setInterval(fetchBalance, pollInterval)

    return () => clearInterval(interval)
  }, [fetchBalance, pollInterval])

  return { loading, error, refetch: fetchBalance }
}
