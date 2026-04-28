import React, { useEffect, useMemo, useState } from 'react';
import { Wind, Droplets, Thermometer, Activity, RefreshCw } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';
import { getAQICategory } from '../services/airQualityApi';
import { getAirQualityOverview, normalizeFallbackAirQuality } from '../services/supabaseData';
import { RomduolIcon } from '../components/ui/RomduolIcon';
import '../styles/design-tokens.css';

function formatTime(timeStr) {
  if (!timeStr) return 'N/A';
  return new Date(timeStr).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AirQualityPage() {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sourceLabel, setSourceLabel] = useState('Supabase');
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [supabaseStations, weatherData] = await Promise.all([
          getAirQualityOverview(),
          api.getWeather(),
        ]);

        if (!active) return;

        if (weatherData && Array.isArray(weatherData)) {
          const phnomPenh = weatherData.find(
            (item) => item.city === 'Phnom Penh' || item.province_name_en === 'Phnom Penh',
          );
          setWeather(phnomPenh || weatherData[0] || null);
        }

        if (supabaseStations?.length) {
          setStations(supabaseStations);
          setSelectedStationId(supabaseStations[0].stationId);
          setSourceLabel('Supabase history');
          return;
        }

        const proxiedAirQuality = normalizeFallbackAirQuality(await api.getAirQuality());
        if (proxiedAirQuality?.length) {
          setStations(proxiedAirQuality);
          setSelectedStationId(proxiedAirQuality[0].stationId);
          setSourceLabel('MEF proxy fallback');
          return;
        }

        setError('No stored air quality readings are available yet.');
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load air quality data.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const selectedStation = useMemo(
    () => stations.find((station) => station.stationId === selectedStationId) || stations[0] || null,
    [selectedStationId, stations],
  );

  const pollutantCards = selectedStation?.pollutants
    ? Object.entries(selectedStation.pollutants).filter(([, value]) => value != null)
    : [];

  const fallbackWeather = weather
    ? {
        temperature: Number(weather.temperature ?? weather.temp ?? 0) || null,
        humidity: Number(weather.humidity ?? 0) || null,
        wind: Number(weather.wind_speed ?? weather.wind ?? 0) || null,
      }
    : null;

  const weatherSnapshot = selectedStation?.weather?.temperature != null || selectedStation?.weather?.humidity != null
    ? selectedStation.weather
    : fallbackWeather;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <RomduolIcon size={28} color="var(--accent-primary)" />
            <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Air Quality
            </h1>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            Cambodian station readings served from Supabase with a 24-hour trend
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <RefreshCw
              size={32}
              style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }}
            />
            <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Loading air quality data...</p>
          </div>
        ) : (
          <>
            {selectedStation && (
              <div
                style={{
                  background: `linear-gradient(135deg, ${selectedStation.color}22, ${selectedStation.color}11)`,
                  border: `2px solid ${selectedStation.color}`,
                  borderRadius: 20,
                  padding: 32,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 24,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
                      {selectedStation.stationName}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                      <span
                        style={{
                          fontSize: 72,
                          fontWeight: 800,
                          color: selectedStation.color,
                          lineHeight: 1,
                        }}
                      >
                        {selectedStation.aqi}
                      </span>
                      <div>
                        <p style={{ fontSize: 24, fontWeight: 600, color: selectedStation.color }}>
                          {selectedStation.emoji} {selectedStation.category}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                          Dominant pollutant: {selectedStation.dominantPollutant?.toUpperCase() || 'PM2.5'}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
                      Last updated: {formatTime(selectedStation.time)}
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      borderRadius: 16,
                      padding: 20,
                      minWidth: 220,
                    }}
                  >
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                      Snapshot source
                    </p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {sourceLabel}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
                      {stations.length} station{stations.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
              </div>
            )}

            {stations.length > 1 && (
              <div style={{ marginBottom: 24 }}>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 16,
                  }}
                >
                  Station snapshots
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 12,
                  }}
                >
                  {stations.map((station) => (
                    <button
                      key={station.stationId}
                      onClick={() => setSelectedStationId(station.stationId)}
                      style={{
                        textAlign: 'left',
                        background: station.stationId === selectedStationId
                          ? 'var(--accent-light)'
                          : 'var(--bg-primary)',
                        border: `1px solid ${station.stationId === selectedStationId
                          ? 'var(--accent-primary)'
                          : 'var(--border-light)'}`,
                        borderRadius: 14,
                        padding: 16,
                        cursor: 'pointer',
                      }}
                    >
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
                        {station.city}
                      </p>
                      <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                        {station.stationName}
                      </p>
                      <p style={{ fontSize: 28, fontWeight: 800, color: station.color, margin: 0 }}>
                        {station.aqi}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedStation?.trend?.length > 1 && (
              <div
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Activity size={18} color="var(--accent-primary)" />
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedStation.stationName} 24-hour AQI trend
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={selectedStation.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                    />
                    <Tooltip
                      formatter={(value) => [Number(value).toLocaleString(), 'AQI']}
                      contentStyle={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aqi"
                      stroke={selectedStation.color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 16,
                marginBottom: 24,
              }}
            >
              {pollutantCards.map(([key, value]) => {
                const category = getAQICategory(Number(value));
                return (
                  <div
                    key={key}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderLeft: `4px solid ${category.color}`,
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      {key}
                    </p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: category.color }}>
                      {value}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>ug/m3</p>
                  </div>
                );
              })}

              {weatherSnapshot && (
                <>
                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Thermometer size={16} color="var(--accent-primary)" />
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Temperature</p>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {weatherSnapshot.temperature != null ? `${weatherSnapshot.temperature} C` : 'N/A'}
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Droplets size={16} color="var(--accent-primary)" />
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Humidity</p>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {weatherSnapshot.humidity != null ? `${weatherSnapshot.humidity}%` : 'N/A'}
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Wind size={16} color="var(--accent-primary)" />
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Wind</p>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {weatherSnapshot.wind != null ? `${weatherSnapshot.wind} m/s` : 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 12,
                padding: 16,
                fontSize: 13,
                color: 'var(--text-muted)',
              }}
            >
              <strong>Data flow:</strong> WAQI snapshots are intended to be ingested by Supabase Edge Functions,
              then served from the <code>air_quality_readings</code> table to avoid browser-side third-party calls.
            </div>

            {!selectedStation && (
              <div
                style={{
                  background: 'var(--warning-bg)',
                  border: '1px solid var(--warning)',
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 16,
                }}
              >
                <p style={{ color: 'var(--warning)', fontSize: 14, margin: 0 }}>
                  {error || 'No station data is available yet.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
