import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Returns null when env vars are missing so callers can gracefully skip caching.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Read a cached value from wb_cache.
 * Returns { data, cached_at } or null if missing / expired.
 */
export async function getCached(cacheKey) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('wb_cache')
    .select('payload, cached_at')
    .eq('cache_key', cacheKey)
    .single();

  if (error || !data) return null;

  const age = Date.now() - new Date(data.cached_at).getTime();
  if (age > CACHE_TTL_MS) return null;

  return data.payload;
}

/**
 * Write (upsert) a value into wb_cache.
 */
export async function setCached(cacheKey, payload) {
  if (!supabase) return;
  await supabase.from('wb_cache').upsert(
    { cache_key: cacheKey, payload, cached_at: new Date().toISOString() },
    { onConflict: 'cache_key' }
  );
}
