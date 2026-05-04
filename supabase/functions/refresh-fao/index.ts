import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import { handleOptions, jsonResponse } from '../_shared/http.ts';

// FAO FAOSTAT API — free, no key needed
// https://www.fao.org/faostat/en/#data
const FAOSTAT_BASE = 'https://fenixservices.fao.org/faostat/api/v1/en/data/QCL';
const CAMBODIA_AREA = '116'; // FAO area code for Cambodia
const START_YEAR = 2010;
const END_YEAR = 2023;

const CROPS = [
  { code: '27',  name: 'Rice (paddy)' },
  { code: '56',  name: 'Maize' },
  { code: '125', name: 'Cassava' },
  { code: '156', name: 'Sugar cane' },
  { code: '217', name: 'Rubber (natural)' },
  { code: '397', name: 'Soybeans' },
];

// FAO element codes
const ELEMENTS = [
  { code: '5510', name: 'Production', unit: 'tonnes' },
  { code: '5312', name: 'Area harvested', unit: 'ha' },
];

Deno.serve(async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  try {
    const supabase = createAdminClient();
    const fetchedAt = new Date().toISOString();
    const rows: object[] = [];
    const yearList = Array.from(
      { length: END_YEAR - START_YEAR + 1 },
      (_, i) => START_YEAR + i,
    ).join(',');

    for (const element of ELEMENTS) {
      const params = new URLSearchParams({
        area: CAMBODIA_AREA,
        item: CROPS.map((c) => c.code).join(','),
        element: element.code,
        year: yearList,
        output_type: 'objects',
      });

      const res = await fetch(`${FAOSTAT_BASE}?${params}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`FAOSTAT element ${element.code} returned ${res.status}`);

      const data = await res.json();
      const records: any[] = data.data ?? [];

      for (const record of records) {
        const crop = CROPS.find((c) => c.code === String(record.Item_Code ?? record['Item Code']));
        const value = record.Value ?? record.value;
        if (!crop || value == null || value === '') continue;

        rows.push({
          indicator_code: `FAO_${element.code}_${record.Item_Code ?? record['Item Code']}`,
          indicator_name: `${crop.name} — ${element.name} (Cambodia)`,
          cluster_id: 'agriculture',
          year: Number(record.Year ?? record.year),
          value: Number(value),
          unit: element.unit,
          source: 'FAO FAOSTAT',
          note: `Refreshed ${fetchedAt.slice(0, 10)}`,
        });
      }
    }

    if (!rows.length) throw new Error('No FAO rows were parsed from FAOSTAT response.');

    const { error } = await supabase
      .from('indicators')
      .upsert(rows, { onConflict: 'indicator_code,year' });

    if (error) throw error;

    return jsonResponse({ ok: true, rows: rows.length, fetched_at: fetchedAt });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
});
