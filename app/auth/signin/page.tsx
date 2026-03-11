'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn('discord', { redirectTo: '/dashboard' })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">PL Bank</h1>
          <p className="text-slate-400">Secure Financial Management</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.444 15.356h-.976v-2.696c0-.656-.264-1.164-.915-1.164-.5 0-.895.336-.1042 1.009v2.851h-.976v-5.368h.976v.461h.014c.145-.218.537-.461 1.107-.461 1.18 0 2.076.772 2.076 2.428v2.94zM9.153 9.5c-.305 0-.552.246-.552.552 0 .305.246.552.552.552.305 0 .552-.246.552-.552 0-.305-.246-.552-.552-.552zm.487 5.856H8.666v-5.368h.974v5.368zM13.116 9.067c-1.527 0-2.766.785-2.766 1.756 0 .97 1.24 1.757 2.766 1.757s2.766-.787 2.766-1.757c-.001-.971-1.24-1.756-2.766-1.756zm0 2.793c-.83 0-1.509-.327-1.509-.73 0-.404.68-.73 1.509-.73s1.509.326 1.509.73c0 .403-.68.73-1.509.73zm5.846-2.793c-1.527 0-2.766.785-2.766 1.756 0 .97 1.24 1.757 2.766 1.757s2.766-.787 2.766-1.757c0-.971-1.24-1.756-2.766-1.756zm0 2.793c-.83 0-1.509-.327-1.509-.73 0-.404.68-.73 1.509-.73s1.509.326 1.509.73c0 .403-.68.73-1.509.73zM8.291 2C3.741 2 0 5.741 0 10.291v7.418C0 22.259 3.741 26 8.291 26h7.418C20.259 26 24 22.259 24 17.709v-7.418C24 5.741 20.259 2 15.709 2H8.291z" />
            </svg>
            {isLoading ? 'Signing in...' : 'Sign in with Discord'}
          </Button>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </Card>
    </div>
  )
}
