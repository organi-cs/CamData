import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createAdminClient } from '../_shared/supabase.ts';
import { handleOptions, jsonResponse } from '../_shared/http.ts';

const MEF_EXCHANGE_URL = 'https://data.mef.gov.kh/api/v1/realtime-api/exchange-rate';

function todayInBangkok() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function parseNumber(value: unknown) {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

Deno.serve(async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  try {
    const response = await fetch(MEF_EXCHANGE_URL);
    if (!response.ok) {
      throw new Error(`MEF exchange rate request failed with ${response.status}`);
    }

    const payload = await response.json();
    const rows = payload.data || payload.items || payload.results || payload;

    if (!Array.isArray(rows)) {
      throw new Error('MEF exchange rate payload was not an array.');
    }

    const fetchedAt = new Date().toISOString();
    const date = todayInBangkok();
    const records = rows
      .map((row) => {
        const currencyId = row.currency_id || row.code || row.currencyCode;
        const average = parseNumber(row.average ?? row.avg ?? row.mid);

        if (!currencyId || average == null) return null;

        return {
          date,
          currency_id: currencyId,
          currency: row.currency || row.currency_name || row.name || currencyId,
          bid: parseNumber(row.bid ?? row.buy),
          ask: parseNumber(row.ask ?? row.sell),
          average,
          fetched_at: fetchedAt,
        };
      })
      .filter(Boolean);

    if (!records.length) {
      throw new Error('No exchange rate rows were parsed from the MEF payload.');
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('exchange_rates')
      .upsert(records, { onConflict: 'date,currency_id' });

    if (error) throw error;

    return jsonResponse({
      ok: true,
      ingested: records.length,
      date,
      fetched_at: fetchedAt,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
});
