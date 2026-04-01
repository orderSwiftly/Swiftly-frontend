'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { initMessaging } from '@/lib/firebase';

export default function PushNotification() {
  useEffect(() => {
    (async () => {
      const messaging = await initMessaging();
      if (!messaging) return;

      const [{ getToken, onMessage }] = await Promise.all([
        import('firebase/messaging'), // <-- import dynamically
        navigator.serviceWorker.ready,
      ]);

      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: '/firebase-cloud-messaging-push-scope' }
      );

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        console.log('✅ FCM Token:', token);
        // TODO: Send token to backend
      }

      onMessage(messaging, (payload) => {
        toast(payload.notification?.title || 'New Notification!');
      });
    })();
  }, []);

  return null;
}
