import { logEvent, Analytics } from 'firebase/analytics';
import { getAnalyticsInstance } from './firebase';

/**
 * Log a custom analytics event.
 * 
 * @param eventName - Name of the event to log
 * @param eventParams - Optional parameters to include with the event
 */
export const logAnalyticsEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  const analytics = getAnalyticsInstance();
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

// Pre-defined event helpers for common actions
export const analyticsEvents = {
  // Lead generation events
  formSubmitted: (formName: string, leadData?: Record<string, unknown>) => {
    logAnalyticsEvent('form_submitted', { form_name: formName, ...leadData });
  },
  
  brochureDownloaded: () => {
    logAnalyticsEvent('brochure_downloaded');
  },
  
  ctaClicked: (ctaName: string, location: string) => {
    logAnalyticsEvent('cta_clicked', { cta_name: ctaName, location });
  },
  
  // Navigation events
  pageViewed: (pageName: string) => {
    logAnalyticsEvent('page_view', { page_name: pageName });
  },
  
  sectionViewed: (sectionName: string) => {
    logAnalyticsEvent('section_viewed', { section_name: sectionName });
  },
  
  // Engagement events
  externalLinkClicked: (url: string) => {
    logAnalyticsEvent('external_link_clicked', { url });
  },
  
  scrollDepthReached: (depth: number) => {
    logAnalyticsEvent('scroll_depth', { depth_percentage: depth });
  },
};
