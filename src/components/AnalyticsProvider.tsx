'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initAnalytics } from '@/lib/firebase';
import { trackEvent } from '@/lib/analytics-ingest';

/**
 * Check if a path is an admin page that should be excluded from analytics.
 */
function isAdminPage(path: string | null): boolean {
  if (!path) return false;
  return path.startsWith('/admin');
}

/**
 * Analytics Provider component that initializes Firebase Analytics
 * when the app loads in the browser.
 * 
 * Admin pages (/admin/*) are excluded from analytics tracking.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Skip analytics initialization on admin pages
    if (isAdminPage(pathname)) {
      return;
    }
    
    // Initialize analytics on mount
    initAnalytics().then((analytics) => {
      if (analytics) {
        console.log('Firebase Analytics initialized');
      }
    });
  }, [pathname]);

  useEffect(() => {
    // Skip tracking on admin pages
    if (!pathname || isAdminPage(pathname)) return;
    trackEvent('page_view', { path: pathname });
  }, [pathname]);

  return <>{children}</>;
}
