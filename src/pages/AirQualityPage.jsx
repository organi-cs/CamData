import React, { useState, useEffect } from 'react';
import { Wind, Droplets, Thermometer, CloudRain } from 'lucide-react';
import { getAirQuality, getAQICategory, CAMBODIA_CITIES } from '../services/airQualityApi';
import { api } from '../services/api';
import { RomduolIcon } from '../components/ui/RomduolIcon';
import '../styles/design-tokens.css';

export default function AirQualityPage() {
  const [airData, setAirData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // Fetch from WAQI API
        const aqiData = await getAirQuality('phnom-penh');
        console.log('WAQI API Response:', aqiData);

        if (aqiData) {
          setAirData(aqiData);
        }

        // Also try MEF weather API
        const weatherData = await api.getWeather();
        if (weatherData && Array.isArray(weatherData)) {
          const pp = weatherData.find(w => w.city === 'Phnom Penh' || w.province_name_en === 'Phnom Penh');
          setWeather(pp || weatherData[0]);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    return new Date(timeStr).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <RomduolIcon size={28} color="var(--accent-primary)" />
            <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Air Quality
            </h1>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            Real-time air quality data from Phnom Penh • Powered by WAQI
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <RomduolIcon size={48} color="var(--accent-primary)" className="romduol-spin" />
            <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Loading air quality data...</p>
          </div>
        ) : (
          <>
            {/* Main AQI Card */}
            {airData && (
              <div style={{
                background: `linear-gradient(135deg, ${airData.color}22, ${airData.color}11)`,
                border: `2px solid ${airData.color}`,
                borderRadius: 20,
                padding: 32,
                marginBottom: 32,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
                  <div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
                      {airData.station?.name || 'Phnom Penh'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                      <span style={{ fontSize: 72, fontWeight: 800, color: airData.color, lineHeight: 1 }}>
                        {airData.aqi}
                      </span>
                      <div>
                        <p style={{ fontSize: 24, fontWeight: 600, color: airData.color }}>
                          {airData.emoji} {airData.category}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                          Dominant: {airData.dominantPollutant?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
                      Last updated: {formatTime(airData.time)}
                    </p>
                  </div>

                  {/* Weather from WAQI */}
                  {airData.weather?.temperature && (
                    <div style={{
                      background: 'var(--bg-primary)',
                      borderRadius: 16,
                      padding: 20,
                      minWidth: 160,
                    }}>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Weather</p>
                      <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {airData.weather.temperature}°C
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
                        Humidity: {airData.weather.humidity}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pollutants Grid */}
            {airData?.pollutants && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
                  Pollutant Levels
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                  {Object.entries(airData.pollutants).map(([key, value]) => {
                    if (value === null) return null;
                    const category = getAQICategory(value);
                    return (
                      <div key={key} style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 12,
                        padding: 16,
                        borderLeft: `4px solid ${category.color}`,
                      }}>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                          {key}
                        </p>
                        <p style={{ fontSize: 28, fontWeight: 700, color: category.color }}>
                          {value}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>µg/m³</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Data Source */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              padding: 16,
              fontSize: 13,
              color: 'var(--text-muted)',
            }}>
              <strong>Data Source:</strong> World Air Quality Index (WAQI) —
              <a href="https://aqicn.org/city/cambodia/phnom-penh/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-text)', marginLeft: 4 }}>
                aqicn.org
              </a>
            </div>

            {/* Error/Fallback Notice */}
            {!airData && (
              <div style={{
                background: 'var(--warning-bg)',
                border: '1px solid var(--warning)',
                borderRadius: 12,
                padding: 16,
                marginTop: 16,
              }}>
                <p style={{ color: 'var(--warning)', fontSize: 14 }}>
                  ⚠️ Unable to fetch live data. Please check your connection or try again later.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}