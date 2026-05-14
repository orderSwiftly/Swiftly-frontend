// src/hooks/usePushNotifications.ts

'use client'

import { useState, useEffect, useCallback } from 'react'
import { subscribeToPush, unsubscribeFromPush, isSubscribed } from '@/lib/push'
import { toast } from 'react-hot-toast'

export function usePushNotifications() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default')

  // Check permission state
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission)
    }
  }, [])

  // Check subscription status on mount and when user changes
  const checkSubscription = useCallback(async () => {
    try {
      const subscribed = await isSubscribed()
      setEnabled(subscribed)
    } catch (error) {
      console.error('Error checking subscription:', error)
      setEnabled(false)
    }
  }, [])

  useEffect(() => {
    checkSubscription()
  }, [checkSubscription])

const toggleNotifications = useCallback(async () => {
  if (!enabled) {
    // Check before attempting anything
    if (Notification.permission === 'denied') {
      toast.error('Notifications blocked — enable them in your browser settings')
      return
    }
  }

  setLoading(true)
  try {
    if (enabled) {
      await unsubscribeFromPush()
      setEnabled(false)
      toast.success('Notifications turned off')
    } else {
      const subscription = await subscribeToPush()
      if (subscription) {
        setEnabled(true)
        setPermissionState('granted')
        toast.success('Notifications enabled')
      } else {
        // permission was 'default' but user dismissed — update state
        setPermissionState(Notification.permission)
        toast.error('Permission denied — enable notifications in your browser settings')
      }
    }
  } catch (error) {
    console.error('Toggle error:', error)
    setPermissionState(Notification.permission) // sync after any outcome
    toast.error('Something went wrong, try again')
  } finally {
    setLoading(false)
  }
}, [enabled])

  return {
    enabled,
    loading,
    permissionState,
    toggleNotifications,
    checkSubscription
  }
}