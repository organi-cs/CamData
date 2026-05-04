import React, { useEffect, useState } from 'react';
import { Thermometer, Wind, Droplets, CloudRain, RefreshCw, MapPin } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { fetchWeatherForecast, WEATHER_CITIES, describeWeatherCode } from '../services/weatherApi';
import { RomduolIcon } from '../components/ui/RomduolIcon';
import '../styles/design-tokens.css';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function StatCard({ icon, label, value, unit }) {
  return (
    <div
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-light)',
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        {icon}
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{label}</p>
      </div>
      <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
        {value != null ? `${value}${unit}` : '—'}
      </p>
    </div>
  );
}

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState(WEATHER_CITIES[0].id);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchWeatherForecast(selectedCity)
      .then((data) => {
        if (!active) return;
        if (data?.length) {
          setForecast(data);
        } else {
          setError('No forecast data available for this city.');
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [selectedCity]);

  const today = forecast?.[0] ?? null;
  const cityName = WEATHER_CITIES.find((c) => c.id === selectedCity)?.name ?? selectedCity;

  const chartData = (forecast ?? []).map((day) => ({
    date: formatDate(day.date),
    High: day.tempMax != null ? Math.round(day.tempMax) : null,
    Low: day.tempMin != null ? Math.round(day.tempMin) : null,
    Rain: day.precipitation != null ? Math.round(day.precipitation * 10) / 10 : null,
  }));

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <RomduolIcon size={28} color="var(--accent-primary)" />
            <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Weather
            </h1>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            7-day forecasts for Cambodian cities — powered by{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-primary)' }}
            >
              Open-Meteo
            </a>{' '}
            (ERA5 / GFS models, no API key)
          </p>
        </div>

        {/* City selector */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {WEATHER_CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: `1px solid ${city.id === selectedCity ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                  background: city.id === selectedCity ? 'var(--accent-light)' : 'transparent',
                  color: city.id === selectedCity ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: city.id === selectedCity ? 600 : 400,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {city.id === selectedCity && <MapPin size={12} />}
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <RefreshCw size={32} style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Loading forecast…</p>
          </div>
        ) : error ? (
          <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', borderRadius: 12, padding: 16 }}>
            <p style={{ color: 'var(--warning)', margin: 0 }}>{error}</p>
          </div>
        ) : (
          <>
            {/* Today hero */}
            {today && (
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--accent-light), var(--bg-secondary))',
                  border: '1px solid var(--border-light)',
                  borderRadius: 20,
                  padding: 32,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
                  <div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>
                      Today · {cityName}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      <span style={{ fontSize: 80, lineHeight: 1 }}>{today.weatherEmoji}</span>
                      <div>
                        <p style={{ fontSize: 48, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                          {today.tempMax != null ? `${Math.round(today.tempMax)}°C` : '—'}
                        </p>
                        <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginTop: 4 }}>
                          {today.weatherLabel}
                        </p>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>
                          Low {today.tempMin != null ? `${Math.round(today.tempMin)}°C` : '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, minWidth: 280 }}>
                    <StatCard
                      icon={<Droplets size={14} color="var(--accent-primary)" />}
                      label="Humidity"
                      value={today.humidityMax != null ? Math.round(today.humidityMax) : null}
                      unit="%"
                    />
                    <StatCard
                      icon={<CloudRain size={14} color="var(--accent-primary)" />}
                      label="Rainfall"
                      value={today.precipitation}
                      unit=" mm"
                    />
                    <StatCard
                      icon={<Wind size={14} color="var(--accent-primary)" />}
                      label="Wind max"
                      value={today.windspeed != null ? Math.round(today.windspeed) : null}
                      unit=" km/h"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7-day forecast row */}
            {forecast?.length > 1 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
                  7-day forecast
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                  {forecast.map((day) => (
                    <div
                      key={day.date}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 14,
                        padding: 16,
                        textAlign: 'center',
                      }}
                    >
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                        {formatDate(day.date)}
                      </p>
                      <p style={{ fontSize: 28, margin: '6px 0' }}>{day.weatherEmoji}</p>
                      <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {day.tempMax != null ? `${Math.round(day.tempMax)}°` : '—'}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {day.tempMin != null ? `${Math.round(day.tempMin)}°` : '—'}
                      </p>
                      {day.precipitation > 0 && (
                        <p style={{ fontSize: 11, color: '#60a5fa', marginTop: 4 }}>
                          {day.precipitation} mm
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Temperature chart */}
            {chartData.length > 0 && (
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
                  <Thermometer size={18} color="var(--accent-primary)" />
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Temperature range (°C)
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="°" width={40} />
                    <Tooltip
                      formatter={(value, name) => [`${value}°C`, name]}
                      contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
                    <Bar dataKey="High" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Low" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Attribution */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              <strong>Data sources:</strong> Weather forecasts from{' '}
              <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
                Open-Meteo
              </a>{' '}
              using ERA5 reanalysis (ECMWF) and GFS (NOAA) models. Free and open-access, no commercial use restrictions.
              Cached daily by Supabase Edge Functions.
            </div>
          </>
        )}
      </div>
      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
