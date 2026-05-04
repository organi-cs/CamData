import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import { handleOptions, jsonResponse } from '../_shared/http.ts';

const LAT_MIN = 8;
const LAT_MAX = 16;
const LON_MIN = 100;
const LON_MAX = 110;

const GDACS_TYPE_MAP: Record<string, string> = {
  FL: 'flood', TC: 'cyclone', EQ: 'earthquake', WF: 'wildfire', DR: 'drought', VO: 'volcano',
};

function thirtyDaysAgo() {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function safeJson(res: Response): Promise<any> {
  const text = await res.text();
  if (!text || !text.trimStart().startsWith('{') && !text.trimStart().startsWith('[')) {
    throw new Error(`Expected JSON but got: ${text.slice(0, 120)}`);
  }
  return JSON.parse(text);
}

async function fetchGDACS(): Promise<object[]> {
  // Try the GeoJSON events API first
  const url =
    `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH` +
    `?eventtype=FL,TC,EQ,WF` +
    `&fromDate=${thirtyDaysAgo()}&toDate=${new Date().toISOString().slice(0, 10)}` +
    `&alertlevel=Green,Orange,Red`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'CamData/1.0 (cambodia open data platform; non-commercial)',
    },
  });

  if (!res.ok) throw new Error(`GDACS returned HTTP ${res.status}`);

  const data = await safeJson(res);
  const features: any[] = data.features ?? [];

  // Filter to Mekong region by coordinates when available
  return features
    .filter((f: any) => {
      const coords = f.geometry?.coordinates;
      if (!Array.isArray(coords)) return true; // keep if no coords
      const [lon, lat] = coords;
      return lat >= LAT_MIN - 5 && lat <= LAT_MAX + 5 && lon >= LON_MIN - 5 && lon <= LON_MAX + 5;
    })
    .map((feature: any) => {
      const p = feature.properties ?? {};
      const coords = feature.geometry?.coordinates;
      return {
        id: `gdacs-${p.eventtype}-${p.eventid}`,
        source: 'GDACS',
        event_type: GDACS_TYPE_MAP[p.eventtype] ?? p.eventtype?.toLowerCase() ?? 'unknown',
        title: p.name || p.htmlname || `${p.eventtype} Alert`,
        description: p.description ?? null,
        severity: p.alertlevel?.toLowerCase() ?? null,
        severity_score: p.episodealertlevel != null ? Number(p.episodealertlevel) : null,
        country: p.iso3 ?? null,
        region: p.affectedcountries ?? null,
        latitude: Array.isArray(coords) ? coords[1] : null,
        longitude: Array.isArray(coords) ? coords[0] : null,
        event_date: p.fromdate ? new Date(p.fromdate).toISOString() : null,
        url: p.url?.report ?? p.url?.details ?? null,
        is_current: p.iscurrent === true || p.iscurrent === 'true',
      };
    });
}

async function fetchUSGSEarthquakes(): Promise<object[]> {
  const url =
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
    `&minlatitude=${LAT_MIN}&maxlatitude=${LAT_MAX}` +
    `&minlongitude=${LON_MIN}&maxlongitude=${LON_MAX}` +
    `&minmagnitude=4.0&starttime=${thirtyDaysAgo()}&orderby=time&limit=50`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`USGS returned HTTP ${res.status}`);

  const data = await safeJson(res);

  return (data.features ?? []).map((feature: any) => {
    const p = feature.properties ?? {};
    const [lon, lat] = feature.geometry?.coordinates ?? [null, null];
    const mag: number = p.mag ?? 0;
    const severity = mag >= 6.5 ? 'red' : mag >= 5.5 ? 'orange' : 'green';
    return {
      id: `usgs-${feature.id}`,
      source: 'USGS',
      event_type: 'earthquake',
      title: p.title ?? `M${mag} Earthquake`,
      description: p.place ?? null,
      severity,
      severity_score: mag,
      country: null,
      region: p.place ?? null,
      latitude: lat,
      longitude: lon,
      event_date: p.time ? new Date(p.time).toISOString() : null,
      url: p.url ?? null,
      is_current: true,
    };
  });
}

Deno.serve(async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  const [gdacsResult, usgsResult] = await Promise.allSettled([
    fetchGDACS(),
    fetchUSGSEarthquakes(),
  ]);

  const rows = [
    ...(gdacsResult.status === 'fulfilled' ? gdacsResult.value : []),
    ...(usgsResult.status === 'fulfilled' ? usgsResult.value : []),
  ];

  const warnings = [
    gdacsResult.status === 'rejected' ? `GDACS: ${(gdacsResult as PromiseRejectedResult).reason?.message}` : null,
    usgsResult.status === 'rejected' ? `USGS: ${(usgsResult as PromiseRejectedResult).reason?.message}` : null,
  ].filter(Boolean);

  // Succeed with partial data; only hard-fail if both sources failed and nothing to write
  if (!rows.length) {
    return jsonResponse(
      { ok: false, error: 'Both sources failed', warnings },
      { status: 500 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('disaster_alerts')
      .upsert(rows, { onConflict: 'id' });

    if (error) throw error;

    return jsonResponse({
      ok: true,
      ingested: rows.length,
      gdacs: gdacsResult.status === 'fulfilled' ? gdacsResult.value.length : 'failed',
      usgs: usgsResult.status === 'fulfilled' ? usgsResult.value.length : 'failed',
      warnings: warnings.length ? warnings : undefined,
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error', warnings },
      { status: 500 },
    );
  }
});
