'use client'

import { useBalanceStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { useBalance } from '@/hooks/useBalance'

interface BalanceDisplayProps {
  locale?: string
  labels?: {
    cash: string
    bank: string
    total: string
  }
}

const defaultLabels = {
  en: {
    cash: 'Available Balance',
    bank: 'Wallet Balance',
    total: 'Total Balance',
  },
  vi: {
    cash: 'Số dư khả dụng',
    bank: 'Số dư ví',
    total: 'Tổng số dư',
  },
}

export function BalanceDisplay({
  locale = 'en',
  labels = defaultLabels[locale as keyof typeof defaultLabels] || defaultLabels.en,
}: BalanceDisplayProps) {
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
      <Card className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-slate-700 rounded" />
          <div className="h-8 w-32 bg-slate-700 rounded" />
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30 dark:from-green-900/30 dark:to-green-800/20">
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-green-400 dark:text-green-300">{labels.cash}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white dark:text-slate-100">
            {cash.toLocaleString()}
          </p>
          <p className="text-xs text-green-300 dark:text-green-400">PLD</p>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border-emerald-500/30 dark:from-emerald-900/30 dark:to-emerald-800/20">
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-emerald-400 dark:text-emerald-300">{labels.bank}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white dark:text-slate-100">
            {bank.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-300 dark:text-emerald-400">PLD</p>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 dark:from-purple-900/30 dark:to-purple-800/20">
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-purple-400 dark:text-purple-300">{labels.total}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white dark:text-slate-100">
            {total.toLocaleString()}
          </p>
          <p className="text-xs text-purple-300 dark:text-purple-400">PLD</p>
        </div>
      </Card>
    </div>
  )
}
