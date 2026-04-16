// src/components/PromptsWrapper.tsx

// layout wrapper for the app

'use client'

import { useEffect } from 'react'
import InstallBanner from './InstallBanner'
import IOSInstallPrompt from './IOSInstallPrompt'
import PrePermissionPrompt from './PrePermissionPrompt'
import { subscribeToPush } from '@/lib/push'

export default function PromptsWrapper() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        console.log('Service Worker ready for notifications')
      })
    }
  }, [])

  const handleAcceptNotifications = async () => {
    try {
      await subscribeToPush()
    } catch (error) {
      console.error('Failed to subscribe to push:', error)
    }
  }

  const handleDismissNotifications = () => {
    console.log('User dismissed notification prompt')
  }

  return (
    <>
      <InstallBanner />
      <IOSInstallPrompt />
      <PrePermissionPrompt 
        onAccept={handleAcceptNotifications}
        onDismiss={handleDismissNotifications}
      />
    </>
  )
}