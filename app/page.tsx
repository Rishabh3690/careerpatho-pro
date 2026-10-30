'use client';

import React, { useState, useEffect } from 'react';
import App from '../src/App';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // OFFLINE PWA UPGRADE: Register Service Worker (sw.js) for 2G/3G offline caching
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silent fallback in restricted iframe environments
      });
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#f5f5f5] p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-14 w-full rounded-xl bg-[#111111] border border-[#262626] animate-pulse" />
          <div className="h-72 w-full rounded-2xl bg-[#111111] border border-[#262626] animate-pulse" />
        </div>
      </div>
    );
  }

  return <App />;
}
