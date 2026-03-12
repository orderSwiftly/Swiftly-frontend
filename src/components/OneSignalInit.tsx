// src/components/OneSignalInit.tsx

"use client"

import { useEffect } from "react"
import OneSignal from "react-onesignal"

let initialized = false

export default function OneSignalInit() {
    useEffect(() => {
        if (initialized) return
        initialized = true

        OneSignal.init({
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
            allowLocalhostAsSecureOrigin: true,
            // @ts-ignore
            notifyButton: {
                enable: false
            }
        }).catch((err) => {
            console.warn("OneSignal init failed:", err)
            initialized = false // reset so it can retry
        })
    }, [])

    return null
}