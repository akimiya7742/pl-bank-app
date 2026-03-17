'use client'

import { useEffect, useState } from 'react'
import { ShopItemCard } from './ShopItemCard'
import { Card } from '@/components/ui/card'

interface ShopItem {
  id: number
  name: string
  price: number
  description: string
}

export function ShopGrid() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/shop/items?limit=100&page=1')
        
        if (!response.ok) {
          throw new Error('Failed to fetch shop items')
        }

        const data = await response.json()
        setItems(data.data || [])
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (error) {
    return (
      <Card className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 bg-slate-100 dark:bg-slate-800 text-center">
        <p className="text-slate-600 dark:text-slate-400">No items available in the shop</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ShopItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
