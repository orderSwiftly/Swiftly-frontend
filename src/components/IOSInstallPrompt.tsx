// src/components/PrePermissionPrompt.tsx

'use client'

import { useState, useEffect } from 'react'
import { X, Share2, Plus, Upload } from 'lucide-react'

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
    <div className="fixed bottom-1 right-2 z-50 bg-(--txt-clr) border border-gray-200 rounded-xl shadow-lg p-3 w-64 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-lg bg-(--prof-clr) flex items-center justify-center shrink-0">
          <Upload className="w-4 h-4 text-(--txt-clr)" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-800">Install on iOS</p>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 -mt-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-1.5 space-y-1.5">
            <p className="text-xs text-gray-600">Tap Share → Add to Home Screen</p>
            <div className="flex items-center gap-1.5">
              <Share2 className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600">→</span>
              <Plus className="w-3 h-3 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}