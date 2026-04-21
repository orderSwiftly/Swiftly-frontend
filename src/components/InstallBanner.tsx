// src/components/InstallBanner.tsx

'use client'

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    __installPrompt: BeforeInstallPromptEvent | null
  }
}

export default function InstallBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.__installPrompt) {
        setVisible(true)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleInstall = async () => {
    const prompt = window.__installPrompt
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisible(false)
    window.__installPrompt = null
  }

  const handleDismiss = () => {
    setVisible(false)
    window.__installPrompt = null
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-1 right-2 z-50 bg-(--txt-clr) border border-gray-200 rounded-xl shadow-lg p-3 w-64 sec-ff">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-lg bg-(--prof-clr) flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 text-(--txt-clr)" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">Install Swiftly</p>
          <p className="text-xs text-gray-500">Add to home screen</p>
        </div>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 cursor-pointer -mt-1">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <button 
        onClick={handleInstall} 
        className="mt-2 w-full text-xs font-semibold text-(--prof-clr) hover:text-(--prof-clr) cursor-pointer py-1.5 px-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        Install App
      </button>
    </div>
  )
}