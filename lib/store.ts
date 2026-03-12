import { create } from 'zustand'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: number
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (
    type: Notification['type'],
    title: string,
    message: string
  ) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (type, title, message) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          type,
          title,
          message,
          timestamp: Date.now(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () =>
    set({
      notifications: [],
    }),
}))

interface BalanceStore {
  cash: number
  bank: number
  total: number
  lastUpdated: number
  setBalance: (cash: number, bank: number) => void
}

export const useBalanceStore = create<BalanceStore>((set) => ({
  cash: 0,
  bank: 0,
  total: 0,
  lastUpdated: 0,
  setBalance: (cash, bank) =>
    set({
      cash,
      bank,
      total: cash + bank,
      lastUpdated: Date.now(),
    }),
}))

export interface Transaction {
  id: string
  senderId: string
  senderUsername: string
  recipientId: string
  recipientUsername: string
  amount: number
  reason?: string
  timestamp: number
  status: 'success' | 'failed' | 'pending'
}

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void
  loadTransactions: () => void
  clearTransactions: () => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      const updated = [newTransaction, ...state.transactions].slice(0, 50) // Keep last 50 transactions
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('pl_bank_transactions', JSON.stringify(updated))
      }
      return { transactions: updated }
    }),
  loadTransactions: () =>
    set(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('pl_bank_transactions')
        if (stored) {
          try {
            return { transactions: JSON.parse(stored) }
          } catch (e) {
            console.error('Failed to parse transactions from localStorage:', e)
          }
        }
      }
      return {}
    }),
  clearTransactions: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pl_bank_transactions')
    }
    set({ transactions: [] })
  },
}))
