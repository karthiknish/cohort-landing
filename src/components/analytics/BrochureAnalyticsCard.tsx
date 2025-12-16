'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, FileDown, MousePointer, UserPlus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatNumber, TOOLTIP_STYLE, CHART_COLORS, toTick } from './types';

interface BrochureAnalyticsData {
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

interface BrochureAnalyticsCardProps {
  authToken: string;
  days?: number;
}

const FUNNEL_COLORS = {
  clicked: '#7389F4',
  opened: '#001640',
  submitted: '#34A853',
  success: '#10B981',
  failed: '#EF4444',
  blocked: '#F59E0B',
};

const SOURCE_LABEL_MAP: Record<string, string> = {
  navbar: 'Navigation Bar',
  cta: 'CTA Section',
  hero: 'Hero Section',
  unknown: 'Direct/Unknown',
};

function getSourceLabel(source: string) {
  return SOURCE_LABEL_MAP[source] || source.charAt(0).toUpperCase() + source.slice(1);
}

function formatEventName(name: string) {
  const map: Record<string, string> = {
    brochure_modal_opened: 'Modal Opened',
    brochure_modal_closed: 'Modal Closed',
    lead_submit_started: 'Form Started',
    lead_submit_success: 'Form Submitted',
    lead_submit_failed: 'Submission Failed',
    lead_submit_blocked: 'Blocked (Spam)',
  };
  return map[name] || name.replace(/_/g, ' ');
}

function formatTimeAgo(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function BrochureAnalyticsCard({ authToken, days = 30 }: BrochureAnalyticsCardProps) {
  const [data, setData] = useState<BrochureAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!authToken) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/analytics/brochure?days=${days}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!res.ok) {
        throw new Error('Failed to load brochure analytics');
      }
      
      const payload = await res.json();
      setData(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [authToken, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10 col-span-2">
        <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10 col-span-2">
        <CardContent className="p-6">
          <div className="text-destructive font-medium">{error || 'No data available'}</div>
        </CardContent>
      </Card>
    );
  }

  const { totals, conversionRates, sources, timeseries, recentEvents } = data;

  // Prepare funnel data for visualization
  const funnelData = [
    { name: 'CTA Clicked', value: totals.ctaClicked, color: FUNNEL_COLORS.clicked },
    { name: 'Modal Opened', value: totals.modalOpened, color: FUNNEL_COLORS.opened },
    { name: 'Form Started', value: totals.submitStarted, color: FUNNEL_COLORS.submitted },
    { name: 'Success', value: totals.submitSuccess, color: FUNNEL_COLORS.success },
  ];

  // Prepare sources data
  const sourcesData = Object.entries(sources)
    .map(([source, stats]) => ({
      source: getSourceLabel(source),
      opened: stats.opened,
      submitted: stats.submitted,
      success: stats.success,
      conversionRate: stats.opened > 0 ? Math.round((stats.success / stats.opened) * 100) : 0,
    }))
    .sort((a, b) => b.opened - a.opened)
    .slice(0, 5);

  // Prepare timeseries with labels
  const timeseriesWithLabels = timeseries.map((d) => ({
    ...d,
    label: toTick(d.day),
  }));

