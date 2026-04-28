// src/services/api.js

// Detect if we are in production (Vercel) or development (Localhost)
const isProd = process.env.NODE_ENV === 'production';

// In Prod: use Vercel Rewrites -> /api/mef
// In Dev: use package.json proxy -> https://data.mef.gov.kh/api/v1
const BASE_URL = isProd ? '/api/mef' : ''; 

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!res.ok) {
      console.error(`API Error ${res.status}: ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    
    // DEBUG: Log the response so we can see the structure in the Console
    console.log(`Response for ${endpoint}:`, json);

    // Handle inconsistent API structures
    return json.data || json.items || json.results || json; 
  } catch (error) {
    console.error("Network/Parsing Error:", error);
    return null;
  }
}

export const api = {
  getExchangeRates: () => fetchData('/realtime-api/exchange-rate'),
  getAirQuality: () => fetchData('/realtime-api/air-quality'),
  getCSXIndex: () => fetchData('/realtime-api/csx-index'),
  getCSXSummary: () => fetchData('/realtime-api/csx-trade-summary'),
  getWeather: () => fetchData('/realtime-api/weather'),
  getProvinces: () => fetchData('/public-datasets/pd_66a8603700604c000123e144/json?page=1&page_size=30')
};