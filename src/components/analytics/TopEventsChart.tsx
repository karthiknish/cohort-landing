'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatNumber, TOOLTIP_STYLE, CHART_COLORS } from './types';

interface TopEventsChartProps {
  data: Array<{ name: string; count: number }>;
}

function prettyEventName(name: string) {
  const map: Record<string, string> = {
    page_view: 'Page view',
    session_start: 'Session start',
    first_visit: 'First visit',
    user_engagement: 'User engagement',
    scroll: 'Scroll',
    click: 'Click',
    form_start: 'Form start',
    form_submit: 'Form submit',
    cta_clicked: 'CTA clicked',
    brochure_modal_opened: 'Brochure opened',
    lead_submit_success: 'Lead submitted',
    external_link_clicked: 'External link',
  };
  return map[name] || name.replace(/_/g, ' ');
}

export default function TopEventsChart({ data }: TopEventsChartProps) {
  const formattedData = data.map((e) => ({
    ...e,
    displayName: prettyEventName(e.name),
  }));

  return (
    <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="text-lg font-semibold">Top Events</div>
          <div className="text-sm text-muted-foreground">Most triggered events in GA4</div>
        </div>

        <ChartContainer
          config={{
            count: { label: 'Count', color: CHART_COLORS.navy },
          }}
          className="h-[280px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ left: 8, right: 16, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(0, 22, 64, 0.1)" vertical={false} />
              <XAxis
                dataKey="displayName"
                tickLine={false}
                axisLine={false}
                hide
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                tick={{ fill: CHART_COLORS.navy, fontSize: 12 }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
              />
              <Bar dataKey="count" fill={CHART_COLORS.navy} radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 space-y-2">
          {formattedData.map((e) => (
            <div key={e.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate pr-3">{e.displayName}</span>
              <span className="font-medium">{formatNumber(e.count)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
