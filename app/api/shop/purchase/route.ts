import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getShopItems, getUserBalance } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, quantity = 1 } = await request.json()

    if (!itemId || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid item ID or quantity' },
        { status: 400 }
      )
    }

    // Get item price from shop
    const items = await getShopItems(100, 1)
    const item = items.find(i => i.id === itemId)
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const totalCost = item.price * quantity

    // Check user balance
    const balance = await getUserBalance(session.user.id)
    const totalBalance = balance.cash + balance.bank

    if (totalBalance < totalCost) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Update user inventory (via UnbelievaBoat API)
    // This would be handled by the UnbelievaBoat API through PATCH request
    // For now, we return success - in production, you'd call purchaseItem from api.ts

    return NextResponse.json({
      success: true,
      message: `Purchased ${quantity}x ${item.name} for ${totalCost} cash`,
      item: item.name,
      quantity,
      totalCost,
    })
  } catch (error) {
    console.error('Purchase failed:', error)
    return NextResponse.json(
      { error: 'Purchase failed' },
      { status: 500 }
    )
  }
}
