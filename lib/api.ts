/**
 * UnbelievaBoat API Utility Functions
 * All server-side only - never expose tokens to client
 */

const UNBELIEVABOAT_API_BASE = 'https://unbelievaboat.com/api/v1'
const TOKEN = process.env.UNBELIEVABOAT_TOKEN || ''
const GUILD_ID = process.env.DISCORD_GUILD_ID || ''

export interface UserBalance {
  cash: number
  bank: number
}

export interface LeaderboardUser {
  user_id: string
  username: string
  avatar: string | null
  cash: number
  bank: number
  total: number
  rank: number
}

export interface DiscordMember {
  user: {
    id: string
    username: string
    avatar: string | null
  }
  nick: string | null
}

async function makeUnbelievaBoatRequest(
  endpoint: string,
  method: string = 'GET',
  body?: unknown
) {
  const url = `${UNBELIEVABOAT_API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': TOKEN,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`UnbelievaBoat API error: ${response.statusText}`)
  }

  return response.json()
}

export async function getUserBalance(userId: string): Promise<UserBalance> {
  const data = await makeUnbelievaBoatRequest(
    `/guilds/${GUILD_ID}/users/${userId}`
  )
  return {
    cash: data.cash || 0,
    bank: data.bank || 0,
  }
}

export async function transferMoney(
  fromUserId: string,
  toUserId: string,
  amount: number,
  reason?: string
) {
  // Validate amount
  if (amount <= 0) {
    throw new Error('Amount must be positive')
  }

  // Check sender's balance
  const senderBalance = await getUserBalance(fromUserId)
  const totalBalance = senderBalance.cash + senderBalance.bank

  if (totalBalance < amount) {
    throw new Error('Insufficient balance')
  }

  // Deduct from sender (use negative amount)
  await makeUnbelievaBoatRequest(
    `/guilds/${GUILD_ID}/users/${fromUserId}`,
    'PATCH',
    {
      cash: -amount,
      reason: `Transfer to ${toUserId}: ${reason || ''}`,
    }
  )

  // Add to recipient
  const response = await makeUnbelievaBoatRequest(
    `/guilds/${GUILD_ID}/users/${toUserId}`,
    'PATCH',
    {
      cash: amount,
      reason: `Received from ${fromUserId}: ${reason || ''}`,
    }
  )

  return response
}

export async function getLeaderboard(
  limit: number = 50,
  page: number = 1
): Promise<LeaderboardUser[]> {
  const data = await makeUnbelievaBoatRequest(
    `/guilds/${GUILD_ID}/users?sort=total&limit=${limit}&page=${page}`
  )

  // Fetch Discord user details sequentially with delay to avoid rate limiting
  const leaderboardUsers: LeaderboardUser[] = []
  const users = data.users || []

  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    const discordUser = await getDiscordUser(user.user_id)
    
    leaderboardUsers.push({
      user_id: user.user_id,
      username: discordUser.username,
      avatar: discordUser.avatar,
      cash: user.cash || 0,
      bank: user.bank || 0,
      total: (user.cash || 0) + (user.bank || 0),
      rank: (page - 1) * limit + i + 1,
    })

    // Add delay between requests to avoid rate limiting (50ms between each user)
    if (i < users.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  return leaderboardUsers
}

export async function getDiscordMembers(guildId: string): Promise<DiscordMember[]> {
  const botToken = process.env.DISCORD_BOT_TOKEN || ''
  
  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`,
    {
      headers: {
        'Authorization': `Bot ${botToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Discord API error: ${response.statusText}`)
  }

  return response.json()
}

export async function getDiscordUser(userId: string): Promise<{
  id: string
  username: string
  avatar: string | null
}> {
  const botToken = process.env.DISCORD_BOT_TOKEN || ''
  
  const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
    headers: {
      'Authorization': `Bot ${botToken}`,
    },
  })

  if (!response.ok) {
    // Return a fallback if user not found
    return {
      id: userId,
      username: `User ${userId}`,
      avatar: null,
    }
  }

  const user = await response.json()
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
  }
}
