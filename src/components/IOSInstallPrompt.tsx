// src/components/PrePermissionPrompt.tsx

'use client'

import { useState, useEffect } from 'react'
import { X, Share2, Plus, NavigationIcon } from 'lucide-react'

// Type for iOS standalone property
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

export default function IOSInstallPrompt() {
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if iOS - including iPadOS 13+ (desktop-class browsing)
    const userAgent = navigator.userAgent
    const iOS = /iPad|iPhone|iPod/.test(userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPadOS 13+
    setIsIOS(iOS)
    
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (navigator as NavigatorWithStandalone).standalone === true
    setIsStandalone(standalone)
    
    // Show prompt if iOS, not standalone, and not dismissed before
    if (iOS && !standalone) {
      const hasBeenDismissed = localStorage.getItem('ios_install_dismissed')
      if (!hasBeenDismissed) {
        const timer = setTimeout(() => setVisible(true), 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    localStorage.setItem('ios_install_dismissed', 'true')
  }

  if (!visible || !isIOS || isStandalone) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-(--txt-clr) border border-gray-200 rounded-xl shadow-lg p-4 md:left-auto md:right-6 md:w-96 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-(--prof-clr) flex items-center justify-center shrink-0">
          <NavigationIcon className="w-5 h-5 text-(--txt-clr)" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Install Swiftly on iOS</p>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 space-y-2">
            <p className="text-xs text-gray-600">Tap the share button</p>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">→</span>
              <Plus className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">→ Add to Home Screen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}