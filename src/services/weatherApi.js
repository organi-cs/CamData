import { supabase } from './supabase';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

export const WEATHER_CITIES = [
  { id: 'phnom-penh',    name: 'Phnom Penh',    latitude: 11.5564, longitude: 104.9282 },
  { id: 'siem-reap',     name: 'Siem Reap',     latitude: 13.3671, longitude: 103.8448 },
  { id: 'battambang',    name: 'Battambang',    latitude: 13.0957, longitude: 103.2022 },
  { id: 'sihanoukville', name: 'Sihanoukville', latitude: 10.6099, longitude: 103.5261 },
  { id: 'kampot',        name: 'Kampot',        latitude: 10.6099, longitude: 104.1814 },
  { id: 'kampong-cham',  name: 'Kampong Cham',  latitude: 11.9935, longitude: 105.4638 },
  { id: 'kampong-thom',  name: 'Kampong Thom',  latitude: 12.7113, longitude: 104.9041 },
  { id: 'kratie',        name: 'Kratie',        latitude: 12.4878, longitude: 106.0188 },
  { id: 'sen-monorom',   name: 'Sen Monorom',   latitude: 12.4626, longitude: 107.1880 },
  { id: 'banlung',       name: 'Banlung',       latitude: 13.7390, longitude: 106.9855 },
];

// WMO weather interpretation codes
// https://open-meteo.com/en/docs#weathervariables
const WMO_CODES = {
  0:  { label: 'Clear sky',              emoji: '☀️' },
  1:  { label: 'Mainly clear',           emoji: '🌤️' },
  2:  { label: 'Partly cloudy',          emoji: '⛅' },
  3:  { label: 'Overcast',               emoji: '☁️' },
  45: { label: 'Fog',                    emoji: '🌫️' },
  48: { label: 'Icy fog',                emoji: '🌫️' },
  51: { label: 'Light drizzle',          emoji: '🌦️' },
  53: { label: 'Drizzle',                emoji: '🌦️' },
  55: { label: 'Heavy drizzle',          emoji: '🌧️' },
  61: { label: 'Slight rain',            emoji: '🌧️' },
  63: { label: 'Moderate rain',          emoji: '🌧️' },
  65: { label: 'Heavy rain',             emoji: '🌧️' },
  80: { label: 'Slight rain showers',    emoji: '🌦️' },
  81: { label: 'Moderate rain showers',  emoji: '🌧️' },
  82: { label: 'Violent rain showers',   emoji: '⛈️' },
  95: { label: 'Thunderstorm',           emoji: '⛈️' },
  96: { label: 'Thunderstorm + hail',    emoji: '⛈️' },
  99: { label: 'Thunderstorm + hail',    emoji: '⛈️' },
};

export function describeWeatherCode(code) {
  if (code == null) return { label: 'Unknown', emoji: '🌡️' };
  return WMO_CODES[code] ?? WMO_CODES[Math.floor(code / 10) * 10] ?? { label: 'Unknown', emoji: '🌡️' };
}

function normalizeRow(row) {
  const wmo = describeWeatherCode(row.weather_code);
  return {
    date: row.forecast_date,
    tempMax: row.temp_max_c,
    tempMin: row.temp_min_c,
    precipitation: row.precipitation_mm,
    windspeed: row.windspeed_max_kmh,
    weatherCode: row.weather_code,
    weatherLabel: wmo.label,
    weatherEmoji: wmo.emoji,
    humidityMax: row.humidity_max_pct,
    humidityMin: row.humidity_min_pct,
  };
}

async function fetchLive(city) {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'windspeed_10m_max',
      'weathercode',
      'relative_humidity_2m_max',
      'relative_humidity_2m_min',
    ].join(','),
    timezone: 'Asia/Bangkok',
    forecast_days: '7',
  });

  const res = await fetch(`${OPEN_METEO_URL}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo returned ${res.status}`);
  const data = await res.json();
  const daily = data.daily;

  return daily.time.map((date, i) =>
    normalizeRow({
      forecast_date: date,
      temp_max_c: daily.temperature_2m_max[i],
      temp_min_c: daily.temperature_2m_min[i],
      precipitation_mm: daily.precipitation_sum[i],
      windspeed_max_kmh: daily.windspeed_10m_max[i],
      weather_code: daily.weathercode[i],
      humidity_max_pct: daily.relative_humidity_2m_max[i],
      humidity_min_pct: daily.relative_humidity_2m_min[i],
    }),
  );
}

export async function fetchWeatherForecast(cityId) {
  const city = WEATHER_CITIES.find((c) => c.id === cityId);
  if (!city) return null;

  if (supabase) {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('weather_forecasts')
      .select('forecast_date, temp_max_c, temp_min_c, precipitation_mm, windspeed_max_kmh, weather_code, humidity_max_pct, humidity_min_pct')
      .eq('city', cityId)
      .gte('forecast_date', today)
      .order('forecast_date', { ascending: true });

    if (!error && data?.length >= 3) {
      return data.map(normalizeRow);
    }
  }

  try {
    return await fetchLive(city);
  } catch (err) {
    console.error('[weatherApi] fetchWeatherForecast failed:', err.message);
    return null;
  }
}

export async function fetchAllCitiesWeather() {
  if (supabase) {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('weather_forecasts')
      .select('city, forecast_date, temp_max_c, temp_min_c, precipitation_mm, windspeed_max_kmh, weather_code, humidity_max_pct, humidity_min_pct')
      .eq('forecast_date', today);

    if (!error && data?.length) {
      return data.reduce((acc, row) => {
        acc[row.city] = normalizeRow(row);
        return acc;
      }, {});
    }
  }

  // Fall back to parallel live calls
  const results = await Promise.allSettled(
    WEATHER_CITIES.map((city) =>
      fetchLive(city).then((days) => [city.id, days?.[0] ?? null]),
    ),
  );

  return Object.fromEntries(
    results
      .filter((r) => r.status === 'fulfilled' && r.value[1] != null)
      .map((r) => r.value),
  );
}
