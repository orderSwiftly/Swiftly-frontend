// src/components/ServiceWorker.tsx

'use client'

import { useEffect } from 'react'

const DEBUG = false // flip to true when you need logs

export default function ServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((existing) => {
        if (existing) {
          if (DEBUG) console.log('SW already registered')
        } else {
          navigator.serviceWorker
            .register('/web-push-service-worker.js')
            .then((reg) => {
              if (DEBUG) console.log('SW registered:', reg)
            })
            .catch((err) => {
              if (DEBUG) console.error('SW error:', err)
            })
        }
      })
    }
  }, [])

  return null
}