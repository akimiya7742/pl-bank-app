'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTransactionStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react'

export function TransactionHistory() {
  const { data: session } = useSession()
  const { transactions, loadTransactions, clearTransactions } = useTransactionStore()

  useEffect(() => {
    loadTransactions()
  }, [])

  const userTransactions = transactions.filter(
    (t) => t.senderId === session?.user?.id || t.recipientId === session?.user?.id
  )

  const isOutgoing = (transaction) => transaction.senderId === session?.user?.id

  if (userTransactions.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <p className="text-slate-400 text-center">No transaction history</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        {userTransactions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearTransactions}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
        {userTransactions.map((transaction) => {
          const outgoing = isOutgoing(transaction)
          const otherUser = outgoing ? transaction.recipientUsername : transaction.senderUsername
          const icon = outgoing ? (
            <ArrowUpRight className="w-5 h-5 text-red-400" />
          ) : (
            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
          )

          return (
            <div
              key={transaction.id}
              className="p-4 hover:bg-slate-700/30 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-full bg-slate-700">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {outgoing ? 'Sent to' : 'Received from'} <span className="font-semibold">{otherUser}</span>
                  </p>
                  {transaction.reason && (
                    <p className="text-xs text-slate-400 truncate">{transaction.reason}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className={`font-semibold text-sm ${outgoing ? 'text-red-400' : 'text-emerald-400'}`}>
                  {outgoing ? '-' : '+'}{transaction.amount.toLocaleString()}
                </p>
                <p className={`text-xs ${
                  transaction.status === 'success'
                    ? 'text-emerald-500'
                    : transaction.status === 'failed'
                    ? 'text-red-500'
                    : 'text-slate-500'
                }`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
