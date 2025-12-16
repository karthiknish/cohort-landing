'use client';

import { useEffect, useMemo, useState } from 'react';

function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat('en-US').format(n);
  } catch {
    return String(n);
  }
}

export default function TotalViews({ className }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch('/api/analytics/public', { cache: 'no-store' });
        const payload = (await res.json().catch(() => null)) as { pageViewsTotal?: number } | null;
        const next = typeof payload?.pageViewsTotal === 'number' ? payload.pageViewsTotal : 0;
        if (!cancelled) setCount(next);
      } catch {
        if (!cancelled) setCount(0);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const label = useMemo(() => {
    if (count === null) return '—';
    return formatNumber(count);
  }, [count]);

  return (
    <div className={className}>
      <div className="text-xs tracking-wide text-[#F8F8FF]/70">Total views</div>
      <div className="text-lg font-semibold text-[#F8F8FF]">{label}</div>
    </div>
  );
}
