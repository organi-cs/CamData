import { supabase } from './supabase';
import { getAQICategory } from './airQualityApi';
import { AIR_QUALITY_STATIONS } from '../data/airQualityStations';
import { DATASET_CATALOG, normalizeDatasetRow } from '../data/datasetCatalog';

function parseNumber(value) {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatTrendLabel(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export async function getLatestExchangeRates() {
  if (!supabase) return null;

  const { data: latestRows, error: latestError } = await supabase
    .from('exchange_rates')
    .select('date')
    .order('date', { ascending: false })
    .limit(1);

  if (latestError || !latestRows?.length) return null;

  const latestDate = latestRows[0].date;
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('date, currency_id, currency, bid, ask, average, fetched_at')
    .eq('date', latestDate)
    .order('currency_id', { ascending: true });

  if (error) return null;
  return data || [];
}

export async function getExchangeRateHistory(currencyId, days = 365) {
  if (!supabase) return null;

  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - (days - 1));

  const { data, error } = await supabase
    .from('exchange_rates')
    .select('date, average')
    .eq('currency_id', currencyId)
    .gte('date', cutoff.toISOString().slice(0, 10))
    .order('date', { ascending: true });

  if (error) return null;
  return data || [];
}

export async function getDatasetCatalog() {
  if (!supabase) return DATASET_CATALOG;

  const { data, error } = await supabase
    .from('mef_datasets')
    .select('*')
    .order('title', { ascending: true });

  if (error || !data?.length) return DATASET_CATALOG;
  return data.map(normalizeDatasetRow);
}

function mapAirQualityStation(entries) {
  const latest = entries[0];
  const category = getAQICategory(Number(latest.aqi ?? 0));

  return {
    stationId: latest.station_id,
    stationName: latest.station_name,
    city: latest.city,
    aqi: parseNumber(latest.aqi),
    pm25: parseNumber(latest.pm25),
    pm10: parseNumber(latest.pm10),
    dominantPollutant: latest.dominant_pollutant || 'pm25',
    weather: {
      temperature: parseNumber(latest.temperature_c),
      humidity: parseNumber(latest.humidity_pct),
      wind: parseNumber(latest.wind_m_s),
    },
    category: category.level,
    color: category.color,
    emoji: category.emoji,
    time: latest.recorded_at,
    station: {
      name: latest.station_name,
      geo: latest.latitude != null && latest.longitude != null
        ? [latest.latitude, latest.longitude]
        : null,
      url: latest.source_url || null,
    },
    pollutants: {
      pm25: parseNumber(latest.pm25),
      pm10: parseNumber(latest.pm10),
    },
    trend: [...entries]
      .reverse()
      .map((entry) => ({
        label: formatTrendLabel(entry.recorded_at),
        recordedAt: entry.recorded_at,
        aqi: parseNumber(entry.aqi),
        pm25: parseNumber(entry.pm25),
        pm10: parseNumber(entry.pm10),
      })),
  };
}

export async function getAirQualityOverview(hours = 24) {
  if (!supabase) return null;

  const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000)).toISOString();
  const { data, error } = await supabase
    .from('air_quality_readings')
    .select('*')
    .gte('recorded_at', cutoff)
    .order('recorded_at', { ascending: false });

  if (error || !data?.length) return null;

  const grouped = new Map();
  data.forEach((row) => {
    if (!grouped.has(row.station_id)) {
      grouped.set(row.station_id, []);
    }
    grouped.get(row.station_id).push(row);
  });

  const order = new Map(AIR_QUALITY_STATIONS.map((station, index) => [station.id, index]));
  return [...grouped.values()]
    .map(mapAirQualityStation)
    .sort((left, right) => (order.get(left.stationId) ?? 999) - (order.get(right.stationId) ?? 999));
}

export function normalizeFallbackAirQuality(payload) {
  const item = Array.isArray(payload) ? payload[0] : payload;
  const aqi = parseNumber(item?.aqi ?? item?.AQI ?? item?.index ?? item?.value);

  if (!item || aqi == null) return null;

  const category = getAQICategory(aqi);
  const recordedAt = item.recorded_at || item.time?.s || item.time || new Date().toISOString();

  return [{
    stationId: item.station_id || item.station || 'phnom-penh',
    stationName: item.station_name || item.station || 'Phnom Penh',
    city: item.city || 'Phnom Penh',
    aqi,
    pm25: parseNumber(item.pm25 ?? item.pm_25 ?? item?.iaqi?.pm25?.v),
    pm10: parseNumber(item.pm10 ?? item.pm_10 ?? item?.iaqi?.pm10?.v),
    dominantPollutant: item.dominant_pollutant || item.dominentpol || 'pm25',
    weather: {
      temperature: parseNumber(item.temperature ?? item.temp ?? item?.iaqi?.t?.v),
      humidity: parseNumber(item.humidity ?? item?.iaqi?.h?.v),
      wind: parseNumber(item.wind ?? item?.iaqi?.w?.v),
    },
    category: category.level,
    color: category.color,
    emoji: category.emoji,
    time: recordedAt,
    station: {
      name: item.station_name || item.station || 'Phnom Penh',
      geo: null,
      url: null,
    },
    pollutants: {
      pm25: parseNumber(item.pm25 ?? item.pm_25 ?? item?.iaqi?.pm25?.v),
      pm10: parseNumber(item.pm10 ?? item.pm_10 ?? item?.iaqi?.pm10?.v),
    },
    trend: [],
  }];
}
