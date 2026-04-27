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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Balance Card - Main Focus */}
      <Card className="md:col-span-2 p-8 bg-gradient-to-br from-slate-800 to-slate-950 border-slate-700/50 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10">
          <p className="text-slate-400 font-medium mb-1">{labels.total}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-white tracking-tighter">
              {total.toLocaleString()}
            </h3>
            <span className="text-emerald-500 font-bold">PLD</span>
          </div>
        </div>
      </Card>

      {/* Sub-balances */}
      <div className="grid grid-cols-2 md:col-span-2 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">{labels.cash}</p>
          <p className="text-xl font-bold text-slate-200">{cash.toLocaleString()} <span className="text-xs font-normal text-slate-500">PLD</span></p>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-colors">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">{labels.bank}</p>
          <p className="text-xl font-bold text-slate-200">{bank.toLocaleString()} <span className="text-xs font-normal text-slate-500">PLD</span></p>
        </div>
      </div>
    </div>
  )
}
