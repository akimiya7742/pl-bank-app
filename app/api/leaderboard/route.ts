import { NextRequest, NextResponse } from 'next/server'
import { getUserIdOrThrow } from '@/lib/auth-utils'
import { getLeaderboard } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    await getUserIdOrThrow()

    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

    const leaderboard = await getLeaderboard(limit, offset)

    return NextResponse.json({
      success: true,
      data: leaderboard,
      limit,
      offset,
    })
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
