// src/lib/push.ts

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export async function isSubscribed(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  return !!subscription
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const registration = await navigator.serviceWorker.register('/web-push-service-worker.js')
  await navigator.serviceWorker.ready

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
  })

  const token = localStorage.getItem('token')
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/webpush/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ subscription })
  })

  return subscription
}

export async function unsubscribeFromPush(): Promise<void> {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) return

  const token = localStorage.getItem('token')
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/webpush/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ subscription })
  })

  await subscription.unsubscribe()
}