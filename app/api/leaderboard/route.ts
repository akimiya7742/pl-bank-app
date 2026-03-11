import { NextRequest, NextResponse } from 'next/server'
import { getUserIdOrThrow } from '@/lib/auth-utils'
import { getLeaderboard } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    await getUserIdOrThrow()

    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)

    const leaderboard = await getLeaderboard(limit, page)

    return NextResponse.json({
      success: true,
      data: leaderboard,
      limit,
      page,
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
