'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import App from '../src/App';

const emptySubscribe = () => () => {};

export default function HomePage() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    // OFFLINE PWA UPGRADE: Register Service Worker (sw.js) and force update so stale caches are purged
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {
          // Silent fallback in restricted iframe environments
        });
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return <App />;
}
