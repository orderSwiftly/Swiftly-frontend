// src/lib/push.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

function isSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  )
}

export async function isSubscribed(userId: string): Promise<boolean> {
  if (!isSupported()) return false
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) return false

  // Confirm this device's subscription belongs to the current user
  const storedUserId = localStorage.getItem('push_user_id')
  return storedUserId === userId
}

export async function subscribeToPush(
  token: string,
  userId: string
): Promise<PushSubscription | null> {
  if (!isSupported()) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const registration = await navigator.serviceWorker.ready
  await navigator.serviceWorker.ready

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  })

  await fetch(`${API_URL}/api/v1/webpush/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subscription }),
  })

  // Tag this subscription to the current user
  localStorage.setItem('push_user_id', userId)

  return subscription
}

export async function unsubscribeFromPush(token: string): Promise<void> {
  if (!isSupported()) return

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) return

  await fetch(`${API_URL}/api/v1/webpush/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subscription }),
  })

  await subscription.unsubscribe()
  localStorage.removeItem('push_user_id')
}