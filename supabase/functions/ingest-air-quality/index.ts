import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import { AIR_QUALITY_STATIONS } from '../_shared/airQualityStations.ts';
import { handleOptions, jsonResponse } from '../_shared/http.ts';

function parseNumber(value: unknown) {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeRecordedAt(rawTime: { iso?: string; s?: string } | undefined) {
  if (rawTime?.iso) return new Date(rawTime.iso).toISOString();
  if (rawTime?.s) return new Date(rawTime.s).toISOString();
  return new Date().toISOString();
}

Deno.serve(async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  try {
    const token = Deno.env.get('WAQI_TOKEN');
    if (!token) {
      throw new Error('WAQI_TOKEN must be set for the ingest-air-quality function.');
    }

    const fetchedAt = new Date().toISOString();
    const results = await Promise.allSettled(
      AIR_QUALITY_STATIONS.map(async (station) => {
        const response = await fetch(`https://api.waqi.info/feed/${station.feedPath}/?token=${token}`);
        if (!response.ok) {
          throw new Error(`${station.id} returned ${response.status}`);
        }

        const payload = await response.json();
        if (payload.status !== 'ok' || !payload.data) {
          throw new Error(`${station.id} returned WAQI status ${payload.status}`);
        }

        const data = payload.data;
        const [latitude, longitude] = Array.isArray(data.city?.geo) ? data.city.geo : [null, null];

        return {
          station_id: station.id,
          station_name: data.city?.name || station.stationName,
          city: station.city,
          aqi: parseNumber(data.aqi),
          pm25: parseNumber(data.iaqi?.pm25?.v),
          pm10: parseNumber(data.iaqi?.pm10?.v),
          dominant_pollutant: data.dominentpol || 'pm25',
          temperature_c: parseNumber(data.iaqi?.t?.v),
          humidity_pct: parseNumber(data.iaqi?.h?.v),
          wind_m_s: parseNumber(data.iaqi?.w?.v),
          latitude: parseNumber(latitude),
          longitude: parseNumber(longitude),
          source_url: data.city?.url || null,
          recorded_at: normalizeRecordedAt(data.time),
          fetched_at: fetchedAt,
        };
      }),
    );

    const records = results
      .filter((result): result is PromiseFulfilledResult<Record<string, unknown>> => result.status === 'fulfilled')
      .map((result) => result.value);

    if (!records.length) {
      const firstFailure = results.find((result) => result.status === 'rejected');
      throw new Error(firstFailure?.reason?.message || 'No air quality stations were ingested.');
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('air_quality_readings')
      .upsert(records, { onConflict: 'station_id,recorded_at' });

    if (error) throw error;

    return jsonResponse({
      ok: true,
      ingested: records.length,
      failed: results.length - records.length,
      fetched_at: fetchedAt,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
});
