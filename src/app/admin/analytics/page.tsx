'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/components/AdminAuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Loader2, LogOut, Calendar } from 'lucide-react';

import {
  StatsCards,
  ViewsUsersChart,
  SessionsChart,
  TrafficSourcesChart,
  TopEventsChart,
  DevicesChart,
  RealtimeMapChart,
  Ga4OverviewResponse,
  toTick,
} from '@/components/analytics';

export default function AnalyticsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [overview, setOverview] = useState<Ga4OverviewResponse | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | 'custom'>(30);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);

  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  // Keep auth token fresh for realtime component
  useEffect(() => {
    if (user) {
      user.getIdToken().then(setAuthToken);
    }
  }, [user]);

  const fetchAnalytics = useCallback(async (days: number | 'custom', range?: DateRange) => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const token = await user.getIdToken();
      
      let url = '/api/analytics/ga4/overview';
      if (days === 'custom' && range?.from && range?.to) {
        const startDate = format(range.from, 'yyyy-MM-dd');
        const endDate = format(range.to, 'yyyy-MM-dd');
        url += `?startDate=${startDate}&endDate=${endDate}`;
      } else if (typeof days === 'number') {
        url += `?days=${days}`;
      }
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Failed to load GA4 analytics');
      }

      const payload = (await res.json()) as Ga4OverviewResponse;
      setOverview(payload);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load GA4 analytics';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAnalytics(selectedDays, customRange);
    }
  }, [user, selectedDays, customRange, fetchAnalytics]);

  const handleSelectPreset = (days: number) => {
    setSelectedDays(days);
    setCustomRange(undefined);
  };

  const handleSelectCustomRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setCustomRange(range);
      setSelectedDays('custom');
    }
  };

  // Computed stats
  const stats = useMemo(() => {
    let days: number;
    if (selectedDays === 'custom' && customRange?.from && customRange?.to) {
      days = differenceInDays(customRange.to, customRange.from) + 1;
    } else if (typeof selectedDays === 'number') {
      days = selectedDays;
    } else {
      days = overview?.windowDays || 30;
    }
    
    const views = overview?.totals?.views || 0;
    const users = overview?.totals?.users || 0;
    const sessions = overview?.totals?.sessions || 0;
    const engagedSessions = overview?.totals?.engagedSessions || 0;
    const engagementRate = sessions ? Math.round((engagedSessions / sessions) * 100) : 0;

    return { days, views, users, sessions, engagedSessions, engagementRate };
  }, [overview, selectedDays, customRange]);

  // Timeseries with labels
  const dailySeries = useMemo(() => {
    return (overview?.timeseries || []).map((d) => ({ ...d, label: toTick(d.day) }));
  }, [overview]);

  const topSources = useMemo(() => overview?.topSources || [], [overview]);
  const topEvents = useMemo(() => overview?.topEvents || [], [overview]);
  const devices = useMemo(() => overview?.devices || [], [overview]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-primary/10 bg-card">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-black tracking-widest text-primary">
            COHORT
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-semibold">Analytics</h1>
          <span className="text-muted-foreground">·</span>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link
            href="/admin/leads"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Leads
          </Link>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Date Range Selector */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Date Range</span>
          </div>
          <DateRangePicker
            selectedDays={selectedDays}
            customRange={customRange}
            onSelectPreset={handleSelectPreset}
            onSelectCustomRange={handleSelectCustomRange}
            disabled={loading}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[260px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
            <CardContent className="p-6">
              <div className="text-destructive font-medium">{error}</div>
              <div className="text-muted-foreground text-sm mt-2">
                GA4 tip: add your service account email to GA4 Admin → Property access management.
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Realtime Map Section */}
            {authToken && <RealtimeMapChart authToken={authToken} />}

            {/* Stats Cards */}
            <StatsCards
              days={stats.days}
              views={stats.views}
              users={stats.users}
              sessions={stats.sessions}
              engagedSessions={stats.engagedSessions}
              engagementRate={stats.engagementRate}
            />

            {/* Views/Users + Sessions Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ViewsUsersChart data={dailySeries} />
              <SessionsChart data={dailySeries} />
            </div>

            {/* Traffic Sources + Top Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficSourcesChart data={topSources} />
              <TopEventsChart data={topEvents} />
            </div>

            {/* Devices (full width) */}
            <DevicesChart data={devices} />
          </>
        )}
      </main>
    </div>
  );
}
