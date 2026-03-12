'use client'

import { useBalanceStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { useBalance } from '@/hooks/useBalance'

export function BalanceDisplay() {
  const { cash, bank, total, lastUpdated } = useBalanceStore()
  const { loading, error } = useBalance()

  if (error) {
    return (
      <Card className="p-6 bg-error-container/40 border border-error/40">
        <p className="text-error">Error loading balance: {error}</p>
      </Card>
    )
  }

  if (loading && total === 0) {
    return (
      <Card className="p-4 sm:p-6 bg-surface-container border border-md3-outline-variant/20">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-surface-container-high rounded-[var(--radius-small)]" />
          <div className="h-8 w-32 bg-surface-container-high rounded-[var(--radius-small)]" />
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <Card className="p-4 sm:p-6 bg-surface-container rounded-[var(--radius-large)] border border-md3-outline-variant/20" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.12)'}}>
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Cash</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {cash.toLocaleString()}
          </p>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 bg-surface-container rounded-[var(--radius-large)] border border-md3-outline-variant/20" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.12)'}}>
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-primary font-medium">Bank</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {bank.toLocaleString()}
          </p>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 bg-surface-container rounded-[var(--radius-large)] border border-md3-outline-variant/20" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.12)'}}>
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-secondary font-medium">Total</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {total.toLocaleString()}
          </p>
        </div>
      </Card>
    </div>
  )
}
