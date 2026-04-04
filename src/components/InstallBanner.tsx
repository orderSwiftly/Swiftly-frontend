'use client'

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallBanner() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!promptEvent) return
    await promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === 'accepted') setVisible(false)
    setPromptEvent(null)
  }

  const handleDismiss = () => {
    setVisible(false)
    setPromptEvent(null)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 md:left-auto md:right-6 md:w-80">
      <div className="w-10 h-10 rounded-lg bg-(--bg-clr) flex items-center justify-center shrink-0">
        <Download className="w-5 h-5 text-(--txt-clr)" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">Install Swiftly</p>
        <p className="text-xs text-gray-500">Add to home screen for a better experience</p>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={handleInstall}
          className="text-xs font-semibold text-green-600 hover:text-green-700"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}