  return (
    <div className="col-span-2 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileDown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Brochure Download Funnel</h2>
              <p className="text-sm text-muted-foreground">Track user journey from CTA click to successful download</p>
            </div>
          </div>

          {/* Funnel Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-background/50 rounded-xl p-4 border border-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="w-4 h-4 text-[#7389F4]" />
                <span className="text-xs text-muted-foreground font-medium">CTA Clicked</span>
              </div>
              <div className="text-2xl font-bold">{formatNumber(totals.ctaClicked)}</div>
            </div>
            
            <div className="bg-background/50 rounded-xl p-4 border border-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <FileDown className="w-4 h-4 text-[#001640]" />
                <span className="text-xs text-muted-foreground font-medium">Modal Opened</span>
              </div>
              <div className="text-2xl font-bold">{formatNumber(totals.modalOpened)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {conversionRates.clickToOpen}% of clicks
              </div>
            </div>
            
            <div className="bg-background/50 rounded-xl p-4 border border-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-4 h-4 text-[#34A853]" />
                <span className="text-xs text-muted-foreground font-medium">Form Started</span>
              </div>
              <div className="text-2xl font-bold">{formatNumber(totals.submitStarted)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {conversionRates.openToSubmit}% of opens
              </div>
            </div>
            
            <div className="bg-background/50 rounded-xl p-4 border border-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-xs text-muted-foreground font-medium">Success</span>
              </div>
              <div className="text-2xl font-bold">{formatNumber(totals.submitSuccess)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {conversionRates.submitToSuccess}% success rate
              </div>
            </div>
          </div>

          {/* Overall Conversion Rate */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 ${conversionRates.overallConversion > 10 ? 'text-green-500' : conversionRates.overallConversion > 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                {conversionRates.overallConversion > 10 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-medium">Overall Conversion Rate</div>
                <div className="text-xs text-muted-foreground">From CTA click to successful download</div>
              </div>
            </div>
            <div className="text-3xl font-bold">{conversionRates.overallConversion}%</div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="text-lg font-semibold">Conversion Funnel</div>
              <div className="text-sm text-muted-foreground">User journey breakdown</div>
            </div>
            
            <ChartContainer
              config={{
                value: { label: 'Count', color: CHART_COLORS.navy },
              }}
              className="h-[220px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ left: 0, right: 16, top: 10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(0, 22, 64, 0.1)" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: CHART_COLORS.navy, fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    width={90}
                    tick={{ fill: CHART_COLORS.navy, fontSize: 12 }}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: 'white' }} labelStyle={{ color: 'white' }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sources Breakdown */}
        <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="text-lg font-semibold">Source Performance</div>
              <div className="text-sm text-muted-foreground">Where brochure downloads originate</div>
            </div>
            
            {sourcesData.length > 0 ? (
              <div className="space-y-3">
                {sourcesData.map((s) => (
                  <div key={s.source} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-primary/5">
                    <div>
                      <div className="font-medium">{s.source}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.opened} opened · {s.success} converted
                      </div>
                    </div>
                    <div className={`text-sm font-bold px-2 py-1 rounded ${s.conversionRate > 20 ? 'bg-green-100 text-green-700' : s.conversionRate > 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {s.conversionRate}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No source data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeseries & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeseries Chart */}
        <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="text-lg font-semibold">Daily Trend</div>
              <div className="text-sm text-muted-foreground">Brochure activity over time</div>
            </div>
            
            {timeseriesWithLabels.length > 0 ? (
              <ChartContainer
                config={{
                  opened: { label: 'Opened', color: FUNNEL_COLORS.opened },
                  submitted: { label: 'Submitted', color: FUNNEL_COLORS.submitted },
                  success: { label: 'Success', color: FUNNEL_COLORS.success },
                }}
                className="h-[220px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeseriesWithLabels} margin={{ left: 0, right: 16, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="brochureOpened" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={FUNNEL_COLORS.opened} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={FUNNEL_COLORS.opened} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="brochureSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={FUNNEL_COLORS.success} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={FUNNEL_COLORS.success} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(0, 22, 64, 0.1)" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: CHART_COLORS.navy, fontSize: 11 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      width={30}
                      tick={{ fill: CHART_COLORS.navy, fontSize: 12 }}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: 'white' }} labelStyle={{ color: 'white' }} />
                    <Area 
                      type="monotone" 
                      dataKey="opened" 
                      stroke={FUNNEL_COLORS.opened} 
                      fill="url(#brochureOpened)" 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="success" 
                      stroke={FUNNEL_COLORS.success} 
                      fill="url(#brochureSuccess)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8 h-[220px] flex items-center justify-center">
                No timeseries data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="text-lg font-semibold">Recent Activity</div>
              <div className="text-sm text-muted-foreground">Latest brochure-related events</div>
            </div>
            
            {recentEvents.length > 0 ? (
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {recentEvents.slice(0, 10).map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-primary/5">
                    <div className="flex items-center gap-2">
                      {event.name === 'lead_submit_success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {event.name === 'lead_submit_failed' && <XCircle className="w-4 h-4 text-red-500" />}
                      {event.name === 'lead_submit_blocked' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {event.name.includes('modal') && <FileDown className="w-4 h-4 text-primary" />}
                      {event.name === 'lead_submit_started' && <UserPlus className="w-4 h-4 text-blue-500" />}
                      <span className="text-sm font-medium">{formatEventName(event.name)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 bg-primary/10 rounded">{getSourceLabel(event.source)}</span>
                      <span>{formatTimeAgo(event.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Failed & Blocked Stats */}
      {(totals.submitFailed > 0 || totals.submitBlocked > 0) && (
        <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="text-lg font-semibold">Issues & Spam Prevention</div>
              <div className="text-sm text-muted-foreground">Failed submissions and blocked attempts</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{formatNumber(totals.submitFailed)}</div>
                  <div className="text-sm text-red-600/80">Failed Submissions</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{formatNumber(totals.submitBlocked)}</div>
                  <div className="text-sm text-yellow-600/80">Blocked (Spam)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
