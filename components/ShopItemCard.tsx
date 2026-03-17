'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNotificationStore, useTransactionStore } from '@/lib/store'
import { useSession } from 'next-auth/react'
import { ShoppingCart } from 'lucide-react'

interface ShopItemProps {
  item: {
    id: number
    name: string
    price: number
    description: string
  }
}

export function ShopItemCard({ item }: ShopItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification } = useNotificationStore()
  const { addTransaction } = useTransactionStore()
  const { data: session } = useSession()

  const handlePurchase = async () => {
    if (!session?.user?.id) {
      addNotification('error', 'Not Authenticated', 'Please sign in first')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, quantity: 1 }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Purchase failed')
      }

      const result = await response.json()

      addNotification('success', 'Purchase Successful', `Bought ${item.name} for ${item.price} cash`)

      // Log transaction
      addTransaction({
        type: 'purchase',
        senderId: session.user.id,
        senderUsername: session.user.name || 'Unknown',
        itemName: item.name,
        itemId: item.id,
        amount: item.price,
        status: 'success',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      addNotification('error', 'Purchase Failed', message)

      // Log failed transaction
      if (session?.user?.id) {
        addTransaction({
          type: 'purchase',
          senderId: session.user.id,
          senderUsername: session.user.name || 'Unknown',
          itemName: item.name,
          itemId: item.id,
          amount: item.price,
          status: 'failed',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-4 bg-white dark:bg-slate-800 hover:shadow-lg dark:hover:shadow-lg/20 transition-shadow border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {item.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {item.price}
          </div>
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isLoading ? 'Buying...' : 'Buy'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
