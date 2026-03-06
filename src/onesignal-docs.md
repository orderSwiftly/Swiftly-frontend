# OneSignal Setup — Frontend Docs

---

## Install
```bash
npm install react-onesignal
```

Create a file at `public/OneSignalSDKWorker.js` with the following content:

```js
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
```

This file is what allows notifications to be received even when the app is not open.

---

## Environment Variable
```env
VITE_ONESIGNAL_APP_ID=your_app_id_here
```
Get the App ID from **OneSignal dashboard → Settings → Keys & IDs**.

---

## Init — Where and Why

The init should live in your **root layout file** — whatever file wraps your entire app. In a typical React/Vite project that's `App.tsx`. In Next.js it would be `_app.tsx` or your root `layout.tsx`.

The reason it goes here is that OneSignal needs to initialize once when the app first loads, before any user interaction happens. It registers the service worker in the background and prepares the SDK. You never need to call `init` more than once.

```tsx
// App.tsx (or your root layout)
import { useEffect } from 'react'
import OneSignal from 'react-onesignal'

export default function App() {
  useEffect(() => {
    OneSignal.init({
      appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
      notifyButton: { enable: false }
    })
  }, [])

  return (
    // ... rest of your app
  )
}
```

---

## Requesting Permission — Register Page

Permission should be requested during registration, not randomly while the user is browsing. This gives context — the user understands why the app needs notifications.

After their account is created, ask for permission and then immediately link their device to their account using `OneSignal.login()`. The ID you pass to `login()` must be the same ID your backend uses when sending notifications — use the user's ID from your database.

```tsx
// RegisterPage.tsx
import OneSignal from 'react-onesignal'

async function handleRegister() {
  // 1. Create their account
  const response = await fetch('/api/register', { ... })
  const user = await response.json()

  // 2. Request notification permission
  const permission = await OneSignal.Notifications.requestPermission()

  if (!permission) {
    setError('You must enable notifications to use this app')
    return
  }

  // 3. Link this device to this user in OneSignal
  await OneSignal.login(user.id)
  await OneSignal.User.addTag('role', user.role) // e.g. 'rider', 'seller', 'buyer'

  // 4. Proceed
  navigate('/dashboard')
}
```

---

## Tagging Users by Role

After calling `OneSignal.login()`, tag the user with their role. This allows the backend to send notifications to all users of a specific role without needing to look up their IDs.

```tsx
// After OneSignal.login(user.id)
await OneSignal.User.addTag('role', user.role) // e.g. 'rider', 'seller', 'buyer'
```

---

## On Login

Every time the user logs in on a device, call `login()` again. This ensures that device is always linked to their account — especially important if they log in on a new phone.

```tsx
// LoginPage.tsx
async function handleLogin() {
  const response = await fetch('/api/login', { ... })
  const user = await response.json()

  await OneSignal.login(user.id)
  await OneSignal.User.addTag('role', user.role)

  navigate('/dashboard')
}
```
