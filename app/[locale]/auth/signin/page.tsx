'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import {
  ShieldCheck,
  Cpu,
  LockKeyhole,
  CreditCard,
  Gamepad2
} from 'lucide-react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn('discord', { redirectTo: '/dashboard' })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 font-sans selection:bg-emerald-500/30 flex overflow-hidden">

      {/* Left Column: Branding & Features (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800/50">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[100px]" />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
            <CreditCard className="text-white w-7 h-7" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            PL BANK
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-6xl font-extrabold leading-tight text-white">
            Banking for <br />
            <span className="text-emerald-500">Cyber Citizens.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
            Advanced banking system for developers and gamers. Multi-layer security, real-time transactions.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md hover:border-emerald-500/50 transition-colors cursor-default">
              <ShieldCheck className="text-emerald-500 mb-3 w-6 h-6" />
              <h4 className="text-white font-bold">End-to-End</h4>
              <p className="text-xs text-slate-500 font-medium">Military-grade encryption</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md hover:border-teal-400/50 transition-colors cursor-default">
              <Cpu className="text-teal-400 mb-3 w-6 h-6" />
              <h4 className="text-white font-bold">Low Latency</h4>
              <p className="text-xs text-slate-500 font-medium">Ultra-fast node processing</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500 font-medium">
          © 2025 PL BANK • Next-gen Financial Solutions
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="lg:hidden absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight">Login Portal</h1>
            <p className="text-slate-400 font-medium">Authenticate your account to access Dashboard.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative group overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition duration-500"></div>

            <div className="relative z-10">
              <div className="space-y-6">
                <button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="flex items-center justify-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 w-full group/btn"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                      <span>Continue with Discord</span>
                    </div>
                  )}
                </button>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[12px] text-emerald-400/80 text-center leading-relaxed">
                    Using <b>Discord OAuth2</b> for absolute security. We never collect personal passwords.
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-800/50">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <LockKeyhole className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-300">Safe & Secure</h5>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      PL BANK complies with international regulations protecting user privacy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex justify-center lg:justify-start gap-8 px-2">
            <button className="text-xs font-bold text-slate-600 hover:text-emerald-400 transition-colors uppercase tracking-widest">Support</button>
            <button className="text-xs font-bold text-slate-600 hover:text-emerald-400 transition-colors uppercase tracking-widest">System Status</button>
          </div>
        </div>
      </div>
    </div>
  )
}
