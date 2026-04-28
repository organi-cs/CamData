// src/services/airQualityApi.js
/**
 * WAQI (World Air Quality Index) API Service
 * Provides real-time air quality data for Cambodia
 * 
 * Get your free API token at: https://aqicn.org/data-platform/token/
 */

// Use 'demo' token for testing, replace with real token for production
const WAQI_TOKEN = process.env.REACT_APP_WAQI_TOKEN || 'demo';
const BASE_URL = 'https://api.waqi.info';

/**
 * Cambodian cities with WAQI coverage
 */
export const CAMBODIA_CITIES = {
    'phnom-penh': { name: 'Phnom Penh', nameKm: 'ភ្នំពេញ' },
    'siem-reap': { name: 'Siem Reap', nameKm: 'សៀមរាប' },
};

/**
 * Get AQI category based on value
 */
export function getAQICategory(aqi) {
    if (aqi <= 50) return { level: 'Good', color: '#10B981', emoji: '🟢' };
    if (aqi <= 100) return { level: 'Moderate', color: '#F59E0B', emoji: '🟡' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: '#F97316', emoji: '🟠' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#EF4444', emoji: '🔴' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#7C3AED', emoji: '🟣' };
    return { level: 'Hazardous', color: '#991B1B', emoji: '🟤' };
}

/**
 * Fetch air quality data for a Cambodian city
 * @param {string} city - City slug (e.g., 'phnom-penh', 'siem-reap')
 * @returns {Promise<Object|null>} Air quality data or null on error
 */
export async function getAirQuality(city = 'phnom-penh') {
    const url = `${BASE_URL}/feed/${city}/?token=${WAQI_TOKEN}`;

    try {
        const res = await fetch(url);
        const json = await res.json();

        if (json.status === 'ok' && json.data) {
            const { data } = json;
            const category = getAQICategory(data.aqi);

            return {
                aqi: data.aqi,
                category: category.level,
                color: category.color,
                emoji: category.emoji,
                dominantPollutant: data.dominentpol || 'pm25',
                pollutants: {
                    pm25: data.iaqi?.pm25?.v || null,
                    pm10: data.iaqi?.pm10?.v || null,
                    o3: data.iaqi?.o3?.v || null,
                    no2: data.iaqi?.no2?.v || null,
                    so2: data.iaqi?.so2?.v || null,
                    co: data.iaqi?.co?.v || null,
                },
                weather: {
                    temperature: data.iaqi?.t?.v || null,
                    humidity: data.iaqi?.h?.v || null,
                    wind: data.iaqi?.w?.v || null,
                    pressure: data.iaqi?.p?.v || null,
                },
                station: {
                    name: data.city?.name || city,
                    geo: data.city?.geo || null,
                    url: data.city?.url || null,
                },
                time: data.time?.s || new Date().toISOString(),
                attribution: data.attributions || [],
            };
        }

        console.warn('WAQI API returned error status:', json.status);
        return null;
    } catch (error) {
        console.error('WAQI API Error:', error);
        return null;
    }
}

/**
 * Fetch air quality for all Cambodian cities
 * @returns {Promise<Object>} Map of city -> air quality data
 */
export async function getAllCambodiaAirQuality() {
    const results = {};

    for (const city of Object.keys(CAMBODIA_CITIES)) {
        results[city] = await getAirQuality(city);
    }

    return results;
}

export default {
    getAirQuality,
    getAllCambodiaAirQuality,
    getAQICategory,
    CAMBODIA_CITIES,
};
