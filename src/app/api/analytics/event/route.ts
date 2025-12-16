import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebase-admin';

type JsonRecord = Record<string, unknown>;

interface AnalyticsEventIngest {
  name: string;
  props?: JsonRecord;
  path?: string;
  referrer?: string;
  sessionId?: string;
  ts?: number; // client timestamp (ms)
}

function clampString(value: unknown, maxLen: number) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

function sanitizeProps(input: unknown): JsonRecord | undefined {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined;

  const record = input as Record<string, unknown>;
  const out: JsonRecord = {};
  const keys = Object.keys(record).slice(0, 30);

  for (const key of keys) {
    if (!key || key.length > 60) continue;
    const value = record[key];

    if (
      value === null ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      out[key] = value;
      continue;
    }

    if (typeof value === 'string') {
      out[key] = value.length > 200 ? value.slice(0, 200) : value;
      continue;
    }

    if (Array.isArray(value)) {
      const arr = value
        .slice(0, 20)
        .map((v) => {
          if (v === null || typeof v === 'number' || typeof v === 'boolean') return v;
          if (typeof v === 'string') return v.length > 120 ? v.slice(0, 120) : v;
          return undefined;
        })
        .filter((v) => v !== undefined);
      out[key] = arr;
      continue;
    }
  }

  return Object.keys(out).length ? out : undefined;
}

function getDayKey(date = new Date()) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as AnalyticsEventIngest | null;
    if (!body?.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
    }

    const name = clampString(body.name, 64);
    if (!name) {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 });
    }

    const path = clampString(body.path, 200);
    const referrer = clampString(body.referrer, 300);
    const sessionId = clampString(body.sessionId, 80);

    const props = sanitizeProps(body.props);

    const db = getAdminFirestore();

    const now = new Date();
    const day = getDayKey(now);

    // Store raw event (for deeper inspection)
    await db.collection('analytics_events').add({
      name,
      props: props || {},
      path: path || null,
      referrer: referrer || null,
      sessionId: sessionId || null,
      clientTs: typeof body.ts === 'number' ? body.ts : null,
      createdAt: FieldValue.serverTimestamp(),
      day,
    });

    // Maintain cheap-to-read daily aggregates
    const dailyRef = db.collection('analytics_daily').doc(day);
    await dailyRef.set(
      {
        day,
        total: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        // dynamic field for event name
        [`events.${name}`]: FieldValue.increment(1),
      },
      { merge: true }
    );

    // Global counters (for fast public display)
    if (name === 'page_view') {
      const countersRef = db.collection('analytics_counters').doc('global');
      await countersRef.set(
        {
          pageViewsTotal: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics ingest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
