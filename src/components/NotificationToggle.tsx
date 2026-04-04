// src/components/NotificationToggle.tsx

'use client'

'use client'

import { useState, useEffect } from 'react'
import { subscribeToPush, unsubscribeFromPush, isSubscribed } from '@/lib/push'
import { toast } from 'react-hot-toast'

export function NotificationToggle() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    isSubscribed().then(setEnabled)
  }, [])

  const toggle = async () => {
    setLoading(true)
    try {
      if (enabled) {
        await unsubscribeFromPush()
        setEnabled(false)
        toast.success('Notifications turned off')
      } else {
        await subscribeToPush()
        const subscribed = await isSubscribed()
        setEnabled(subscribed)
        if (subscribed) {
          toast.success('Notifications turned on')
        } else {
          toast.error('Permission denied — enable notifications in your browser settings')
        }
      }
    } catch {
      toast.error('Something went wrong, try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={toggle} disabled={loading}>
      {enabled ? 'Turn off notifications' : 'Turn on notifications'}
    </button>
  )
}