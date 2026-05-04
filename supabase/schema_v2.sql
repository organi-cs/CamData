-- ============================================================
-- CamData - Schema v2
-- Adds: weather_forecasts, disaster_alerts
-- Run in Supabase SQL Editor after schema.sql
-- ============================================================

-- 7. Daily weather forecasts per city (Open-Meteo / ERA5+GFS)
create table if not exists weather_forecasts (
  id bigint generated always as identity primary key,
  city text not null,
  latitude numeric(9, 6) not null,
  longitude numeric(9, 6) not null,
  forecast_date date not null,
  temp_max_c numeric(5, 2),
  temp_min_c numeric(5, 2),
  precipitation_mm numeric(8, 2),
  windspeed_max_kmh numeric(6, 2),
  weather_code integer,
  humidity_max_pct numeric(5, 2),
  humidity_min_pct numeric(5, 2),
  fetched_at timestamptz not null default now(),
  unique (city, forecast_date)
);

comment on table weather_forecasts is
  '7-day daily weather forecasts for Cambodian cities from Open-Meteo (ERA5/GFS models). No API key required.';

create index if not exists weather_forecasts_city_date_idx on weather_forecasts (city, forecast_date desc);
create index if not exists weather_forecasts_date_idx on weather_forecasts (forecast_date desc);

-- 8. Disaster and hazard alerts (GDACS + USGS)
create table if not exists disaster_alerts (
  id text primary key,
  source text not null,
  event_type text not null,
  title text not null,
  description text,
  severity text,
  severity_score numeric,
  country text,
  region text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  event_date timestamptz,
  url text,
  is_current boolean not null default true,
  fetched_at timestamptz not null default now()
);

comment on table disaster_alerts is
  'Disaster and hazard alerts from GDACS (floods, cyclones) and USGS (earthquakes) for the Mekong region.';

create index if not exists disaster_alerts_event_date_idx on disaster_alerts (event_date desc);
create index if not exists disaster_alerts_event_type_idx on disaster_alerts (event_type);
create index if not exists disaster_alerts_current_idx on disaster_alerts (is_current);

-- RLS
alter table weather_forecasts enable row level security;
alter table disaster_alerts enable row level security;

drop policy if exists "public read weather_forecasts" on weather_forecasts;
drop policy if exists "public read disaster_alerts" on disaster_alerts;
drop policy if exists "service write weather_forecasts" on weather_forecasts;
drop policy if exists "service write disaster_alerts" on disaster_alerts;

create policy "public read weather_forecasts" on weather_forecasts for select using (true);
create policy "public read disaster_alerts" on disaster_alerts for select using (true);
create policy "service write weather_forecasts" on weather_forecasts for all using (auth.role() = 'service_role');
create policy "service write disaster_alerts" on disaster_alerts for all using (auth.role() = 'service_role');
