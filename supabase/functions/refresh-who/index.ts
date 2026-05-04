import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import { handleOptions, jsonResponse } from '../_shared/http.ts';

// WHO Global Health Observatory OData API — free, no key needed
// https://www.who.int/data/gho/info/gho-odata-api
const GHO_BASE = 'https://ghoapi.azureedge.net/api';

const WHO_INDICATORS = [
  { code: 'MALARIA_EST_INCIDENCE',       name: 'Malaria incidence (per 1,000 population at risk)' },
  { code: 'MDG_0000000026',              name: 'Life expectancy at birth (years)' },
  { code: 'MDG_0000000007',              name: 'Under-5 mortality rate (per 1,000 live births)' },
  { code: 'WHS3_62',                     name: 'Tuberculosis incidence (per 100,000 population)' },
  { code: 'HIV_0000000026',              name: 'HIV prevalence among adults 15–49 (%)' },
  { code: 'NUTRITION_ANAEMIA_WOMEN_PREV', name: 'Anaemia prevalence in women of reproductive age (%)' },
  { code: 'WHS4_544',                    name: 'DTP3 immunization coverage (%)' },
  { code: 'WSH_SANITATION_SAFELY_MANAGED', name: 'Population using safely managed sanitation services (%)' },
  { code: 'WSH_WATER_SAFELY_MANAGED',    name: 'Population using safely managed drinking water (%)' },
];

Deno.serve(async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  try {
    const supabase = createAdminClient();
    const fetchedAt = new Date().toISOString();

    const results = await Promise.allSettled(
      WHO_INDICATORS.map(async (indicator) => {
        const filter = encodeURIComponent(`SpatialDim eq 'KHM' and TimeDim ge 2010`);
        const select = encodeURIComponent('TimeDim,NumericValue');
        const url = `${GHO_BASE}/${indicator.code}?$filter=${filter}&$select=${select}`;

        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`WHO GHO ${indicator.code} returned ${res.status}`);

        const data = await res.json();
        const records: any[] = data.value ?? [];

        return records
          .filter((r) => r.NumericValue != null)
          .map((r) => ({
            indicator_code: `WHO_${indicator.code}`,
            indicator_name: indicator.name,
            cluster_id: 'health',
            year: Number(r.TimeDim),
            value: Number(r.NumericValue),
            unit: null,
            source: 'WHO Global Health Observatory',
            note: `Refreshed ${fetchedAt.slice(0, 10)}`,
          }));
      }),
    );

    const rows = results
      .filter((r): r is PromiseFulfilledResult<object[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    const failed = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason?.message ?? 'Unknown');

    if (!rows.length) throw new Error(`No WHO rows fetched. Errors: ${failed.join('; ')}`);

    const { error } = await supabase
      .from('indicators')
      .upsert(rows, { onConflict: 'indicator_code,year' });

    if (error) throw error;

    return jsonResponse({
      ok: true,
      rows: rows.length,
      warnings: failed.length ? failed : undefined,
      fetched_at: fetchedAt,
    });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
});
