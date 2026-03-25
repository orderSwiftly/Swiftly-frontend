/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import AuthProvider from "@/components/providers/AuthProvider";
import ServiceWorker from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: {
    default: "Swiftly",
    template: "%s | Swiftly",
  },
  description: "Trust-first commerce for university trade and beyond",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/mona-sans" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}