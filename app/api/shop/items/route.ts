import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getShopItems } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)

    const items = await getShopItems(limit, page)

    return NextResponse.json({
      success: true,
      data: items,
    })
  } catch (error) {
    console.error('Failed to fetch shop items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shop items' },
      { status: 500 }
    )
  }
}
