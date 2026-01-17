/* eslint-disable @next/next/no-page-custom-font */
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import PushNotification from "@/components/PushNotification";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Swiftly - Trust-first marketplace",
    template: "%s | Swiftly",
  },
  description: "Trust-first commerce for university trade and beyond",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Mona Sans CDN link */}
        <link
          href="https://fonts.cdnfonts.com/css/mona-sans"
          rel="stylesheet"
        />
        {/* Manrope Google Fonts link */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
          rel="stylesheet"
        />

        {/* Plus Jakarta Sans Google Fonts link */}
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
          <PushNotification />
        </AuthProvider>
      </body>
    </html>
  );
}