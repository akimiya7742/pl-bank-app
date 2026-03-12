'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useNotificationStore, useTransactionStore } from '@/lib/store'
import { useMembers } from '@/hooks/useMembers'
import { useBalance } from '@/hooks/useBalance'
import { useSession } from 'next-auth/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

const transferSchema = z.object({
  toUserId: z.string().min(1, 'Please select a recipient'),
  amount: z.number().positive('Amount must be positive'),
  reason: z.string().optional(),
})

type TransferFormData = z.infer<typeof transferSchema>

export function TransferForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()
  const { members, loading: membersLoading } = useMembers()
  const { refetch: refetchBalance } = useBalance()
  const { addNotification } = useNotificationStore()
  const { addTransaction } = useTransactionStore()

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
  const selectedMember = members.find((m) => m.id === selectedUserId)

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members
    return members.filter(
      (m) =>
        m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.includes(searchQuery)
    )
  }, [members, searchQuery])

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
      const recipient = members.find((m) => m.id === data.toUserId)

      addNotification(
        'success',
        'Transfer Successful',
        `Transferred ${data.amount} to ${recipient?.displayName}`
      )

      // Log transaction to history
      if (session?.user?.id && recipient) {
        addTransaction({
          senderId: session.user.id,
          senderUsername: session.user.name || 'Unknown',
          recipientId: data.toUserId,
          recipientUsername: recipient.displayName,
          amount: data.amount,
          reason: data.reason,
          status: 'success',
        })
      }

      // Refetch balance
      await refetchBalance()

      // Reset form
      reset()
      setSearchQuery('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      addNotification('error', 'Transfer Failed', message)

      // Log failed transaction
      if (session?.user?.id) {
        const recipient = members.find((m) => m.id === data.toUserId)
        addTransaction({
          senderId: session.user.id,
          senderUsername: session.user.name || 'Unknown',
          recipientId: data.toUserId,
          recipientUsername: recipient?.displayName || 'Unknown',
          amount: data.amount,
          reason: data.reason,
          status: 'failed',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipient Selection with Search */}
        <div className="space-y-2">
          <label className="text-white font-semibold">Recipient</label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <Select value={selectedUserId} onValueChange={(value) => setValue('toUserId', value)}>
            <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {membersLoading && filteredMembers.length === 0 ? (
                <div className="p-4 text-center text-slate-400">Loading members...</div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-4 text-center text-slate-400">No members found</div>
              ) : (
                filteredMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      {member.avatar && (
                        <img
                          src={member.avatar}
                          alt={member.displayName}
                          className="w-5 h-5 rounded-full"
                        />
                      )}
                      <span>{member.displayName}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.toUserId && (
            <p className="text-red-400 text-sm">{errors.toUserId.message}</p>
          )}
        </div>

        {/* Selected Member Preview */}
        {selectedMember && (
          <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg flex items-center gap-4">
            {selectedMember.avatar && (
              <img
                src={selectedMember.avatar}
                alt={selectedMember.displayName}
                className="w-12 h-12 rounded-full ring-2 ring-blue-500"
              />
            )}
            <div className="flex-1">
              <p className="text-slate-300 text-sm">Transferring to</p>
              <p className="text-white font-semibold text-lg">{selectedMember.displayName}</p>
            </div>
          </div>
        )}

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
