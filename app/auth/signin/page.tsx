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
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-hidden dark">
      
      {/* Left Column: Branding & Features (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-md3-outline-variant/20">
        {/* Background Gradients - MD3 Elevation */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[oklch(0.54_0.16_142.5)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-[oklch(0.59_0.13_40)]/10 rounded-full blur-[100px]" />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-[calc(var(--radius-large)_-_4px)] flex items-center justify-center shadow-lg" style={{boxShadow: '0 3px 12px rgba(0,0,0,0.15)'}}>
            <CreditCard className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-foreground">PL BANK</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-bold leading-tight text-foreground">
            Banking for <br />
            <span className="text-primary">Cyber Citizens.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
            Advanced banking system for developers and gamers. Multi-layer security, real-time transactions.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-5 rounded-[var(--radius-large)] bg-surface-container border border-md3-outline-variant/20 hover:border-primary/40 transition-colors cursor-default" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.12)'}}>
              <ShieldCheck className="text-primary mb-3 w-5 h-5" />
              <h4 className="text-foreground font-semibold text-sm">End-to-End</h4>
              <p className="text-xs text-muted-foreground font-medium">Military-grade encryption</p>
            </div>
            <div className="p-5 rounded-[var(--radius-large)] bg-surface-container border border-md3-outline-variant/20 hover:border-tertiary/40 transition-colors cursor-default" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.12)'}}>
              <Cpu className="text-tertiary mb-3 w-5 h-5" />
              <h4 className="text-foreground font-semibold text-sm">Low Latency</h4>
              <p className="text-xs text-muted-foreground font-medium">Ultra-fast node processing</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground font-medium">
          © 2025 PL BANK • Next-gen Financial Solutions
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="lg:hidden absolute inset-0 overflow-hidden -z-10">
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
            <p className="text-muted-foreground font-medium">Authenticate with Discord to access your account</p>
          </div>

          <div className="bg-surface-container rounded-[var(--radius-large)] p-8 relative overflow-hidden border border-md3-outline-variant/20" style={{boxShadow: '0 4px 16px rgba(0,0,0,0.12)'}}>
            
            <div className="space-y-6">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-3 rounded-[var(--radius-medium)] font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-primary hover:bg-[oklch(0.60_0.16_142.5)] text-primary-foreground w-full group/btn"
                style={{boxShadow: '0 4px 12px rgba(84,179,127,0.30)'}}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    <span>Continue with Discord</span>
                  </div>
                )}
              </button>

              <div className="p-4 rounded-[var(--radius-medium)] bg-primary-container/40 border border-primary/20">
                <p className="text-xs text-primary text-center leading-relaxed font-medium">
                  We use Discord OAuth2 for secure authentication. Your passwords are never stored.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-md3-outline-variant/20">
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-surface-container-high rounded-[var(--radius-small)]">
                    <LockKeyhole className="w-4 h-4 text-primary" />
                 </div>
                 <div className="space-y-1">
                   <h5 className="text-xs font-semibold text-foreground">Secure by Default</h5>
                   <p className="text-[11px] text-muted-foreground leading-relaxed">
                     PL BANK uses industry-standard security practices to protect your financial data.
                   </p>
                 </div>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex justify-center lg:justify-start gap-6 px-2">
            <button className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors uppercase">Support</button>
            <button className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors uppercase">Status</button>
          </div>
        </div>
      </div>
    </div>
  )
}
