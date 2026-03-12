'use client'

import { useBalanceStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { useBalance } from '@/hooks/useBalance'

export function BalanceDisplay() {
  const { cash, bank, total, lastUpdated } = useBalanceStore()
  const { loading, error } = useBalance()

  if (error) {
    return (
      <Card className="p-6 bg-red-500/10 border-red-500/50">
        <p className="text-red-400">Error loading balance: {error}</p>
      </Card>
    )
  }

  if (loading && total === 0) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-slate-700 rounded" />
          <div className="h-8 w-32 bg-slate-700 rounded" />
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30">
        <div className="space-y-2">
          <p className="text-sm text-green-400">Cash</p>
          <p className="text-3xl font-bold text-white">
            {cash.toLocaleString()}
          </p>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border-emerald-500/30">
        <div className="space-y-2">
          <p className="text-sm text-emerald-400">Bank</p>
          <p className="text-3xl font-bold text-white">
            {bank.toLocaleString()}
          </p>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30">
        <div className="space-y-2">
          <p className="text-sm text-purple-400">Total</p>
          <p className="text-3xl font-bold text-white">
            {total.toLocaleString()}
          </p>
        </div>
      </Card>
    </div>
  )
}
