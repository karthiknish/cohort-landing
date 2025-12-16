'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TimeseriesDataPoint, TOOLTIP_STYLE, CHART_COLORS, toFullDate } from './types';

interface ViewsUsersChartProps {
  data: TimeseriesDataPoint[];
}

export default function ViewsUsersChart({ data }: ViewsUsersChartProps) {
  return (
    <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="text-lg font-semibold">Views & Users</div>
          <div className="text-sm text-muted-foreground">Daily page views and active users trend</div>
        </div>

        <ChartContainer
          config={{
            views: { label: 'Views', color: CHART_COLORS.navy },
            users: { label: 'Users', color: CHART_COLORS.blue },
          }}
          className="h-[280px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 8, right: 16, top: 10, bottom: 0 }}>
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
              <Line
                type="monotone"
                dataKey="views"
                stroke={CHART_COLORS.navy}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke={CHART_COLORS.blue}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <ChartLegend
              items={[
                { key: 'views', label: 'Views', color: CHART_COLORS.navy },
                { key: 'users', label: 'Users', color: CHART_COLORS.blue },
              ]}
            />
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
