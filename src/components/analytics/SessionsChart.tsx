'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TimeseriesDataPoint, TOOLTIP_STYLE, CHART_COLORS, toFullDate } from './types';

interface SessionsChartProps {
  data: TimeseriesDataPoint[];
}

export default function SessionsChart({ data }: SessionsChartProps) {
  return (
    <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="text-lg font-semibold">Sessions Overview</div>
          <div className="text-sm text-muted-foreground">Total vs engaged sessions comparison</div>
        </div>

        <ChartContainer
          config={{
            sessions: { label: 'Sessions', color: CHART_COLORS.navy },
            engaged: { label: 'Engaged', color: CHART_COLORS.blue },
          }}
          className="h-[280px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 8, right: 16, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(0, 22, 64, 0.1)" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: CHART_COLORS.navy, fontSize: 12 }}
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
                labelFormatter={(label, payload) => {
                  const raw = payload?.[0]?.payload?.day;
                  return raw ? toFullDate(raw) : String(label);
                }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke={CHART_COLORS.navy}
                fill={CHART_COLORS.navy}
                fillOpacity={0.18}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="engagedSessions"
                stroke={CHART_COLORS.blue}
                fill={CHART_COLORS.blue}
                fillOpacity={0.12}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <ChartLegend
              items={[
                { key: 'sessions', label: 'Sessions', color: CHART_COLORS.navy },
                { key: 'engaged', label: 'Engaged sessions', color: CHART_COLORS.blue },
              ]}
            />
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
