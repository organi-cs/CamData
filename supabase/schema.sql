-- ============================================================
-- CamData - Supabase schema
-- Apply in Supabase SQL Editor.
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. World Bank API cache
create table if not exists wb_cache (
  cache_key text primary key,
  payload jsonb not null,
  cached_at timestamptz not null default now()
);

comment on table wb_cache is
  'Cache for World Bank API responses. App code refreshes entries older than 24 hours.';

create index if not exists wb_cache_cached_at_idx on wb_cache (cached_at);

-- 2. Dataset registry
create table if not exists mef_datasets (
  id text primary key,
  title text not null,
  title_km text,
  description text,
  source text,
  source_url text,
  cluster_id text,
  formats text[] not null default '{}',
  frequency text,
  last_updated date,
  record_count integer,
  api_endpoint text,
  is_live boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table mef_datasets is
  'Curated registry of Cambodian open datasets. Used by the catalog and developers page.';

create index if not exists mef_datasets_cluster_idx on mef_datasets (cluster_id);

drop trigger if exists mef_datasets_set_updated_at on mef_datasets;
create trigger mef_datasets_set_updated_at
before update on mef_datasets
for each row
execute function public.set_updated_at();

-- 3. Provinces reference data
create table if not exists provinces (
  slug text primary key,
  name_en text not null,
  name_km text,
  type text not null check (type in ('Province', 'Capital', 'Municipality')),
  population integer,
  population_year smallint,
  area_km2 numeric(10, 2),
  capital_city text,
  districts smallint,
  communes smallint,
  villages smallint,
  geojson jsonb,
  created_at timestamptz not null default now()
);

comment on table provinces is
  'Reference data for Cambodia''s 25 provinces and capital city.';

-- 4. Indicators for topic dashboards
create table if not exists indicators (
  id bigint generated always as identity primary key,
  indicator_code text not null,
  indicator_name text not null,
  cluster_id text,
  year smallint not null,
  value numeric,
  unit text,
  source text default 'World Bank',
  note text,
  created_at timestamptz not null default now(),
  unique (indicator_code, year)
);

comment on table indicators is
  'Processed indicator values, one row per World Bank indicator code and year.';

create index if not exists indicators_cluster_idx on indicators (cluster_id);
create index if not exists indicators_code_year_idx on indicators (indicator_code, year desc);

-- 5. Exchange rate history
create table if not exists exchange_rates (
  date date not null,
  currency_id text not null,
  currency text,
  bid numeric(14, 4),
  ask numeric(14, 4),
  average numeric(14, 4) not null,
  fetched_at timestamptz not null default now(),
  source text not null default 'National Bank of Cambodia',
  primary key (date, currency_id)
);

comment on table exchange_rates is
  'Daily snapshots of NBC exchange rates fetched from the MEF realtime API.';

create index if not exists exchange_rates_currency_date_idx on exchange_rates (currency_id, date desc);
create index if not exists exchange_rates_date_idx on exchange_rates (date desc);

-- 6. Air quality history
create table if not exists air_quality_readings (
  id bigint generated always as identity primary key,
  station_id text not null,
  station_name text not null,
  city text not null,
  aqi integer,
  pm25 numeric(10, 2),
  pm10 numeric(10, 2),
  dominant_pollutant text,
  temperature_c numeric(10, 2),
  humidity_pct numeric(10, 2),
  wind_m_s numeric(10, 2),
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  source_url text,
  recorded_at timestamptz not null,
  fetched_at timestamptz not null default now(),
  unique (station_id, recorded_at)
);

comment on table air_quality_readings is
  'Historical WAQI station snapshots for Cambodian cities.';

create index if not exists air_quality_station_recorded_idx on air_quality_readings (station_id, recorded_at desc);
create index if not exists air_quality_recorded_idx on air_quality_readings (recorded_at desc);

-- 7. Row Level Security
alter table wb_cache enable row level security;
alter table mef_datasets enable row level security;
alter table provinces enable row level security;
alter table indicators enable row level security;
alter table exchange_rates enable row level security;
alter table air_quality_readings enable row level security;

drop policy if exists "public read wb_cache" on wb_cache;
drop policy if exists "public read mef_datasets" on mef_datasets;
drop policy if exists "public read provinces" on provinces;
drop policy if exists "public read indicators" on indicators;
drop policy if exists "public read exchange_rates" on exchange_rates;
drop policy if exists "public read air_quality_readings" on air_quality_readings;

create policy "public read wb_cache" on wb_cache for select using (true);
create policy "public read mef_datasets" on mef_datasets for select using (true);
create policy "public read provinces" on provinces for select using (true);
create policy "public read indicators" on indicators for select using (true);
create policy "public read exchange_rates" on exchange_rates for select using (true);
create policy "public read air_quality_readings" on air_quality_readings for select using (true);

drop policy if exists "service write wb_cache" on wb_cache;
drop policy if exists "service write mef_datasets" on mef_datasets;
drop policy if exists "service write provinces" on provinces;
drop policy if exists "service write indicators" on indicators;
drop policy if exists "service write exchange_rates" on exchange_rates;
drop policy if exists "service write air_quality_readings" on air_quality_readings;

create policy "service write wb_cache" on wb_cache for all using (auth.role() = 'service_role');
create policy "service write mef_datasets" on mef_datasets for all using (auth.role() = 'service_role');
create policy "service write provinces" on provinces for all using (auth.role() = 'service_role');
create policy "service write indicators" on indicators for all using (auth.role() = 'service_role');
create policy "service write exchange_rates" on exchange_rates for all using (auth.role() = 'service_role');
create policy "service write air_quality_readings" on air_quality_readings for all using (auth.role() = 'service_role');

-- 8. Seed reference tables
insert into provinces (
  slug, name_en, type, population, population_year, area_km2, capital_city, districts
)
values
  ('banteay-meanchey', 'Banteay Meanchey', 'Province', 900000, 2019, 6679.00, 'Serei Saophoan', 9),
  ('battambang', 'Battambang', 'Province', 1000000, 2019, 11702.00, 'Battambang City', 14),
  ('kampong-cham', 'Kampong Cham', 'Province', 900000, 2019, 4549.00, 'Kampong Cham City', 8),
  ('kampong-chhnang', 'Kampong Chhnang', 'Province', 500000, 2019, 5521.00, 'Kampong Chhnang City', 8),
  ('kampong-speu', 'Kampong Speu', 'Province', 900000, 2019, 7017.00, 'Chbar Mon', 8),
  ('kampong-thom', 'Kampong Thom', 'Province', 700000, 2019, 13814.00, 'Stung Sen', 8),
  ('kampot', 'Kampot', 'Province', 600000, 2019, 4873.00, 'Kampot City', 7),
  ('kandal', 'Kandal', 'Province', 1200000, 2019, 3568.00, 'Ta Khmau', 11),
  ('kep', 'Kep', 'Province', 40000, 2019, 336.00, 'Kep City', 2),
  ('koh-kong', 'Koh Kong', 'Province', 100000, 2019, 11160.00, 'Koh Kong City', 7),
  ('kratie', 'Kratie', 'Province', 400000, 2019, 11094.00, 'Kratie City', 5),
  ('mondulkiri', 'Mondulkiri', 'Province', 100000, 2019, 14288.00, 'Sen Monorom', 5),
  ('oddar-meanchey', 'Oddar Meanchey', 'Province', 300000, 2019, 6158.00, 'Samraong', 5),
  ('pailin', 'Pailin', 'Province', 70000, 2019, 803.00, 'Pailin City', 2),
  ('phnom-penh', 'Phnom Penh', 'Capital', 2300000, 2019, 678.00, 'Phnom Penh', 14),
  ('preah-sihanouk', 'Preah Sihanouk', 'Province', 300000, 2019, 868.00, 'Sihanoukville', 4),
  ('preah-vihear', 'Preah Vihear', 'Province', 300000, 2019, 13788.00, 'Tbeng Meanchey', 8),
  ('prey-veng', 'Prey Veng', 'Province', 1100000, 2019, 4883.00, 'Prey Veng City', 12),
  ('pursat', 'Pursat', 'Province', 400000, 2019, 12692.00, 'Pursat City', 5),
  ('ratanakiri', 'Ratanakiri', 'Province', 200000, 2019, 10782.00, 'Banlung', 8),
  ('siem-reap', 'Siem Reap', 'Province', 1000000, 2019, 10299.00, 'Siem Reap City', 13),
  ('stung-treng', 'Stung Treng', 'Province', 200000, 2019, 11092.00, 'Stung Treng City', 5),
  ('svay-rieng', 'Svay Rieng', 'Province', 500000, 2019, 2966.00, 'Svay Rieng City', 8),
  ('takeo', 'Takeo', 'Province', 900000, 2019, 3563.00, 'Takeo City', 10),
  ('tboung-khmum', 'Tboung Khmum', 'Province', 800000, 2019, 4601.00, 'Suong', 6)
on conflict (slug) do update
set
  name_en = excluded.name_en,
  type = excluded.type,
  population = excluded.population,
  population_year = excluded.population_year,
  area_km2 = excluded.area_km2,
  capital_city = excluded.capital_city,
  districts = excluded.districts;

insert into mef_datasets (
  id, title, description, source, source_url, cluster_id, formats,
  frequency, last_updated, api_endpoint, is_live
)
values
  (
    'usd-exchange-rate',
    'USD/KHR Daily Exchange Rate',
    'Official exchange rates from the National Bank of Cambodia, updated every business day.',
    'National Bank of Cambodia',
    'https://data.mef.gov.kh',
    'finance',
    array['CSV'],
    'Daily',
    date '2026-04-28',
    '/realtime-api/exchange-rate',
    true
  ),
  (
    'rice-exports',
    'Rice Export Volumes by Month',
    'Monthly rice and paddy export statistics by province and destination country.',
    'Ministry of Agriculture, Forestry & Fisheries',
    'https://data.mef.gov.kh',
    'agriculture',
    array['CSV'],
    'Monthly',
    date '2026-04-21',
    null,
    false
  ),
  (
    'angkor-visitors',
    'Angkor Wat Visitor Statistics',
    'Daily ticket sales and visitor counts for Angkor Archaeological Park.',
    'Ministry of Tourism',
    'https://data.mef.gov.kh',
    'tourism',
    array['JSON'],
    'Daily',
    date '2026-04-26',
    null,
    false
  ),
  (
    'mekong-water-levels',
    'Mekong River Daily Water Levels',
    'Daily water level readings from monitoring stations along the Mekong and Tonle Sap.',
    'Ministry of Water Resources',
    'https://data.mef.gov.kh',
    'mekong-water',
    array['CSV'],
    'Daily',
    date '2026-04-28',
    null,
    true
  ),
  (
    'garment-employment',
    'Garment Factory Employment Statistics',
    'Monthly employment data from garment and textile factories across Cambodia.',
    'Ministry of Industry & Handicraft',
    'https://data.mef.gov.kh',
    'garment',
    array['XLSX'],
    'Monthly',
    date '2026-04-14',
    null,
    false
  ),
  (
    'traffic-incidents',
    'Road Traffic Incidents (Phnom Penh)',
    'Daily traffic accident reports, locations, and severity data for Phnom Penh.',
    'Ministry of Public Works & Transport',
    'https://data.mef.gov.kh',
    'urban-mobility',
    array['GeoJSON'],
    'Daily',
    date '2026-04-27',
    null,
    false
  ),
  (
    'rubber-production',
    'Rubber Production by Province',
    'Annual rubber latex production statistics by province and processing method.',
    'Ministry of Agriculture, Forestry & Fisheries',
    'https://data.mef.gov.kh',
    'agriculture',
    array['CSV'],
    'Annual',
    date '2026-03-29',
    null,
    false
  ),
  (
    'csx-index',
    'CSX Stock Market Index',
    'Daily Cambodia Securities Exchange index and trading data for all listed companies.',
    'National Bank of Cambodia',
    'https://data.mef.gov.kh',
    'finance',
    array['JSON'],
    'Daily',
    date '2026-04-28',
    '/realtime-api/csx-index',
    true
  ),
  (
    'tonle-sap-levels',
    'Tonle Sap Lake Water Levels',
    'Daily water level measurements and seasonal flow patterns for Tonle Sap Lake.',
    'Ministry of Water Resources',
    'https://data.mef.gov.kh',
    'mekong-water',
    array['CSV'],
    'Daily',
    date '2026-04-27',
    null,
    false
  ),
  (
    'international-arrivals',
    'International Arrivals by Nationality',
    'Monthly international visitor arrivals to Cambodia broken down by nationality and entry point.',
    'Ministry of Tourism',
    'https://data.mef.gov.kh',
    'tourism',
    array['CSV'],
    'Monthly',
    date '2026-04-18',
    null,
    false
  ),
  (
    'garment-exports',
    'Garment Export Values',
    'Monthly garment and textile export values by destination country and product category.',
    'Ministry of Commerce',
    'https://data.mef.gov.kh',
    'garment',
    array['XLSX'],
    'Monthly',
    date '2026-04-07',
    null,
    false
  ),
  (
    'microfinance',
    'Microfinance Loan Disbursements',
    'Monthly microfinance lending statistics by province, institution, and loan type.',
    'National Bank of Cambodia',
    'https://data.mef.gov.kh',
    'finance',
    array['CSV'],
    'Monthly',
    date '2026-04-13',
    null,
    false
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  source = excluded.source,
  source_url = excluded.source_url,
  cluster_id = excluded.cluster_id,
  formats = excluded.formats,
  frequency = excluded.frequency,
  last_updated = excluded.last_updated,
  api_endpoint = excluded.api_endpoint,
  is_live = excluded.is_live;

-- The indicators table is intentionally left for the refresh-worldbank
-- function to populate with live World Bank data.
