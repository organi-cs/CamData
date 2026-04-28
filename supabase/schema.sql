-- ============================================================
-- CamData — Supabase schema
-- Paste this into: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. World Bank API response cache ────────────────────────
-- Stores serialised JSON responses so we don't hit the free
-- World Bank API on every page load. TTL enforced in app code.
create table if not exists wb_cache (
  cache_key  text primary key,              -- e.g. "wb:KHM:SP.POP.TOTL:2000-2024"
  payload    jsonb        not null,         -- the array of { year, value } points
  cached_at  timestamptz  not null default now()
);

comment on table wb_cache is
  'Cache for World Bank API responses. App code refreshes entries older than 24 h.';

-- Index so stale-cache sweeps are fast
create index if not exists wb_cache_cached_at_idx on wb_cache (cached_at);


-- ── 2. MEF / government datasets registry ───────────────────
-- Human-curated metadata for datasets available on
-- data.mef.gov.kh and other official Cambodian sources.
create table if not exists mef_datasets (
  id           text primary key,            -- slug, e.g. "usd-exchange-rate"
  title        text         not null,
  title_km     text,                        -- Khmer title (optional)
  description  text,
  source       text,                        -- e.g. "National Bank of Cambodia"
  source_url   text,
  cluster_id   text,                        -- finance | agriculture | tourism | …
  formats      text[]       default '{}',   -- e.g. ARRAY['CSV','JSON']
  frequency    text,                        -- Daily | Monthly | Annual | etc.
  last_updated date,
  record_count integer,
  api_endpoint text,                        -- relative path on /api/mef/…
  is_live      boolean      default false,  -- true = real-time feed
  created_at   timestamptz  default now(),
  updated_at   timestamptz  default now()
);

comment on table mef_datasets is
  'Curated registry of Cambodian open datasets. Supplements the MEF API catalogue.';

create index if not exists mef_datasets_cluster_idx on mef_datasets (cluster_id);


-- ── 3. Provinces reference table ───────────────────────────
create table if not exists provinces (
  slug         text primary key,            -- e.g. "siem-reap"
  name_en      text         not null,
  name_km      text,
  type         text         not null check (type in ('Province','Capital','Municipality')),
  population   integer,                     -- latest census figure
  population_year smallint,                 -- year the census figure comes from
  area_km2     numeric(10,2),
  capital_city text,
  districts    smallint,
  communes     smallint,
  villages     smallint,
  geojson      jsonb,                       -- GeoJSON polygon (optional, can be large)
  created_at   timestamptz  default now()
);

comment on table provinces is
  'Reference data for Cambodia''s 25 provinces and capital. Population from 2019 census.';


-- ── 4. Indicators — curated snapshot for topic dashboards ──
-- Stores pre-processed, labelled indicator values so the topic
-- dashboard pages don't have to call the World Bank API on each
-- render (fallback when Supabase cache isn't available yet).
create table if not exists indicators (
  id             bigint generated always as identity primary key,
  indicator_code text         not null,     -- World Bank code, e.g. SP.POP.TOTL
  indicator_name text         not null,     -- Human label
  cluster_id     text,                      -- which topic this belongs to
  year           smallint     not null,
  value          numeric,
  unit           text,                      -- "%" | "USD" | "persons" | etc.
  source         text         default 'World Bank',
  note           text,                      -- e.g. "Preliminary estimate"
  created_at     timestamptz  default now(),
  unique (indicator_code, year)
);

comment on table indicators is
  'Processed World Bank and other indicator values, one row per code+year.';

create index if not exists indicators_cluster_idx  on indicators (cluster_id);
create index if not exists indicators_code_year_idx on indicators (indicator_code, year desc);


-- ── 5. Row Level Security ───────────────────────────────────
-- All tables are public-read (anon key is fine), no public writes.

alter table wb_cache     enable row level security;
alter table mef_datasets enable row level security;
alter table provinces    enable row level security;
alter table indicators   enable row level security;

-- Public read
create policy "public read wb_cache"     on wb_cache     for select using (true);
create policy "public read mef_datasets" on mef_datasets for select using (true);
create policy "public read provinces"    on provinces    for select using (true);
create policy "public read indicators"   on indicators   for select using (true);

-- Only the service-role key (server-side / Supabase Studio) can write
create policy "service write wb_cache"     on wb_cache     for all using (auth.role() = 'service_role');
create policy "service write mef_datasets" on mef_datasets for all using (auth.role() = 'service_role');
create policy "service write provinces"    on provinces    for all using (auth.role() = 'service_role');
create policy "service write indicators"   on indicators   for all using (auth.role() = 'service_role');
