'use client';

import { logAnalyticsEvent } from '@/lib/analytics';

type JsonRecord = Record<string, unknown>;

function safeString(value: unknown, maxLen: number) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return undefined;

  try {
    const key = 'cohorts_session_id';
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;

    const created = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : String(Date.now()) + '-' + String(Math.random()).slice(2);

    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return undefined;
  }
}

export async function trackServerEvent(name: string, props?: JsonRecord) {
  if (typeof window === 'undefined') return;

  const payload = {
    name: safeString(name, 64) || name,
    props: props || {},
    path: safeString(window.location?.pathname, 200) || undefined,
    referrer: safeString(document.referrer, 300) || undefined,
    sessionId: getOrCreateSessionId(),
    ts: Date.now(),
  };

  // Prefer sendBeacon for reliability on navigation
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/event', blob);
      return;
    }
  } catch {
    // fall through
  }

  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

export function trackEvent(name: string, props?: JsonRecord) {
  try {
    logAnalyticsEvent(name, props);
  } catch {
    // ignore
  }

  try {
    void trackServerEvent(name, props);
  } catch {
    // ignore
  }
}
