import { NextRequest, NextResponse } from 'next/server'
import { getUserIdOrThrow } from '@/lib/auth-utils'
import { getUserBalance } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdOrThrow()
    const balance = await getUserBalance(userId)

    return NextResponse.json(balance)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    
    if (message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
