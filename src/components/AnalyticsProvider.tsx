'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase';

/**
 * Analytics Provider component that initializes Firebase Analytics
 * when the app loads in the browser.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize analytics on mount
    initAnalytics().then((analytics) => {
      if (analytics) {
        console.log('Firebase Analytics initialized');
      }
    });
  }, []);

  return <>{children}</>;
}
