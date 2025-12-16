'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { formatNumber, CHART_COLORS } from './types';

type CountryData = {
  country: string;
  users: number;
  sessions: number;
};

type Props = {
  data: CountryData[];
};

// Country flag emoji mapping (ISO 3166-1 alpha-2 to flag)
const COUNTRY_FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  'India': '🇮🇳',
  'United Kingdom': '🇬🇧',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Brazil': '🇧🇷',
  'Japan': '🇯🇵',
  'China': '🇨🇳',
  'South Korea': '🇰🇷',
  'Mexico': '🇲🇽',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Netherlands': '🇳🇱',
  'Russia': '🇷🇺',
  'Indonesia': '🇮🇩',
  'Turkey': '🇹🇷',
  'Saudi Arabia': '🇸🇦',
  'United Arab Emirates': '🇦🇪',
  'Singapore': '🇸🇬',
  'Malaysia': '🇲🇾',
  'Philippines': '🇵🇭',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
  'Nigeria': '🇳🇬',
  'South Africa': '🇿🇦',
  'Egypt': '🇪🇬',
  'Kenya': '🇰🇪',
  'Argentina': '🇦🇷',
  'Colombia': '🇨🇴',
  'Chile': '🇨🇱',
  'Peru': '🇵🇪',
  'Poland': '🇵🇱',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'Belgium': '🇧🇪',
  'Austria': '🇦🇹',
  'Switzerland': '🇨🇭',
  'Ireland': '🇮🇪',
  'Portugal': '🇵🇹',
  'Greece': '🇬🇷',
  'Czech Republic': '🇨🇿',
  'Romania': '🇷🇴',
  'Hungary': '🇭🇺',
  'Israel': '🇮🇱',
  'New Zealand': '🇳🇿',
  '(not set)': '🌍',
};

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] || '🌍';
}

export default function CountriesChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="w-5 h-5" />
            Top Countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">No country data available</div>
        </CardContent>
      </Card>
    );
  }

  const totalUsers = data.reduce((sum, c) => sum + c.users, 0);
  const maxUsers = Math.max(...data.map((c) => c.users));

  return (
    <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="w-5 h-5" />
          Top Countries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, idx) => {
            const percentage = totalUsers > 0 ? ((item.users / totalUsers) * 100).toFixed(1) : '0';
            const barWidth = maxUsers > 0 ? (item.users / maxUsers) * 100 : 0;

            return (
              <div key={item.country} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFlag(item.country)}</span>
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {item.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {formatNumber(item.users)} users
                    </span>
                    <span
                      className="font-semibold min-w-[45px] text-right"
                      style={{ color: CHART_COLORS.blue }}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${CHART_COLORS.navy} 0%, ${CHART_COLORS.blue} 100%)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
