import { NextRequest, NextResponse } from 'next/server'
import { getUserIdOrThrow } from '@/lib/auth-utils'
import { transferMoney } from '@/lib/api'

interface TransferRequest {
  toUserId: string
  amount: number
  reason?: string
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdOrThrow()
    const body = (await request.json()) as TransferRequest

    // Validate input
    if (!body.toUserId || typeof body.toUserId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid toUserId' },
        { status: 400 }
      )
    }

    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    if (userId === body.toUserId) {
      return NextResponse.json(
        { error: 'Cannot transfer to yourself' },
        { status: 400 }
      )
    }

    // Perform transfer
    const result = await transferMoney(
      userId,
      body.toUserId,
      body.amount,
      body.reason
    )

    return NextResponse.json({
      success: true,
      message: `Transferred ${body.amount} to user ${body.toUserId}`,
      data: result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    if (message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: message },
        { status: 401 }
      )
    }

    if (message.includes('Insufficient balance')) {
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
