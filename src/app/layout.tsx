import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: "Tredia - Trust-first gamified marketplace",
    template: "%s | Tredia",
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
      </head>
      <body>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}