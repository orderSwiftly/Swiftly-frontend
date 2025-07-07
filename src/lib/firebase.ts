// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

let messaging: Messaging | null = null;

export const initMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') return null; // SSR
  if (!(await isSupported())) return null;        // Browser unsupported

  if (!getApps().length) initializeApp(firebaseConfig);
  if (!messaging) messaging = getMessaging();
  return messaging;
};
