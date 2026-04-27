'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

// components/ProfileCard.tsx
export function ProfileCard() {
  const { data: session } = useSession()
  if (!session?.user) return null

  return (
    <Card className="relative overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur-xl p-6">
      <div className="absolute top-0 right-0 p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          className="text-slate-500 hover:text-red-400 hover:bg-red-400/10"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative p-1 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500">
          <div className="bg-slate-950 rounded-full p-1">
            <Image
              src={session.user.image || '/default-avatar.png'}
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full border-2 border-slate-900"
            />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">{session.user.name}</h2>
          <p className="text-xs font-mono text-slate-500 tracking-wider uppercase">Verified Member</p>
          <p className="text-sm text-slate-400">{session.user.email}</p>
        </div>
      </div>
    </Card>
  )
}
