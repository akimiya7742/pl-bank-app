// components/TaxPaymentButton.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useBalanceStore } from '@/lib/store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DollarSign, Loader2 } from 'lucide-react'

const TAX_AMOUNT = 1_000_000
const TAX_ACCOUNT_ID = '938064739584602133'

export function TaxPaymentButton({ locale }: { locale: string }) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { cash } = useBalanceStore()

  const handlePayTax = async () => {
    if (!session?.user?.id || cash < TAX_AMOUNT) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: TAX_ACCOUNT_ID,
          amount: TAX_AMOUNT,
          reason: locale === 'vi' ? 'Đóng thuế hệ thống' : 'System Tax Payment',
        }),
      })

      if (response.ok) {
        setShowConfirm(false)
        window.location.reload()
      }
    } catch (error) {
      console.error('Tax payment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canPayTax = cash >= TAX_AMOUNT

  return (
    <>
      {/* Nút đóng thuế được thiết kế lại dạng Tile để khớp với Bento Grid */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={!canPayTax || isLoading}
        className={`group flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left
          ${canPayTax 
            ? 'border-slate-800 bg-slate-900/50 hover:border-yellow-500/50 hover:bg-yellow-500/5 cursor-pointer' 
            : 'border-slate-800/50 bg-slate-900/20 opacity-50 cursor-not-allowed'}
        `}
      >
        <div className={`mb-3 p-2 w-fit rounded-lg bg-slate-800 transition-transform ${canPayTax && 'group-hover:scale-110 group-hover:bg-yellow-500/20'}`}>
          <DollarSign className={`w-5 h-5 ${canPayTax ? 'text-yellow-500' : 'text-slate-500'}`} />
        </div>
        <span className="text-sm font-medium text-slate-200">
          {locale === 'vi' ? 'Đóng thuế' : 'Pay Tax'}
        </span>
        {!canPayTax && (
          <span className="text-[10px] text-red-400 mt-1 uppercase font-bold tracking-tighter">
            {locale === 'vi' ? 'Không đủ PLD' : 'Inadequate PLD'}
          </span>
        )}
      </button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-white">
              {locale === 'vi' ? 'Xác nhận giao dịch' : 'Confirm Transaction'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {locale === 'vi'
                ? `Bạn đang thực hiện đóng thuế định kỳ với số tiền 1.000.000 PLD. Thao tác này sẽ trừ trực tiếp vào cash.`
                : `You are about to pay 1,000,000 PLD in taxes. This will be deducted directly from your cash.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white">
              {locale === 'vi' ? 'Hủy bỏ' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePayTax}
              disabled={isLoading}
              className="rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {locale === 'vi' ? 'Đang xử lý...' : 'Processing...'}
                </div>
              ) : (
                locale === 'vi' ? 'Xác nhận đóng' : 'Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
