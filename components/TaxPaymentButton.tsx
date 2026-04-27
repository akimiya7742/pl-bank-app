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
import { DollarSign } from 'lucide-react'

const TAX_AMOUNT = 1_000_000
const TAX_ACCOUNT_ID = '938064739584602133'

export function TaxPaymentButton({ locale }: { locale: string }) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { cash } = useBalanceStore()

  const handlePayTax = async () => {
    if (!session?.user?.id || cash < TAX_AMOUNT) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: TAX_ACCOUNT_ID,
          amount: TAX_AMOUNT,
          reason: locale === 'vi' ? 'Đóng thuế' : 'Tax Payment',
        }),
      })

      if (response.ok) {
        setShowConfirm(false)
        // Refresh balance
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
      <Button
        onClick={() => setShowConfirm(true)}
        disabled={!canPayTax || isLoading}
        className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2"
      >
        <DollarSign className="w-4 h-4" />
        {locale === 'vi' ? 'Đóng thuế' : 'Pay Tax'}
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {locale === 'vi' ? 'Xác nhận đóng thuế' : 'Confirm Tax Payment'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locale === 'vi'
                ? `Bạn sắp chuyển 1.000.000 PLD đến tài khoản thuế chính thức. Hành động này không thể hoàn tác.`
                : `You are about to transfer 1,000,000 PLD to the official tax account. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {locale === 'vi' ? 'Hủy' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePayTax}
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isLoading
                ? (locale === 'vi' ? 'Đang xử lý...' : 'Processing...')
                : (locale === 'vi' ? 'Xác nhận' : 'Confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
