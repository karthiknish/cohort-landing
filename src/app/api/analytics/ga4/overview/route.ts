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
  if (typeof value !== 'string' || value.length !== 8) return value;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function numberOrZero(value: unknown) {
  const n = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN;
  return Number.isFinite(n) ? n : 0;
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
        { error: 'Missing GA4_PROPERTY_ID (numeric GA4 property id).' },
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

    const property = `properties/${propertyId}`;
    const dateRanges = [{ startDate: `${days}daysAgo`, endDate: 'today' }];

    const [timeseriesReport, topPagesReport, sourcesReport, eventsReport, devicesReport] = await Promise.all([
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'engagedSessions' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 5,
      }),
    ]);

    const tsRows = timeseriesReport[0].rows || [];
    const timeseries = tsRows.map((row) => {
      const rawDate = row.dimensionValues?.[0]?.value || '';
      const day = yyyymmddToIso(rawDate);
      const views = numberOrZero(row.metricValues?.[0]?.value);
      const users = numberOrZero(row.metricValues?.[1]?.value);
      const sessions = numberOrZero(row.metricValues?.[2]?.value);
      const engagedSessions = numberOrZero(row.metricValues?.[3]?.value);
      return { day, views, users, sessions, engagedSessions };
    });

    const totals = timeseries.reduce(
      (acc, d) => {
        acc.views += d.views;
        acc.users += d.users;
        acc.sessions += d.sessions;
        acc.engagedSessions += d.engagedSessions;
        return acc;
      },
      { views: 0, users: 0, sessions: 0, engagedSessions: 0 }
    );

    const topPages = (topPagesReport[0].rows || []).map((row) => ({
      page: row.dimensionValues?.[0]?.value || '(not set)',
      views: numberOrZero(row.metricValues?.[0]?.value),
    }));

    const topSources = (sourcesReport[0].rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || '(not set)',
      sessions: numberOrZero(row.metricValues?.[0]?.value),
    }));

    const topEvents = (eventsReport[0].rows || []).map((row) => ({
      name: row.dimensionValues?.[0]?.value || '(not set)',
      count: numberOrZero(row.metricValues?.[0]?.value),
    }));

    const devices = (devicesReport[0].rows || []).map((row) => ({
      device: row.dimensionValues?.[0]?.value || '(not set)',
      users: numberOrZero(row.metricValues?.[0]?.value),
    }));

    return NextResponse.json({
      source: 'ga4',
      windowDays: days,
      totals,
      timeseries,
      topPages,
      topSources,
      topEvents,
      devices,
    });
  } catch (error) {
    const code = (error as any)?.code;

    if (code === 7) {
      return NextResponse.json(
        {
          error:
            'GA4 permission denied. Add the service account email (client_email from JSON key) to GA4: Admin → Property access management → Add users → Viewer/Analyst. Also verify GA4_PROPERTY_ID.',
        },
        { status: 403 }
      );
    }

    console.error('GA4 overview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
