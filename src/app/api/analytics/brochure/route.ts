import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, getAdminAuth } from '@/lib/firebase-admin';

interface BrochureAnalytics {
  totals: {
    ctaClicked: number;
    modalOpened: number;
    modalClosed: number;
    submitStarted: number;
    submitSuccess: number;
    submitFailed: number;
    submitBlocked: number;
  };
  conversionRates: {
    clickToOpen: number;
    openToSubmit: number;
    submitToSuccess: number;
    overallConversion: number;
  };
  sources: Record<string, {
    opened: number;
    submitted: number;
    success: number;
  }>;
  timeseries: Array<{
    day: string;
    opened: number;
    submitted: number;
    success: number;
  }>;
  recentEvents: Array<{
    name: string;
    source: string;
    createdAt: string;
  }>;
}

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

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyAdminRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const db = getAdminFirestore();

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Brochure-related event names (filter in-memory to avoid composite index requirement)
    const brochureEventNames = new Set([
      'brochure_modal_opened',
      'brochure_modal_closed', 
      'lead_submit_started',
      'lead_submit_success',
      'lead_submit_failed',
      'lead_submit_blocked',
      'cta_clicked',
    ]);

    // Query events within the date range, filter by name in-memory
    // This avoids requiring a composite index on (name, createdAt)
    const eventsSnapshot = await db
      .collection('analytics_events')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .orderBy('createdAt', 'desc')
      .limit(10000)
      .get();

    // Initialize counters
    const totals = {
      ctaClicked: 0,
      modalOpened: 0,
      modalClosed: 0,
      submitStarted: 0,
      submitSuccess: 0,
      submitFailed: 0,
      submitBlocked: 0,
    };

    const sources: Record<string, { opened: number; submitted: number; success: number }> = {};
    const dailyData: Record<string, { opened: number; submitted: number; success: number }> = {};
    const recentEvents: Array<{ name: string; source: string; createdAt: string }> = [];

    // Process events
    eventsSnapshot.forEach((doc) => {
      const data = doc.data();
      const eventName = data.name as string;
      
      // Skip events that aren't brochure-related
      if (!brochureEventNames.has(eventName)) return;
      
      const props = (data.props || {}) as Record<string, unknown>;
      const source = (props.source as string) || 'unknown';
      const createdAt = data.createdAt?.toDate?.()?.toISOString() || '';
      const day = data.day as string || createdAt.slice(0, 10);

      // Count totals
      switch (eventName) {
        case 'cta_clicked':
          if (props.cta_name === 'download_brochure') {
            totals.ctaClicked++;
          }
          break;
        case 'brochure_modal_opened':
          totals.modalOpened++;
          if (!sources[source]) {
            sources[source] = { opened: 0, submitted: 0, success: 0 };
          }
          sources[source].opened++;
          if (day && !dailyData[day]) {
            dailyData[day] = { opened: 0, submitted: 0, success: 0 };
          }
          if (day) dailyData[day].opened++;
          break;
        case 'brochure_modal_closed':
          totals.modalClosed++;
          break;
        case 'lead_submit_started':
          totals.submitStarted++;
          if (!sources[source]) {
            sources[source] = { opened: 0, submitted: 0, success: 0 };
          }
          sources[source].submitted++;
          if (day && !dailyData[day]) {
            dailyData[day] = { opened: 0, submitted: 0, success: 0 };
          }
          if (day) dailyData[day].submitted++;
          break;
        case 'lead_submit_success':
          totals.submitSuccess++;
          if (!sources[source]) {
            sources[source] = { opened: 0, submitted: 0, success: 0 };
          }
          sources[source].success++;
          if (day && !dailyData[day]) {
            dailyData[day] = { opened: 0, submitted: 0, success: 0 };
          }
          if (day) dailyData[day].success++;
          break;
        case 'lead_submit_failed':
          totals.submitFailed++;
          break;
        case 'lead_submit_blocked':
          totals.submitBlocked++;
          break;
      }

      // Collect recent events (first 20)
      if (recentEvents.length < 20) {
        recentEvents.push({
          name: eventName,
          source,
          createdAt,
        });
      }
    });

    // Calculate conversion rates
    const conversionRates = {
      clickToOpen: totals.ctaClicked > 0 
        ? Math.round((totals.modalOpened / totals.ctaClicked) * 100) 
        : 0,
      openToSubmit: totals.modalOpened > 0 
        ? Math.round((totals.submitStarted / totals.modalOpened) * 100) 
        : 0,
      submitToSuccess: totals.submitStarted > 0 
        ? Math.round((totals.submitSuccess / totals.submitStarted) * 100) 
        : 0,
      overallConversion: totals.ctaClicked > 0 
        ? Math.round((totals.submitSuccess / totals.ctaClicked) * 100) 
        : 0,
    };

    // Sort timeseries by day
    const timeseries = Object.entries(dailyData)
      .map(([day, data]) => ({ day, ...data }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const response: BrochureAnalytics = {
      totals,
      conversionRates,
      sources,
      timeseries,
      recentEvents,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching brochure analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
