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
