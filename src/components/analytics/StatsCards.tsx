'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from './types';

interface StatsCardsProps {
  days: number;
  views: number;
  users: number;
  sessions: number;
  engagedSessions: number;
  engagementRate: number;
}

export default function StatsCards({
  days,
  views,
  users,
  sessions,
  engagedSessions,
  engagementRate,
}: StatsCardsProps) {
  const stats = [
    { label: `Views (${days}d)`, value: formatNumber(views), delay: 0.08 },
    { label: 'Active users', value: formatNumber(users), delay: 0.16 },
    { label: 'Sessions', value: formatNumber(sessions), delay: 0.24 },
    { label: 'Engaged sessions', value: formatNumber(engagedSessions), delay: 0.32 },
    { label: 'Engagement rate', value: `${engagementRate}%`, delay: 0.4 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
        >
          <Card className="bg-gradient-to-br from-secondary/80 to-secondary/40 border-primary/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-extrabold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
