import { NextRequest, NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getGoogleServiceAccountFromBase64 } from '@/lib/google-service-account';
import { getAdminAuth } from '@/lib/firebase-admin';

const propertyId = process.env.GA4_PROPERTY_ID;

// ============================================
// In-memory cache to reduce GA4 API calls
// ============================================
const CACHE_TTL_MS = 45 * 1000; // 45 seconds cache TTL

interface CachedResponse {
  data: {
    totalActiveUsers: number;
    countries: Array<{ country: string; countryCode: string; activeUsers: number }>;
    pages: Array<{ page: string; activeUsers: number }>;
    sources: Array<{ source: string; activeUsers: number }>;
    timestamp: string;
    cached: boolean;
    cacheAge?: number;
  };
  cachedAt: number;
}

let realtimeCache: CachedResponse | null = null;

function getCachedResponse(): CachedResponse['data'] | null {
  if (!realtimeCache) return null;
  
  const now = Date.now();
  const age = now - realtimeCache.cachedAt;
  
  if (age > CACHE_TTL_MS) {
    // Cache expired
    realtimeCache = null;
    return null;
  }
  
  // Return cached data with cache age info
  return {
    ...realtimeCache.data,
    cached: true,
    cacheAge: Math.round(age / 1000),
  };
}

function setCachedResponse(data: Omit<CachedResponse['data'], 'cached' | 'cacheAge'>) {
  realtimeCache = {
    data: { ...data, cached: false },
    cachedAt: Date.now(),
  };
}


// Map common country names to ISO 3166-1 alpha-2 codes
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'United States': 'US',
  'Canada': 'CA',
  'Mexico': 'MX',
  'Brazil': 'BR',
  'Argentina': 'AR',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Germany': 'DE',
  'Italy': 'IT',
  'Spain': 'ES',
  'Portugal': 'PT',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Poland': 'PL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Finland': 'FI',
  'Denmark': 'DK',
  'Ireland': 'IE',
  'Russia': 'RU',
  'Ukraine': 'UA',
  'Turkey': 'TR',
  'India': 'IN',
  'China': 'CN',
  'Japan': 'JP',
  'South Korea': 'KR',
  'Australia': 'AU',
  'New Zealand': 'NZ',
  'South Africa': 'ZA',
  'Egypt': 'EG',
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'United Arab Emirates': 'AE',
  'Saudi Arabia': 'SA',
  'Israel': 'IL',
  'Singapore': 'SG',
  'Malaysia': 'MY',
  'Indonesia': 'ID',
  'Thailand': 'TH',
  'Vietnam': 'VN',
  'Philippines': 'PH',
  'Pakistan': 'PK',
  'Bangladesh': 'BD',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Peru': 'PE',
  'Venezuela': 'VE',
  'Greece': 'GR',
  'Czech Republic': 'CZ',
  'Czechia': 'CZ',
  'Romania': 'RO',
  'Hungary': 'HU',
  'Bulgaria': 'BG',
  'Croatia': 'HR',
  'Serbia': 'RS',
  'Slovakia': 'SK',
  'Slovenia': 'SI',
  'Lithuania': 'LT',
  'Latvia': 'LV',
  'Estonia': 'EE',
  'Taiwan': 'TW',
  'Hong Kong': 'HK',
};

export async function GET(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  try {
    const adminAuth = getAdminAuth();
    await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (!propertyId) {
    return NextResponse.json({ error: 'GA4_PROPERTY_ID not configured' }, { status: 500 });
  }

  let credentials;
  try {
    credentials = getGoogleServiceAccountFromBase64();
  } catch {
    return NextResponse.json({ error: 'Google credentials not configured' }, { status: 500 });
  }

  try {
    // Check cache first to reduce API calls
    const cachedData = getCachedResponse();
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

    // Run multiple realtime reports in parallel
    // Note: Realtime API has limited dimensions - countryId is not available
    const [activeUsersReport, countryReport, pageReport, deviceReport] = await Promise.all([
      // Total active users
      analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      }),
      // Active users by country
      analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        limit: 50,
      }),
      // Active users by page title
      analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        dimensions: [{ name: 'unifiedScreenName' }],
        metrics: [{ name: 'activeUsers' }],
        limit: 10,
      }),
      // Active users by device category
      analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
        limit: 10,
      }),
    ]);

    // Parse total active users
    // Subtract 1 to exclude the admin currently viewing this dashboard
    const rawActiveUsers = parseInt(
      activeUsersReport[0]?.rows?.[0]?.metricValues?.[0]?.value || '0',
      10
    );
    const totalActiveUsers = Math.max(0, rawActiveUsers - 1);

    // Parse countries and map to ISO codes
    const countries = (countryReport[0]?.rows || []).map((row) => {
      const countryName = row.dimensionValues?.[0]?.value || 'Unknown';
      return {
        country: countryName,
        countryCode: COUNTRY_NAME_TO_CODE[countryName] || '',
        activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
      };
    });

    // Parse pages - filter out admin pages
    const pages = (pageReport[0]?.rows || [])
      .map((row) => ({
        page: row.dimensionValues?.[0]?.value || 'Unknown',
        activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
      }))
      .filter((p) => !p.page.toLowerCase().includes('admin'));

    // Parse devices as sources (since sessionSource isn't available in realtime)
    const sources = (deviceReport[0]?.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || 'unknown',
      activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
    }));

    // Build response data
    const responseData = {
      totalActiveUsers,
      countries,
      pages,
      sources,
      timestamp: new Date().toISOString(),
      cached: false,
    };

    // Cache the response for future requests
    setCachedResponse(responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('GA4 Realtime API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('PERMISSION_DENIED') || message.includes('403')) {
      return NextResponse.json(
        {
          error:
            'Permission denied. Add your service account email to GA4 Admin → Property access management with Viewer role.',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
