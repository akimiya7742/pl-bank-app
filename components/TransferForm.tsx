'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useNotificationStore } from '@/lib/store'
import { useMembers } from '@/hooks/useMembers'
import { useBalance } from '@/hooks/useBalance'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const transferSchema = z.object({
  toUserId: z.string().min(1, 'Please select a recipient'),
  amount: z.number().positive('Amount must be positive'),
  reason: z.string().optional(),
})

type TransferFormData = z.infer<typeof transferSchema>

export function TransferForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { members, loading: membersLoading } = useMembers()
  const { refetch: refetchBalance } = useBalance()
  const { addNotification } = useNotificationStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toUserId: '',
      amount: 0,
      reason: '',
    },
  })

  const selectedUserId = watch('toUserId')

  const onSubmit = async (data: TransferFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Transfer failed')
      }

      const result = await response.json()
      addNotification(
        'success',
        'Transfer Successful',
        `Transferred ${data.amount} to ${
          members.find((m) => m.id === data.toUserId)?.displayName
        }`
      )

      // Refetch balance
      await refetchBalance()

      // Reset form
      reset()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      addNotification('error', 'Transfer Failed', message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipient Selection */}
        <div className="space-y-2">
          <label className="text-white font-semibold">Recipient</label>
          <Select value={selectedUserId} onValueChange={(value) => setValue('toUserId', value)}>
            <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {membersLoading ? (
                <SelectItem value="" disabled>
                  Loading members...
                </SelectItem>
              ) : members.length === 0 ? (
                <SelectItem value="" disabled>
                  No members available
                </SelectItem>
              ) : (
                members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.displayName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.toUserId && (
            <p className="text-red-400 text-sm">{errors.toUserId.message}</p>
          )}
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-white font-semibold">Amount</label>
          <Input
            type="number"
            step="1"
            placeholder="0"
            className="bg-slate-700 border-slate-600 text-white"
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && (
            <p className="text-red-400 text-sm">{errors.amount.message}</p>
          )}
        </div>

        {/* Reason Input (Optional) */}
        <div className="space-y-2">
          <label className="text-white font-semibold">Reason (Optional)</label>
          <Input
            type="text"
            placeholder="Transfer reason"
            className="bg-slate-700 border-slate-600 text-white"
            {...register('reason')}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
        >
          {isLoading ? 'Processing...' : 'Transfer Money'}
        </Button>
      </form>
    </Card>
  )
}
