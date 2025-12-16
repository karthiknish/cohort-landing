'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initAnalytics } from '@/lib/firebase';
import { trackEvent } from '@/lib/analytics-ingest';

/**
 * Analytics Provider component that initializes Firebase Analytics
 * when the app loads in the browser.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics on mount
    initAnalytics().then((analytics) => {
      if (analytics) {
        console.log('Firebase Analytics initialized');
      }
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;
    trackEvent('page_view', { path: pathname });
  }, [pathname]);

  return <>{children}</>;
}
