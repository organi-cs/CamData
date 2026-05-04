import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import { handleOptions, jsonResponse } from '../_shared/http.ts';

// UN SDG Indicators API — free, no key
// https://unstats.un.org/sdgapi
const SDG_BASE = 'https://unstats.un.org/sdgapi/v1/sdg/Indicator/Data';
const CAMBODIA_AREA = '116'; // UN M49 code for Cambodia

const SDG_INDICATORS = [
  { code: '1.1.1', name: 'Extreme poverty rate (% below $2.15/day)', clusterId: 'finance' },
  { code: '2.1.1', name: 'Prevalence of undernourishment (%)', clusterId: 'health' },
  { code: '3.1.1', name: 'Maternal mortality ratio (per 100,000 live births)', clusterId: 'health' },
  { code: '3.2.1', name: 'Under-5 mortality rate (per 1,000 live births)', clusterId: 'health' },
  { code: '4.1.1', name: 'Minimum proficiency in reading (% children)', clusterId: 'labour' },
  { code: '6.1.1', name: 'Population using safely managed drinking water (%)', clusterId: 'health' },
  { code: '7.1.1', name: 'Population with access to electricity (%)', clusterId: 'environment' },
  { code: '8.1.1', name: 'Annual growth rate of real GDP per employed person (%)', clusterId: 'finance' },
  { code: '15.1.1', name: 'Forest area as a proportion of total land area (%)', clusterId: 'environment' },
  { code: '17.8.1', name: 'Proportion of individuals using the Internet (%)', clusterId: 'environment' },
];

Deno.serve(async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  try {
    const supabase = createAdminClient();
    const fetchedAt = new Date().toISOString();
    const rows: object[] = [];

    const results = await Promise.allSettled(
      SDG_INDICATORS.map(async (indicator) => {
        const params = new URLSearchParams({
          indicator: indicator.code,
          areaCode: CAMBODIA_AREA,
          timePeriodStart: '2010',
          timePeriodEnd: '2023',
        });

        const res = await fetch(`${SDG_BASE}?${params}`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`SDG ${indicator.code} returned ${res.status}`);

        const data = await res.json();
        const records: any[] = data.data ?? [];

        return records
          .filter((r: any) => r.value != null && r.value !== '')
          .map((r: any) => ({
            indicator_code: `SDG_${indicator.code.replace(/\./g, '_')}`,
            indicator_name: `SDG ${indicator.code}: ${indicator.name}`,
            cluster_id: indicator.clusterId,
            year: Number(r.timePeriodStart ?? r.timePeriod ?? r.year),
            value: Number(r.value),
            unit: r.units ?? null,
            source: 'UN SDG Global Database',
            note: `Refreshed ${fetchedAt.slice(0, 10)}`,
          }));
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') rows.push(...result.value);
    }

    const warnings = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason?.message ?? 'Unknown');

    if (!rows.length) throw new Error(`No SDG rows parsed. Warnings: ${warnings.join('; ')}`);

    const { error } = await supabase
      .from('indicators')
      .upsert(rows, { onConflict: 'indicator_code,year' });

    if (error) throw error;

    return jsonResponse({
      ok: true,
      rows: rows.length,
      warnings: warnings.length ? warnings : undefined,
      fetched_at: fetchedAt,
    });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
});
