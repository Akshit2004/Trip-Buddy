import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
// OrbitChat is loaded dynamically only when the user opens it

import PagePerformanceMonitor from '@/components/PagePerformanceMonitor';
import OrbitChatToggle from '@/components/OrbitChatToggle';
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://tripbuddy.com'),
  title: {
    default: "Trip Buddy - AI-Powered Trip Planner",
    template: "%s | Trip Buddy",
  },
  description: "Plan your perfect trip with Trip Buddy. Use AI to generate personalized itineraries, find hotels, and discover local gems.",
  keywords: ["Trip Planner", "AI Travel", "Itinerary Generator", "Travel Guide", "Vacation Planner", "Trip Buddy"],
  authors: [{ name: "Trip Buddy Team" }],
  creator: "Trip Buddy",
  publisher: "Trip Buddy",
  openGraph: {
    title: "Trip Buddy - AI-Powered Trip Planner",
    description: "Plan your perfect trip with Trip Buddy. Your personal AI travel assistant.",
    url: "/",
    siteName: "Trip Buddy",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists in public folder or update path
        width: 1200,
        height: 630,
        alt: "Trip Buddy Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Buddy - AI-Powered Trip Planner",
    description: "Plan your perfect trip with Trip Buddy. Your personal AI travel assistant.",
    images: ["/twitter-image.jpg"], // Ensure this image exists
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
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground pb-16 md:pb-0`}
      >
        <AuthProvider>
          <Navbar />
          {/* Global performance monitor (client-only) */}
          <PagePerformanceMonitor />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Trip Buddy",
                url: process.env.NEXT_PUBLIC_BASE_URL || 'https://tripbuddy.com',
                logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://tripbuddy.com'}/logo.png`,
                sameAs: [
                  "https://twitter.com/tripbuddy",
                  "https://facebook.com/tripbuddy",
                  "https://instagram.com/tripbuddy"
                ]
              })
            }}
          />
          {/* OrbitChat is loaded dynamically via OrbitChatToggle to avoid shipping heavy JS to all pages */}
          <OrbitChatToggle />
        </AuthProvider>
      </body>
    </html>
  );
}
