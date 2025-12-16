'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatNumber, getSourceColor, TOOLTIP_STYLE } from './types';

interface TrafficSourcesChartProps {
  data: Array<{ source: string; sessions: number }>;
}

export default function TrafficSourcesChart({ data }: TrafficSourcesChartProps) {
  // Map colors per source
  const dataWithColors = data.map((s) => ({
    ...s,
    color: getSourceColor(s.source),
  }));

  return (
    <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="text-lg font-semibold">Traffic Sources</div>
          <div className="text-sm text-muted-foreground">Where your visitors come from</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <ChartContainer
            config={{
              sessions: { label: 'Sessions', color: '#001640' },
            }}
            className="h-[260px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  itemStyle={{ color: 'white' }}
                  labelStyle={{ color: 'white' }}
                  formatter={(value) => [formatNumber(Number(value)), 'Sessions']}
                />
                <Pie
                  data={dataWithColors}
                  dataKey="sessions"
                  nameKey="source"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {dataWithColors.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="space-y-2">
            {dataWithColors.map((s) => (
              <div key={s.source} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-muted-foreground truncate">{s.source}</span>
                </div>
                <span className="font-medium">{formatNumber(s.sessions)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
