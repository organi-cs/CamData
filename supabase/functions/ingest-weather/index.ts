import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import { CAMBODIA_CITIES } from '../_shared/cambodiaCoords.ts';
import { handleOptions, jsonResponse } from '../_shared/http.ts';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

Deno.serve(async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  try {
    const fetchedAt = new Date().toISOString();

    const results = await Promise.allSettled(
      CAMBODIA_CITIES.map(async (city) => {
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
        if (!res.ok) throw new Error(`Open-Meteo ${city.id} returned ${res.status}`);

        const data = await res.json();
        const daily = data.daily;
        if (!daily?.time?.length) throw new Error(`No daily data for ${city.id}`);

        return (daily.time as string[]).map((date: string, i: number) => ({
          city: city.id,
          latitude: city.latitude,
          longitude: city.longitude,
          forecast_date: date,
          temp_max_c: daily.temperature_2m_max[i] ?? null,
          temp_min_c: daily.temperature_2m_min[i] ?? null,
          precipitation_mm: daily.precipitation_sum[i] ?? null,
          windspeed_max_kmh: daily.windspeed_10m_max[i] ?? null,
          weather_code: daily.weathercode[i] ?? null,
          humidity_max_pct: daily.relative_humidity_2m_max[i] ?? null,
          humidity_min_pct: daily.relative_humidity_2m_min[i] ?? null,
          fetched_at: fetchedAt,
        }));
      }),
    );

    const rows = results
      .filter((r): r is PromiseFulfilledResult<object[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    const failed = results.filter((r) => r.status === 'rejected').length;

    if (!rows.length) throw new Error('No weather rows were ingested.');

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('weather_forecasts')
      .upsert(rows, { onConflict: 'city,forecast_date' });

    if (error) throw error;

    return jsonResponse({
      ok: true,
      cities: CAMBODIA_CITIES.length,
      rows: rows.length,
      failed,
      fetched_at: fetchedAt,
    });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
});
