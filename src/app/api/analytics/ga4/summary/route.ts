import { NextRequest, NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getAdminAuth } from '@/lib/firebase-admin';
import { getGoogleServiceAccountFromBase64 } from '@/lib/google-service-account';

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

function yyyymmddToIso(value: string) {
  // GA4 date dimension: YYYYMMDD
  if (typeof value !== 'string' || value.length !== 8) return value;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyAdminRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(Math.max(Number(searchParams.get('days') || '30'), 1), 90);

    const propertyId = process.env.GA4_PROPERTY_ID || process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    if (!propertyId) {
      return NextResponse.json(
        {
          error:
            'Missing GA4_PROPERTY_ID (GA4 property numeric id). Set this env var to enable GA4 extraction.',
        },
        { status: 400 }
      );
    }

    const sa = getGoogleServiceAccountFromBase64();

    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: sa.client_email,
        private_key: sa.private_key,
      },
    });

    // Pull daily page views for the last N days.
    // NOTE: metric is "screenPageViews" for GA4.
    const [report] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const rows = report.rows || [];
    const byDay = rows.map((row) => {
      const rawDate = row.dimensionValues?.[0]?.value || '';
      const viewsRaw = row.metricValues?.[0]?.value || '0';
      const count = Number(viewsRaw) || 0;
      return { day: yyyymmddToIso(rawDate), count };
    });

    const total = byDay.reduce((sum, d) => sum + d.count, 0);

    return NextResponse.json({
      source: 'ga4',
      windowDays: days,
      total,
      byDay,
      // keep shape similar to Firestore summary
      byEvent: [{ name: 'page_view', count: total }],
    });
  } catch (error) {
    // The GA4 Data API client throws gRPC-style errors with a numeric `code`.
    const code = (error as any)?.code;

    if (code === 7) {
      // PERMISSION_DENIED
      return NextResponse.json(
        {
          error:
            'GA4 permission denied. Add your service account email (client_email from the JSON key) to GA4: Admin → Property access management → Add users → Viewer (or Analyst). Also verify GA4_PROPERTY_ID is correct.',
        },
        { status: 403 }
      );
    }

    console.error('GA4 summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
