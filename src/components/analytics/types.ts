export type Ga4OverviewResponse = {
  source: 'ga4';
  windowDays: number;
  totals: {
    views: number;
    users: number;
    sessions: number;
    engagedSessions: number;
  };
  timeseries: Array<{
    day: string; // YYYY-MM-DD
    views: number;
    users: number;
    sessions: number;
    engagedSessions: number;
  }>;
  topPages: Array<{ page: string; views: number }>;
  topSources: Array<{ source: string; sessions: number }>;
  topEvents: Array<{ name: string; count: number }>;
  devices: Array<{ device: string; users: number }>;
};

export type TimeseriesDataPoint = Ga4OverviewResponse['timeseries'][number] & {
  label: string;
};

export function toTick(day: string) {
  if (day.length !== 10) return day;
  try {
    const date = new Date(day + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return `${day.slice(5, 7)}/${day.slice(8, 10)}`;
  }
}

export function toFullDate(day: string) {
  if (day.length !== 10) return day;
  try {
    const date = new Date(day + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return day;
  }
}

export function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat('en-US').format(n);
  } catch {
    return String(n);
  }
}

export const CHART_COLORS = {
  navy: '#001640',
  blue: '#7389F4',
  muted1: 'rgba(0, 22, 64, 0.6)',
  muted2: 'rgba(115, 137, 244, 0.6)',
  beige: '#F1F1E6',
};

// Source-specific colors for traffic sources
export const SOURCE_COLORS: Record<string, string> = {
  'google': '#4285F4',
  'direct': '#001640',
  '(direct)': '#001640',
  'facebook': '#1877F2',
  'instagram': '#E4405F',
  'twitter': '#1DA1F2',
  'x': '#000000',
  'linkedin': '#0A66C2',
  'youtube': '#FF0000',
  'tiktok': '#000000',
  'reddit': '#FF4500',
  'pinterest': '#E60023',
  'bing': '#008373',
  'yahoo': '#6001D2',
  'duckduckgo': '#DE5833',
  'organic': '#34A853',
  'referral': '#7389F4',
  'email': '#EA4335',
  '(not set)': '#9CA3AF',
};

export function getSourceColor(source: string): string {
  const key = source.toLowerCase();
  for (const [k, v] of Object.entries(SOURCE_COLORS)) {
    if (key.includes(k)) return v;
  }
  return CHART_COLORS.blue;
}

export const PIE_COLORS = [
  CHART_COLORS.navy,
  CHART_COLORS.blue,
  '#34A853',
  '#EA4335',
  '#FBBC05',
];

export const TOOLTIP_STYLE = {
  background: '#001640',
  border: '1px solid rgba(115, 137, 244, 0.3)',
  borderRadius: 12,
  color: 'white',
};
