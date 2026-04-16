import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import AuthProvider from "@/components/providers/AuthProvider";
import RegisterSW from "@/components/RegisterSW";
import PromptsWrapper from "@/components/PromptsWrapper";

export const metadata: Metadata = {
  title: {
    default: "Swiftly",
    template: "%s | Swiftly",
  },
  description: "Order Swiftly",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          window.__installPrompt = null;
          window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            window.__installPrompt = e;
          });
        ` }} />
        <link href="https://fonts.cdnfonts.com/css/mona-sans" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital@0;1&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
          <PromptsWrapper />
          <RegisterSW />
        </AuthProvider>
      </body>
    </html>
  );
}