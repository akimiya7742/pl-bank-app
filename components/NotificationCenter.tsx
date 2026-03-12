'use client'

import { useEffect } from 'react'
import { useNotificationStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export function NotificationCenter() {
  const { notifications, removeNotification } = useNotificationStore()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
          error: <AlertCircle className="w-5 h-5 text-red-400" />,
          info: <Info className="w-5 h-5 text-cyan-400" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
        }

        const bgColors = {
          success: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/50',
          error: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50',
          info: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50',
          warning: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50',
        }

        const textColors = {
          success: 'text-emerald-300',
          error: 'text-red-300',
          info: 'text-blue-300',
          warning: 'text-amber-300',
        }

        const iconColors = {
          success: 'text-emerald-400',
          error: 'text-red-400',
          info: 'text-cyan-400',
          warning: 'text-amber-400',
        }

        return (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            icon={icons[notification.type]}
            bgColor={bgColors[notification.type]}
            textColor={textColors[notification.type]}
            type={notification.type}
          />
        )
      })}
    </div>
  )
}

interface NotificationItemProps {
  notification: {
    id: string
    title: string
    message: string
    timestamp: number
  }
  onClose: () => void
  icon: React.ReactNode
  bgColor: string
  textColor: string
  type: 'success' | 'error' | 'info' | 'warning'
}

function NotificationItem({
  notification,
  onClose,
  icon,
  bgColor,
  textColor,
  type,
}: NotificationItemProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <Card className={`p-4 border backdrop-blur-sm ${bgColor} hover:border-opacity-100 transition-all duration-300 animate-in slide-in-from-right-4 fade-in`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm ${textColor}`}>{notification.title}</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}
