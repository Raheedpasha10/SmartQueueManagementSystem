import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mediqueue.vercel.app'),
  title: {
    default: "MediQueue - Smart Hospital Queue Management",
    template: "%s | MediQueue",
  },
  description: "Book same-day hospital appointments with emergency prioritization. Access 100+ hospitals instantly with real-time queue tracking and smart triage system.",
  keywords: [
    "hospital appointment",
    "queue management",
    "emergency booking",
    "healthcare",
    "online doctor booking",
    "hospital booking system",
    "medical appointment",
    "queue tracking",
    "emergency triage",
    "multi-hospital network",
    "same-day appointment",
    "hospital management system"
  ],
  authors: [{ name: "MediQueue Team" }],
  creator: "MediQueue",
  publisher: "MediQueue",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MediQueue - Smart Hospital Queue Management",
    description: "Book same-day appointments with emergency prioritization across 100+ hospitals",
    type: "website",
    locale: "en_US",
    siteName: "MediQueue",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediQueue - Smart Hospital Queue Management",
    description: "Book same-day appointments with emergency prioritization",
    creator: "@mediqueue",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
    yandex: '',
  },
  alternates: {
    canonical: '/',
  },
  category: 'healthcare',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

