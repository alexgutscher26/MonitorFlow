"use client"

import { Bell } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useState } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="max-h-96 overflow-y-auto p-4">
          {notifications.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">
              No notifications
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${
                    notification.read ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <p className="text-sm text-zinc-500">
                    {notification.message}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
