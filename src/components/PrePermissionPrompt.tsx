// src/components/PrePermissionPrompt.tsx

'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

interface PrePermissionPromptProps {
  onAccept: () => void
  onDismiss: () => void
}

export default function PrePermissionPrompt({ onAccept, onDismiss }: PrePermissionPromptProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show prompt if user hasn't been asked before and notifications aren't already granted
    const hasBeenAsked = localStorage.getItem('notifications_prompt_shown')
    const isAlreadyGranted = typeof Notification !== 'undefined' && Notification.permission === 'granted'
    
    if (!hasBeenAsked && !isAlreadyGranted && typeof Notification !== 'undefined') {
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('notifications_prompt_shown', 'true')
    onAccept()
    setVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('notifications_prompt_shown', 'true')
    onDismiss()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 bg-(--txt-clr) border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 md:left-auto md:right-6 md:w-80 animate-in slide-in-from-bottom-5 duration-300">
      <div className="w-10 h-10 rounded-lg bg-(--prof-clr) flex items-center justify-center shrink-0">
        <Bell className="w-5 h-5 text-(--txt-clr)" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800 pry-ff">Stay updated</p>
        <p className="text-xs text-gray-500 sec-ff">Get real-time order updates and offers</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleAccept}
          className="px-3 py-1.5 text-xs font-semibold bg-(--prof-clr) text-(--txt-clr) rounded-lg hover:bg-(--prof-hover-clr) transition cursor-pointer sec-ff"
        >
          Allow
        </button>
        <button
          onClick={handleDismiss}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}