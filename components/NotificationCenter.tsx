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
          success: <CheckCircle className="w-5 h-5 text-green-400" />,
          error: <AlertCircle className="w-5 h-5 text-red-400" />,
          info: <Info className="w-5 h-5 text-blue-400" />,
          warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
        }

        const bgColors = {
          success: 'bg-green-500/10 border-green-500/30',
          error: 'bg-red-500/10 border-red-500/30',
          info: 'bg-blue-500/10 border-blue-500/30',
          warning: 'bg-yellow-500/10 border-yellow-500/30',
        }

        const textColors = {
          success: 'text-green-400',
          error: 'text-red-400',
          info: 'text-blue-400',
          warning: 'text-yellow-400',
        }

        return (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            icon={icons[notification.type]}
            bgColor={bgColors[notification.type]}
            textColor={textColors[notification.type]}
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
}

function NotificationItem({
  notification,
  onClose,
  icon,
  bgColor,
  textColor,
}: NotificationItemProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <Card className={`p-4 border ${bgColor}`}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${textColor}`}>{notification.title}</h3>
          <p className="text-sm text-slate-300 mt-1">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}
