import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import { handleOptions, jsonResponse } from '../_shared/http.ts';
import { WORLD_BANK_INDICATORS } from '../_shared/worldbankIndicators.ts';

const COUNTRY = 'KHM';
const START_YEAR = 2010;
const END_YEAR = 2024;

Deno.serve(async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  try {
    const supabase = createAdminClient();
    const fetchedAt = new Date().toISOString();

    const responses = await Promise.all(
      WORLD_BANK_INDICATORS.map(async (indicator) => {
        const response = await fetch(
          `https://api.worldbank.org/v2/country/${COUNTRY}/indicator/${indicator.code}?date=${START_YEAR}:${END_YEAR}&format=json&per_page=100`,
        );

        if (!response.ok) {
          throw new Error(`${indicator.code} returned ${response.status}`);
        }

        const payload = await response.json();
        const series = Array.isArray(payload[1]) ? payload[1] : [];

        return series
          .filter((entry: { value: number | null }) => entry.value != null)
          .map((entry: { date: string; value: number }) => ({
            indicator_code: indicator.code,
            indicator_name: indicator.name,
            cluster_id: indicator.clusterId,
            year: Number(entry.date),
            value: entry.value,
            unit: indicator.unit,
            source: 'World Bank',
            note: `Refreshed ${fetchedAt.slice(0, 10)}`,
          }));
      }),
    );

    const rows = responses.flat();
    if (!rows.length) {
      throw new Error('No World Bank rows were returned.');
    }

    const { error } = await supabase
      .from('indicators')
      .upsert(rows, { onConflict: 'indicator_code,year' });

    if (error) throw error;

    return jsonResponse({
      ok: true,
      indicators: WORLD_BANK_INDICATORS.length,
      rows: rows.length,
      range: `${START_YEAR}-${END_YEAR}`,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
});
