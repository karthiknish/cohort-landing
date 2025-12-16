'use client';

import * as React from 'react';

type ChartConfig = Record<string, { label: string; color: string }>;

export function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
}) {
  const style = React.useMemo(() => {
    const cssVars: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
      cssVars[`--chart-${key}`] = value.color;
    }
    return cssVars as React.CSSProperties;
  }, [config]);

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export function ChartLegend({
  items,
}: {
  items: Array<{ key: string; label: string; color?: string }>; 
}) {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: item.color || `var(--chart-${item.key})` }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
