import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function getSessionOrThrow() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized: No session found')
  }

  return session
}

export async function getUserIdOrThrow() {
  const session = await getSessionOrThrow()
  return session.user.id
}
