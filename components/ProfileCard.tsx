'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export function ProfileCard() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 bg-slate-700 rounded-full" />
          <div className="h-4 w-48 bg-slate-700 rounded" />
        </div>
      </Card>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-white">
              {session.user.name}
            </h2>
            <p className="text-sm text-slate-400">{session.user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          className="text-red-400 border-red-400 hover:bg-red-400/10"
        >
          Sign Out
        </Button>
      </div>
    </Card>
  )
}
