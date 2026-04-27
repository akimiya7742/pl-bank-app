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
import { Search, Send, Banknote, MessageSquare, User } from 'lucide-react'

const transferSchema = z.object({
  toUserId: z.string().min(1, 'Vui lòng chọn người nhận'),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
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
        throw new Error(errorData.error || 'Giao dịch thất bại')
      }

      const recipient = members.find((m) => m.id === data.toUserId)
      addNotification('success', 'Thành công', `Đã chuyển ${data.amount} đến ${recipient?.displayName}`)

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

      await refetchBalance()
      reset()
      setSearchQuery('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định'
      addNotification('error', 'Lỗi giao dịch', message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-2xl bg-[#1D1B20] text-[#E6E1E5] rounded-[32px]">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#D0BCFF] rounded-2xl text-[#381E72]">
            <Send className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-medium tracking-tight">Chuyển tiền</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Recipient Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D0BCFF] mb-1">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Người nhận</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#938F99] group-focus-within:text-[#D0BCFF] transition-colors" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#2B2930] border-none rounded-2xl pl-11 pr-4 py-4 text-sm focus:ring-2 focus:ring-[#D0BCFF] transition-all outline-none placeholder-[#938F99]"
                />
              </div>

              <Select value={selectedUserId} onValueChange={(value) => setValue('toUserId', value)}>
                <SelectTrigger className="h-[52px] bg-[#2B2930] border-none rounded-2xl focus:ring-2 focus:ring-[#D0BCFF] text-[#E6E1E5]">
                  <SelectValue placeholder="Chọn thành viên" />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-xl">
                  {filteredMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id} className="focus:bg-[#49454F] rounded-lg">
                      <div className="flex items-center gap-2">
                        {member.avatar && (
                          <img
                            src={`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png`}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span>{member.displayName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.toUserId && <p className="text-[#F2B8B5] text-xs ml-2">{errors.toUserId.message}</p>}
          </div>

          {/* Selected Member Preview - Material "Surface" style */}
          {selectedMember && (
            <div className="p-4 bg-[#49454F]/30 border border-[#49454F] rounded-[24px] flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <img
                  src={`https://cdn.discordapp.com/avatars/${selectedMember.id}/${selectedMember.avatar}.png`}
                  alt={selectedMember.displayName}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#D0BCFF] p-1 rounded-lg">
                   <User className="w-3 h-3 text-[#381E72]" />
                </div>
              </div>
              <div>
                <p className="text-[#D0BCFF] text-xs font-medium">Đang chuyển đến</p>
                <p className="text-xl font-semibold">{selectedMember.displayName}</p>
                <p className="text-[#938F99] text-xs font-mono">ID: {selectedMember.id}</p>
              </div>
            </div>
          )}

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#D0BCFF] mb-1">
                <Banknote className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Số tiền</span>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                className="h-[56px] bg-[#2B2930] border-none rounded-2xl text-lg font-semibold focus:ring-2 focus:ring-[#D0BCFF] transition-all"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-[#F2B8B5] text-xs">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#D0BCFF] mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Lời nhắn</span>
              </div>
              <Input
                type="text"
                placeholder="Ghi chú giao dịch..."
                className="h-[56px] bg-[#2B2930] border-none rounded-2xl focus:ring-2 focus:ring-[#D0BCFF] transition-all"
                {...register('reason')}
              />
            </div>
          </div>

          {/* Submit Button - Dynamic elevation & scale */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-[#D0BCFF] hover:bg-[#B69DF8] text-[#381E72] rounded-[20px] text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-purple-950/20"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-3 border-[#381E72]/30 border-t-[#381E72] rounded-full animate-spin" />
                Đang xử lý...
              </div>
            ) : (
              'Xác nhận giao dịch'
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
