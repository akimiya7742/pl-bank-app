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
  toUserId: z.string().min(1, 'Chọn người nhận'),
  amount: z.number().positive('Số tiền > 0'),
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
    defaultValues: { toUserId: '', amount: 0, reason: '' },
  })

  const selectedUserId = watch('toUserId')
  const selectedMember = members.find((m) => m.id === selectedUserId)

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members
    return members.filter((m) =>
        m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.includes(searchQuery)
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
  
      if (!response.ok) throw new Error('Transaction failed')
  
      // 1. Thông báo cho User
      addNotification('success', 'Thành công', `Đã chuyển ${data.amount} cho ${selectedMember?.displayName}`)
  
      // 2. Push vào lịch sử (Local Store)
      addTransaction({
        type: 'transfer',
        senderId: session?.user?.id || 'unknown',
        senderUsername: session?.user?.name || 'Tôi',
        recipientId: data.toUserId,
        recipientUsername: selectedMember?.displayName || 'Người nhận',
        amount: data.amount,
        reason: data.reason || 'Chuyển tiền',
        status: 'success'
      })
  
      // 3. Cập nhật lại số dư trên Header/UI
      await refetchBalance()
      reset()
    } catch (error) {
      addNotification('error', 'Lỗi', 'Giao dịch không thành công')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-xl border-none shadow-none bg-[#231F20] text-[#E6E1E5] rounded-[40px] p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Header: Icon + Title */}
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-[#D0BCFF] rounded-2xl text-[#381E72]">
            <Send className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-normal">Chuyển tiền</h2>
        </div>

        {/* Section: Người nhận */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#938F99] text-[11px] font-bold uppercase tracking-widest">
            <User className="w-3.5 h-3.5" />
            NGƯỜI NHẬN
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#938F99]" />
              <input
                type="text"
                placeholder="yuna"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#36343B] border-none rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-[#D0BCFF] outline-none placeholder-[#938F99]"
              />
            </div>

            <Select value={selectedUserId} onValueChange={(value) => setValue('toUserId', value)}>
              <SelectTrigger className="w-fit min-w-[140px] h-[48px] bg-transparent border-none text-[#E6E1E5] hover:bg-[#36343B] rounded-xl transition-colors">
                <SelectValue placeholder="Chọn thành viên" />
              </SelectTrigger>
              <SelectContent className="bg-[#36343B] border-[#49454F] text-[#E6E1E5]">
                {filteredMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.displayName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Member Preview Box */}
        {selectedMember && (
          <div className="p-5 bg-[#36343B]/50 border border-[#49454F] rounded-[28px] flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative">
              <img
                src={`https://cdn.discordapp.com/avatars/${selectedMember.id}/${selectedMember.avatar}.png`}
                alt=""
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#D0BCFF] p-1 rounded-full border-2 border-[#231F20]">
                 <User className="w-2.5 h-2.5 text-[#381E72] fill-current" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[#D0BCFF] text-[10px] font-medium leading-none">Đang chuyển đến</p>
              <p className="text-lg font-bold text-white tracking-tight">{selectedMember.displayName}</p>
              <p className="text-[#938F99] text-[9px] font-mono leading-none uppercase">ID: {selectedMember.id}</p>
            </div>
          </div>
        )}

        {/* Inputs: Số tiền & Lời nhắn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#938F99] text-[11px] font-bold uppercase tracking-widest">
              <Banknote className="w-3.5 h-3.5" />
              SỐ TIỀN
            </div>
            <Input
              type="number"
              placeholder="0"
              className="h-[52px] bg-[#36343B]/30 border-none rounded-2xl text-white focus:ring-1 focus:ring-[#D0BCFF]"
              {...register('amount', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#938F99] text-[11px] font-bold uppercase tracking-widest">
              <MessageSquare className="w-3.5 h-3.5" />
              LỜI NHẮN
            </div>
            <Input
              type="text"
              placeholder="Ghi chú giao dịch..."
              className="h-[52px] bg-[#36343B]/30 border-none rounded-2xl text-white focus:ring-1 focus:ring-[#D0BCFF]"
              {...register('reason')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-[56px] bg-[#D0BCFF] hover:bg-[#EADDFF] text-[#381E72] rounded-[18px] text-base font-bold transition-all active:scale-[0.97] mt-2"
        >
          {isLoading ? 'Đang xử lý...' : 'Xác nhận giao dịch'}
        </Button>
      </form>
    </Card>
  )
}
