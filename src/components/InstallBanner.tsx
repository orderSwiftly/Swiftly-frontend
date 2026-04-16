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
    <div className="fixed bottom-23 left-4 right-4 z-50 bg-(--txt-clr) border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 md:left-auto md:right-6 md:w-80 sec-ff">
      <div className="w-10 h-10 rounded-lg bg-(--prof-clr) flex items-center justify-center shrink-0">
        <Download className="w-5 h-5 text-(--txt-clr)" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">Install Swiftly</p>
        <p className="text-xs text-gray-500">Add to home screen for a better experience</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={handleInstall} className="text-xs font-semibold text-(--prof-clr) hover:text-(--prof-clr) cursor-pointer">
          Install
        </button>
        <button onClick={handleDismiss} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}