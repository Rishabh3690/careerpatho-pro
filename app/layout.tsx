import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerPathO — Find Your Path | 100% Free Indian Career Discovery',
  description:
    'CareerPathO — free trilingual (English, Hinglish, Hindi) career guidance for Indian students after Class 10, 12, and graduation. No login, no ads, zero sales calls.',
  openGraph: {
    title: 'CareerPathO — Find Your Path | 100% Free Indian Career Discovery',
    description:
      'CareerPathO — free trilingual (English, Hinglish, Hindi) career guidance for Indian students after Class 10, 12, and graduation. No login, no ads, zero sales calls.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerPathO — Find Your Path | 100% Free Indian Career Discovery',
    description:
      'CareerPathO — free trilingual (English, Hinglish, Hindi) career guidance for Indian students after Class 10, 12, and graduation. No login, no ads, zero sales calls.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
