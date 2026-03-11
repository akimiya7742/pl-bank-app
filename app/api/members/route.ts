import { NextRequest, NextResponse } from 'next/server'
import { getUserIdOrThrow } from '@/lib/auth-utils'
import { getDiscordMembers } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    await getUserIdOrThrow()

    const guildId = process.env.DISCORD_GUILD_ID

    if (!guildId) {
      return NextResponse.json(
        { error: 'Guild ID not configured' },
        { status: 500 }
      )
    }

    const members = await getDiscordMembers(guildId)

    // Filter out bots and format response
    const formattedMembers = members
      .filter((member: any) => !member.user.bot)
      .map((member: any) => ({
        id: member.user.id,
        username: member.user.username,
        nickname: member.nick,
        avatar: member.user.avatar,
        displayName: member.nick || member.user.username,
      }))

    return NextResponse.json({
      success: true,
      data: formattedMembers,
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
