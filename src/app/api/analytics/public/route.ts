import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const db = getAdminFirestore();
    const snap = await db.collection('analytics_counters').doc('global').get();

    const data = snap.exists ? (snap.data() as any) : null;
    const pageViewsTotal = typeof data?.pageViewsTotal === 'number' ? data.pageViewsTotal : 0;

    return NextResponse.json({ pageViewsTotal });
  } catch (error) {
    console.error('Analytics public summary error:', error);
    return NextResponse.json({ pageViewsTotal: 0 }, { status: 200 });
  }
}
