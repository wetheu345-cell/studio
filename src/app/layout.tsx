
'use client';
import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { HorseIntroAnimation } from '@/components/layout/HorseIntroAnimation';

const metadata: Metadata = {
  title: 'EHW Lessons',
  description: 'Schedule horse riding lessons with Ebony Horse Women',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenEHWIntro');
    if (!hasSeenIntro) {
      setShowIntro(true);
      localStorage.setItem('hasSeenEHWIntro', 'true');
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Belleza&family=Alegreya+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased text-foreground')}>
        <FirebaseClientProvider>
          {showIntro ? (
            <HorseIntroAnimation onComplete={() => setShowIntro(false)} />
          ) : (
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          )}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
