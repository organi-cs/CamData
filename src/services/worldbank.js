import { getCached, setCached } from './supabase';

const WB_BASE = 'https://api.worldbank.org/v2';
const COUNTRY = 'KHM'; // Cambodia ISO 3166-1 alpha-3

/**
 * World Bank indicator codes for Cambodia.
 * Full list: https://data.worldbank.org/indicator
 */
export const INDICATORS = {
  POPULATION:          'SP.POP.TOTL',       // Total population
  GDP_CURRENT_USD:     'NY.GDP.MKTP.CD',    // GDP (current US$)
  GDP_PER_CAPITA:      'NY.GDP.PCAP.CD',    // GDP per capita (current US$)
  GDP_GROWTH:          'NY.GDP.MKTP.KD.ZG', // GDP growth (annual %)
  POVERTY_RATE:        'SI.POV.NAHC',       // Poverty headcount ratio (national)
  INFLATION:           'FP.CPI.TOTL.ZG',    // Inflation, consumer prices (annual %)
  EXPORTS_GDP:         'NE.EXP.GNFS.ZS',    // Exports of goods and services (% of GDP)
  AGRICULTURE_GDP:     'NV.AGR.TOTL.ZS',    // Agriculture, forestry, fishing (% of GDP)
  TOURIST_ARRIVALS:    'ST.INT.ARVL',       // International tourism, number of arrivals
  INTERNET_USERS:      'IT.NET.USER.ZS',    // Individuals using the Internet (% of population)
  FOREST_AREA:         'AG.LND.FRST.ZS',    // Forest area (% of land area)
  CO2_EMISSIONS:       'EN.ATM.CO2E.PC',    // CO2 emissions (metric tons per capita)
  LIFE_EXPECTANCY:     'SP.DYN.LE00.IN',    // Life expectancy at birth
  LITERACY_RATE:       'SE.ADT.LITR.ZS',    // Literacy rate, adult total
  UNEMPLOYMENT:        'SL.UEM.TOTL.ZS',    // Unemployment, total (% of labor force)
  GARMENT_EXPORTS:     'TX.VAL.TRAN.ZS.WT', // Transport services (% of commercial service exports) — proxy
};

/**
 * Fetch a single indicator time series for Cambodia.
 * Returns an array of { year: number, value: number | null } sorted oldest→newest.
 * Caches in Supabase for 24 h so we don't hammer the free World Bank API.
 *
 * @param {string} indicatorCode  e.g. INDICATORS.POPULATION
 * @param {{ startYear?: number, endYear?: number }} options
 */
export async function fetchIndicator(indicatorCode, { startYear = 2000, endYear = 2024 } = {}) {
  const cacheKey = `wb:${COUNTRY}:${indicatorCode}:${startYear}-${endYear}`;

  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const url =
    `${WB_BASE}/country/${COUNTRY}/indicator/${indicatorCode}` +
    `?date=${startYear}:${endYear}&format=json&per_page=100`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`WB API ${res.status}`);
    const json = await res.json();

    // WB response: [ metadata, [ ...records ] ]
    const records = Array.isArray(json[1]) ? json[1] : [];
    const series = records
      .map(r => ({ year: parseInt(r.date, 10), value: r.value }))
      .filter(r => r.value !== null)
      .sort((a, b) => a.year - b.year);

    await setCached(cacheKey, series);
    return series;
  } catch (err) {
    console.error(`[worldbank] Failed to fetch ${indicatorCode}:`, err.message);
    return [];
  }
}

/**
 * Fetch the latest single value for an indicator.
 * Returns { value, year } or null.
 */
export async function fetchLatest(indicatorCode) {
  const series = await fetchIndicator(indicatorCode, { startYear: 2015, endYear: 2024 });
  if (!series.length) return null;
  return series[series.length - 1]; // most recent non-null
}

/**
 * Fetch multiple indicators in parallel.
 * Returns { [indicatorCode]: series[] }
 */
export async function fetchIndicators(indicatorCodes, options = {}) {
  const results = await Promise.all(
    indicatorCodes.map(code => fetchIndicator(code, options).then(s => [code, s]))
  );
  return Object.fromEntries(results);
}
