'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Users, RefreshCw } from 'lucide-react';
import { formatNumber, CHART_COLORS } from './types';

// Country coordinates (lat, lng)
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  // By ISO code
  US: { lat: 37.0902, lng: -95.7129 },
  CA: { lat: 56.1304, lng: -106.3468 },
  MX: { lat: 23.6345, lng: -102.5528 },
  BR: { lat: -14.235, lng: -51.9253 },
  AR: { lat: -38.4161, lng: -63.6167 },
  GB: { lat: 55.3781, lng: -3.436 },
  FR: { lat: 46.2276, lng: 2.2137 },
  DE: { lat: 51.1657, lng: 10.4515 },
  IT: { lat: 41.8719, lng: 12.5674 },
  ES: { lat: 40.4637, lng: -3.7492 },
  PT: { lat: 39.3999, lng: -8.2245 },
  NL: { lat: 52.1326, lng: 5.2913 },
  BE: { lat: 50.5039, lng: 4.4699 },
  CH: { lat: 46.8182, lng: 8.2275 },
  AT: { lat: 47.5162, lng: 14.5501 },
  PL: { lat: 51.9194, lng: 19.1451 },
  SE: { lat: 60.1282, lng: 18.6435 },
  NO: { lat: 60.472, lng: 8.4689 },
  FI: { lat: 61.9241, lng: 25.7482 },
  DK: { lat: 56.2639, lng: 9.5018 },
  IE: { lat: 53.1424, lng: -7.6921 },
  RU: { lat: 61.524, lng: 105.3188 },
  UA: { lat: 48.3794, lng: 31.1656 },
  TR: { lat: 38.9637, lng: 35.2433 },
  IN: { lat: 20.5937, lng: 78.9629 },
  CN: { lat: 35.8617, lng: 104.1954 },
  JP: { lat: 36.2048, lng: 138.2529 },
  KR: { lat: 35.9078, lng: 127.7669 },
  AU: { lat: -25.2744, lng: 133.7751 },
  NZ: { lat: -40.9006, lng: 174.886 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  EG: { lat: 26.8206, lng: 30.8025 },
  NG: { lat: 9.082, lng: 8.6753 },
  KE: { lat: -0.0236, lng: 37.9062 },
  AE: { lat: 23.4241, lng: 53.8478 },
  SA: { lat: 23.8859, lng: 45.0792 },
  IL: { lat: 31.0461, lng: 34.8516 },
  SG: { lat: 1.3521, lng: 103.8198 },
  MY: { lat: 4.2105, lng: 101.9758 },
  ID: { lat: -0.7893, lng: 113.9213 },
  TH: { lat: 15.87, lng: 100.9925 },
  VN: { lat: 14.0583, lng: 108.2772 },
  PH: { lat: 12.8797, lng: 121.774 },
  PK: { lat: 30.3753, lng: 69.3451 },
  BD: { lat: 23.685, lng: 90.3563 },
  CL: { lat: -35.6751, lng: -71.543 },
  CO: { lat: 4.5709, lng: -74.2973 },
  PE: { lat: -9.19, lng: -75.0152 },
  VE: { lat: 6.4238, lng: -66.5897 },
  GR: { lat: 39.0742, lng: 21.8243 },
  CZ: { lat: 49.8175, lng: 15.473 },
  RO: { lat: 45.9432, lng: 24.9668 },
  HU: { lat: 47.1625, lng: 19.5033 },
  TW: { lat: 23.6978, lng: 120.9605 },
  HK: { lat: 22.3193, lng: 114.1694 },
  // By country name
  'United States': { lat: 37.0902, lng: -95.7129 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
  'Brazil': { lat: -14.235, lng: -51.9253 },
  'Argentina': { lat: -38.4161, lng: -63.6167 },
  'United Kingdom': { lat: 55.3781, lng: -3.436 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'Italy': { lat: 41.8719, lng: 12.5674 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Portugal': { lat: 39.3999, lng: -8.2245 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Belgium': { lat: 50.5039, lng: 4.4699 },
  'Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Austria': { lat: 47.5162, lng: 14.5501 },
  'Poland': { lat: 51.9194, lng: 19.1451 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'Norway': { lat: 60.472, lng: 8.4689 },
  'Finland': { lat: 61.9241, lng: 25.7482 },
  'Denmark': { lat: 56.2639, lng: 9.5018 },
  'Ireland': { lat: 53.1424, lng: -7.6921 },
  'Russia': { lat: 61.524, lng: 105.3188 },
  'Ukraine': { lat: 48.3794, lng: 31.1656 },
  'Turkey': { lat: 38.9637, lng: 35.2433 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'New Zealand': { lat: -40.9006, lng: 174.886 },
  'South Africa': { lat: -30.5595, lng: 22.9375 },
  'Egypt': { lat: 26.8206, lng: 30.8025 },
  'Nigeria': { lat: 9.082, lng: 8.6753 },
  'Kenya': { lat: -0.0236, lng: 37.9062 },
  'United Arab Emirates': { lat: 23.4241, lng: 53.8478 },
  'Saudi Arabia': { lat: 23.8859, lng: 45.0792 },
  'Israel': { lat: 31.0461, lng: 34.8516 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Malaysia': { lat: 4.2105, lng: 101.9758 },
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'Thailand': { lat: 15.87, lng: 100.9925 },
  'Vietnam': { lat: 14.0583, lng: 108.2772 },
  'Philippines': { lat: 12.8797, lng: 121.774 },
  'Pakistan': { lat: 30.3753, lng: 69.3451 },
  'Bangladesh': { lat: 23.685, lng: 90.3563 },
  'Chile': { lat: -35.6751, lng: -71.543 },
  'Colombia': { lat: 4.5709, lng: -74.2973 },
  'Peru': { lat: -9.19, lng: -75.0152 },
  'Venezuela': { lat: 6.4238, lng: -66.5897 },
  'Greece': { lat: 39.0742, lng: 21.8243 },
  'Czech Republic': { lat: 49.8175, lng: 15.473 },
  'Czechia': { lat: 49.8175, lng: 15.473 },
  'Romania': { lat: 45.9432, lng: 24.9668 },
  'Hungary': { lat: 47.1625, lng: 19.5033 },
  'Taiwan': { lat: 23.6978, lng: 120.9605 },
  'Hong Kong': { lat: 22.3193, lng: 114.1694 },
};

interface RealtimeData {
  totalActiveUsers: number;
  countries: Array<{ country: string; countryCode: string; activeUsers: number }>;
  pages: Array<{ page: string; activeUsers: number }>;
  sources: Array<{ source: string; activeUsers: number }>;
  timestamp: string;
}

interface RealtimeMapChartProps {
  authToken: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 20, lng: 0 };

// Dark mode map styles matching the theme
const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1628' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1a2744' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#2d3748' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0d1f3c' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0d1f3c' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#0d2818' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#001640' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d5a80' }] },
];

export default function RealtimeMapChart({ authToken }: RealtimeMapChartProps) {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{
    country: string;
    activeUsers: number;
    position: { lat: number; lng: number };
  } | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const fetchRealtime = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/ga4/realtime', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Failed to load realtime data');
      }

      const payload = (await res.json()) as RealtimeData;
      setData(payload);
      setLastUpdate(new Date());
      setError('');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load realtime data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, [fetchRealtime]);

  const markers = useMemo(() => {
    if (!data?.countries) return [];
    return data.countries
      .map((country) => {
        const coords = COUNTRY_COORDS[country.countryCode] || COUNTRY_COORDS[country.country];
        if (!coords) return null;
        return { ...country, position: coords };
      })
      .filter(Boolean) as Array<{
      country: string;
      countryCode: string;
      activeUsers: number;
      position: { lat: number; lng: number };
    }>;
  }, [data?.countries]);

  const maxUsers = useMemo(() => {
    return markers.reduce((max, m) => Math.max(max, m.activeUsers), 1);
  }, [markers]);

  const getMarkerScale = useCallback(
    (users: number) => {
      const minScale = 0.8;
      const maxScale = 2.5;
      return minScale + (users / maxUsers) * (maxScale - minScale);
    },
    [maxUsers]
  );

  const mapOptions = useMemo(
    () => ({
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true,
      minZoom: 2,
      maxZoom: 8,
      backgroundColor: '#001640',
    }),
    []
  );

  if (loadError) {
    return (
      <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
        <CardContent className="p-6">
          <div className="text-destructive">
            Failed to load Google Maps. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-secondary/60 to-secondary/30 border-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Globe className="w-5 h-5 text-primary" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-lg font-semibold">Realtime</div>
            </div>
            <div className="text-sm text-muted-foreground">Active visitors right now</div>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchRealtime}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        {error ? (
          <div className="text-destructive text-sm">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Google Maps */}
            <div className="lg:col-span-2">
              <div className="relative rounded-xl overflow-hidden" style={{ height: '360px' }}>
                {!isLoaded ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                    <div className="animate-pulse text-muted-foreground">Loading map...</div>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={2}
                    options={mapOptions}
                    onClick={() => setSelectedCountry(null)}
                  >
                    {markers.map((marker) => (
                      <MarkerF
                        key={marker.countryCode || marker.country}
                        position={marker.position}
                        onClick={() => setSelectedCountry(marker)}
                        icon={{
                          path: google.maps.SymbolPath.CIRCLE,
                          scale: getMarkerScale(marker.activeUsers) * 8,
                          fillColor: CHART_COLORS.blue,
                          fillOpacity: 0.8,
                          strokeColor: '#ffffff',
                          strokeWeight: 2,
                        }}
                      />
                    ))}
                    {selectedCountry && (
                      <InfoWindowF
                        position={selectedCountry.position}
                        onCloseClick={() => setSelectedCountry(null)}
                      >
                        <div className="p-2 text-primary">
                          <div className="font-semibold">{selectedCountry.country}</div>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3" />
                            {selectedCountry.activeUsers} active
                          </div>
                        </div>
                      </InfoWindowF>
                    )}
                  </GoogleMap>
                )}

                {/* Active users badge */}
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-lg z-10">
                  <div className="text-2xl font-bold">
                    {formatNumber(data?.totalActiveUsers || 0)}
                  </div>
                  <div className="text-xs opacity-80">Active now</div>
                </div>
              </div>
            </div>

            {/* Side panels */}
            <div className="space-y-4">
              {/* Top countries */}
              <div className="bg-primary/5 rounded-xl p-4">
                <div className="text-sm font-medium mb-3">Top Countries</div>
                <div className="space-y-2">
                  {data?.countries.slice(0, 5).map((country) => (
                    <div
                      key={country.countryCode || country.country}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground truncate">{country.country}</span>
                      <span className="font-medium">{country.activeUsers}</span>
                    </div>
                  ))}
                  {(!data?.countries || data.countries.length === 0) && (
                    <div className="text-sm text-muted-foreground">No active visitors</div>
                  )}
                </div>
              </div>

              {/* Active pages */}
              <div className="bg-primary/5 rounded-xl p-4">
                <div className="text-sm font-medium mb-3">Active Pages</div>
                <div className="space-y-2">
                  {data?.pages.slice(0, 5).map((page) => (
                    <div key={page.page} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate pr-2">{page.page}</span>
                      <span className="font-medium">{page.activeUsers}</span>
                    </div>
                  ))}
                  {(!data?.pages || data.pages.length === 0) && (
                    <div className="text-sm text-muted-foreground">No active pages</div>
                  )}
                </div>
              </div>

              {/* Devices */}
              <div className="bg-primary/5 rounded-xl p-4">
                <div className="text-sm font-medium mb-3">Devices</div>
                <div className="space-y-2">
                  {data?.sources.slice(0, 3).map((source) => (
                    <div key={source.source} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{source.source}</span>
                      <span className="font-medium">{source.activeUsers}</span>
                    </div>
                  ))}
                  {(!data?.sources || data.sources.length === 0) && (
                    <div className="text-sm text-muted-foreground">No device data</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
