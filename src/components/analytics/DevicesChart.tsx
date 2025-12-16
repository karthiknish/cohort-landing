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
import { Smartphone, Monitor, Tablet } from 'lucide-react';

interface DevicesChartProps {
  data: Array<{ device: string; users: number }>;
}

const deviceIcons: Record<string, React.ReactNode> = {
  mobile: <Smartphone className="w-4 h-4" />,
  desktop: <Monitor className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
};

export default function DevicesChart({ data }: DevicesChartProps) {
  const total = data.reduce((sum, d) => sum + d.users, 0);

  return (
    <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="text-lg font-semibold">Devices</div>
          <div className="text-sm text-muted-foreground">Active users by device category</div>
        </div>

        <ChartContainer
          config={{
            users: { label: 'Users', color: CHART_COLORS.blue },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(0, 22, 64, 0.1)" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: CHART_COLORS.navy, fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="device"
                tickLine={false}
                axisLine={false}
                width={70}
                tick={{ fill: CHART_COLORS.navy, fontSize: 12 }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
              />
              <Bar dataKey="users" fill={CHART_COLORS.blue} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {data.map((d) => {
            const percentage = total > 0 ? Math.round((d.users / total) * 100) : 0;
            return (
              <div key={d.device} className="text-center">
                <div className="flex justify-center mb-1 text-muted-foreground">
                  {deviceIcons[d.device.toLowerCase()] || deviceIcons.desktop}
                </div>
                <div className="text-lg font-semibold text-primary">{percentage}%</div>
                <div className="text-xs text-muted-foreground capitalize">{d.device}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
