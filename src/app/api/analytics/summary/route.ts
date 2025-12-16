import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';

async function verifyAdminRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  try {
    const token = match[1];
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}

function getDayKey(date = new Date()) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyAdminRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(Math.max(Number(searchParams.get('days') || '30'), 1), 90);

    const db = getAdminFirestore();

    const now = new Date();
    const start = new Date(now);
    start.setUTCDate(now.getUTCDate() - (days - 1));
    const startDay = getDayKey(start);

    const dailySnap = await db
      .collection('analytics_daily')
      .where('day', '>=', startDay)
      .orderBy('day', 'asc')
      .get();

    const byDay: Array<{ day: string; count: number }> = [];
    const byEventMap = new Map<string, number>();
    let total = 0;

    for (const doc of dailySnap.docs) {
      const data = doc.data() as any;
      const day = typeof data.day === 'string' ? data.day : doc.id;
      const count = typeof data.total === 'number' ? data.total : 0;
      byDay.push({ day, count });
      total += count;

      const events = data.events && typeof data.events === 'object' ? data.events : null;
      if (events) {
        for (const [name, value] of Object.entries(events)) {
          if (typeof value !== 'number') continue;
          byEventMap.set(name, (byEventMap.get(name) || 0) + value);
        }
      }
    }

    const byEvent = Array.from(byEventMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      windowDays: days,
      total,
      byDay,
      byEvent,
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
