import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

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
    <html
      lang="en"
      data-theme="dark"
      data-lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
