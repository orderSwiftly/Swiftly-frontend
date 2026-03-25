// src/components/notification-toggle.tsx

'use client'

import { useState, useEffect } from 'react'
import { subscribeToPush, unsubscribeFromPush, isSubscribed } from '@/lib/push'
import { useUserStore } from '@/stores/userStore'

export function NotificationToggle() {
  const { user } = useUserStore()
  const [enabled, setEnabled] = useState(false)

  const userId = user?._id ?? ''
  const getToken = () => localStorage.getItem('token') ?? ''

  useEffect(() => {
    if (!userId) return
    isSubscribed(userId).then(setEnabled)
  }, [userId])

    const toggle = async () => {
        const token = getToken()
            if (!token || !userId) return

            const next = !enabled
            setEnabled(next)

        try {
            if (next) {
                await subscribeToPush(token, userId)
                console.log('[NotificationToggle] ✅ Subscribed — userId:', userId)
            } else {
                await unsubscribeFromPush(token)
                console.log('[NotificationToggle] ❌ Unsubscribed — userId:', userId)
            }
        } catch (err) {
            console.error('[NotificationToggle] 🔴 Error during toggle:', err)
            setEnabled(!next)
        }
    }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle push notifications"
      style={{ backgroundColor: enabled ? '#16a34a' : '#d1d5db' }}
      className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none"
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: enabled ? 'translateX(24px)' : 'translateX(0px)' }}
      />
    </button>
  )
}