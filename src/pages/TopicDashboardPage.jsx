import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DataCard } from '../components/features/DataCard';
import { RomduolIconOutline } from '../components/ui/RomduolIcon';
import { DATA_CLUSTERS, MINISTRIES } from '../types';
import { fetchIndicators, INDICATORS } from '../services/worldbank';
import { fetchCambodiaClimate } from '../services/nasaPowerApi';
import { getLatestExchangeRates } from '../services/supabaseData';
import '../styles/design-tokens.css';

// Supplementary static indicators for clusters without WB coverage
// Finance KHR rate is fetched live from Supabase exchange_rates table
const STATIC_CARDS = {
  agriculture: [
    { label: 'Rice Exports (est.)', value: '75,000 t', source: 'MAFF', note: 'Jan 2025' },
    { label: 'Cassava Yield (est.)', value: '1.15M t', source: 'MAFF', note: '2024' },
  ],
  tourism: [
    { label: 'Angkor Visitors (est.)', value: '158,000', source: 'APSARA', note: 'Dec 2024' },
    { label: 'Tourism Revenue (est.)', value: '$3.9B', source: 'MOT', note: '2024' },
  ],
  garment: [
    { label: 'Active Factories (est.)', value: '1,050', source: 'MIH', note: '2025' },
    { label: 'Workers Employed (est.)', value: '760,000', source: 'MIH', note: '2025' },
  ],
  'mekong-water': [
    { label: 'Mekong Level — Kratie (est.)', value: '~8 m', source: 'MOWRAM', note: 'seasonal avg.' },
    { label: 'Tonle Sap — P. Penh (est.)', value: '~3 m', source: 'MOWRAM', note: 'seasonal avg.' },
    { label: 'Monthly Rainfall', value: '142 mm', source: 'MOWRAM', note: 'Nov 2024' },
  ],
  'urban-mobility': [
    { label: 'Daily Traffic Incidents (est.)', value: '~47', source: 'MPWT', note: '2024' },
    { label: 'Bus Ridership / Day (est.)', value: '~17,200', source: 'MPWT', note: '2024' },
    { label: 'Registered Vehicles', value: '3.6M', source: 'MPWT', note: '2024' },
    { label: 'Road Network', value: '62,000 km', source: 'MPWT', note: '2024' },
  ],
  health: [
    { label: 'Dengue Cases (est.)', value: '14,200', source: 'WHO/MOH', note: '2023' },
    { label: 'Hospital Beds per 1k', value: '0.8', source: 'WHO', note: '2021' },
  ],
  environment: [
    { label: 'Protected Land Area', value: '23%', source: 'IUCN', note: '2024' },
    { label: 'Avg Annual Rainfall', value: '1,400 mm', source: 'NASA POWER', note: 'climatology' },
  ],
  labour: [
    { label: 'Min. Wage (garment)', value: '$204/mo', source: 'MoLVT', note: '2024' },
    { label: 'Informal Economy Share', value: '~60%', source: 'ILO', note: 'est. 2023' },
  ],
};

// No fabricated static chart data — charts only render from live API sources
const STATIC_CHARTS = {};

// Indicator config per cluster — codes are looked up in Supabase `indicators` table
// World Bank codes use standard WB format; WHO codes use WHO_* prefix; FAO use FAO_*
const WB_CONFIG = {
  finance: {
    indicators: [
      { code: INDICATORS.GDP_GROWTH, label: 'GDP Growth', format: v => `${v.toFixed(1)}%` },
      { code: INDICATORS.GDP_PER_CAPITA, label: 'GDP per Capita', format: v => `$${Math.round(v).toLocaleString()}` },
      { code: INDICATORS.INFLATION, label: 'Inflation Rate', format: v => `${v.toFixed(1)}%` },
    ],
    charts: [
      { code: INDICATORS.GDP_GROWTH, title: 'GDP Growth Rate (annual %)', type: 'area', yFormat: v => `${v.toFixed(1)}%` },
      { code: INDICATORS.GDP_PER_CAPITA, title: 'GDP per Capita (current USD)', type: 'line', yFormat: v => `$${Math.round(v).toLocaleString()}` },
    ],
  },
  agriculture: {
    indicators: [
      { code: INDICATORS.AGRICULTURE_GDP, label: 'Agriculture % of GDP', format: v => `${v.toFixed(1)}%` },
      { code: INDICATORS.FOREST_AREA, label: 'Forest Cover', format: v => `${v.toFixed(1)}%` },
    ],
    charts: [
      { code: INDICATORS.AGRICULTURE_GDP, title: 'Agriculture, Forestry & Fishing (% of GDP)', type: 'bar', yFormat: v => `${v.toFixed(1)}%` },
      { code: INDICATORS.FOREST_AREA, title: 'Forest Area (% of land area)', type: 'area', yFormat: v => `${v.toFixed(1)}%` },
    ],
  },
  tourism: {
    indicators: [
      { code: INDICATORS.TOURIST_ARRIVALS, label: "Int'l Arrivals", format: v => v >= 1e6 ? `${(v / 1e6).toFixed(2)}M` : `${(v / 1e3).toFixed(0)}K` },
    ],
    charts: [
      {
        code: INDICATORS.TOURIST_ARRIVALS, title: 'International Tourist Arrivals', type: 'area',
        transform: v => v / 1e6, yFormat: v => `${v.toFixed(2)}M`,
      },
    ],
  },
  garment: {
    indicators: [
      { code: INDICATORS.EXPORTS_GDP, label: 'Exports (% of GDP)', format: v => `${v.toFixed(1)}%` },
    ],
    charts: [
      { code: INDICATORS.EXPORTS_GDP, title: 'Exports of Goods & Services (% of GDP)', type: 'line', yFormat: v => `${v.toFixed(1)}%` },
    ],
  },
  health: {
    indicators: [
      { code: 'WHO_MALARIA_EST_INCIDENCE',       label: 'Malaria Incidence',    format: v => `${v.toFixed(1)} per 1k` },
      { code: 'WHO_MDG_0000000026',              label: 'Life Expectancy',      format: v => `${v.toFixed(1)} yrs` },
      { code: 'WHO_MDG_0000000007',              label: 'Under-5 Mortality',    format: v => `${v.toFixed(1)} per 1k` },
      { code: 'WHO_WHS3_62',                    label: 'TB Incidence',         format: v => `${v.toFixed(0)} per 100k` },
      { code: 'WHO_WHS4_544',                   label: 'DTP3 Coverage',        format: v => `${v.toFixed(0)}%` },
    ],
    charts: [
      { code: 'WHO_MDG_0000000026',              title: 'Life Expectancy at Birth (years)',                    type: 'line', yFormat: v => `${v.toFixed(1)}` },
      { code: 'WHO_MDG_0000000007',              title: 'Under-5 Mortality Rate (per 1,000 live births)',      type: 'area', yFormat: v => `${v.toFixed(1)}` },
      { code: 'WHO_WHS3_62',                    title: 'Tuberculosis Incidence (per 100,000 population)',     type: 'bar',  yFormat: v => `${v.toFixed(0)}` },
      { code: 'WHO_MALARIA_EST_INCIDENCE',       title: 'Malaria Incidence (per 1,000 population at risk)',   type: 'area', yFormat: v => `${v.toFixed(2)}` },
    ],
  },
  environment: {
    indicators: [
      { code: INDICATORS.FOREST_AREA,    label: 'Forest Cover',     format: v => `${v.toFixed(1)}%` },
      { code: INDICATORS.CO2_EMISSIONS,  label: 'CO₂ Emissions',    format: v => `${v.toFixed(2)} t/cap` },
      { code: 'EG.ELC.ACCS.ZS',         label: 'Electricity Access', format: v => `${v.toFixed(1)}%` },
    ],
    charts: [
      { code: INDICATORS.FOREST_AREA,    title: 'Forest Area (% of land area)',                    type: 'area', yFormat: v => `${v.toFixed(1)}%` },
      { code: INDICATORS.CO2_EMISSIONS,  title: 'CO₂ Emissions (metric tons per capita)',          type: 'line', yFormat: v => `${v.toFixed(2)}` },
      { code: 'EG.ELC.ACCS.ZS',         title: 'Access to Electricity (% of population)',         type: 'area', yFormat: v => `${v.toFixed(1)}%` },
    ],
  },
  labour: {
    indicators: [
      { code: 'SL.TLF.CACT.ZS',    label: 'Labour Force Participation', format: v => `${v.toFixed(1)}%` },
      { code: 'SL.UEM.TOTL.ZS',    label: 'Unemployment Rate',          format: v => `${v.toFixed(1)}%` },
      { code: 'SL.AGR.EMPL.ZS',    label: 'Employment in Agriculture',  format: v => `${v.toFixed(1)}%` },
      { code: 'SL.SRV.EMPL.ZS',    label: 'Employment in Services',     format: v => `${v.toFixed(1)}%` },
    ],
    charts: [
      { code: 'SL.TLF.CACT.ZS',    title: 'Labour Force Participation Rate (% ages 15+)',          type: 'line', yFormat: v => `${v.toFixed(1)}%` },
      { code: 'SL.AGR.EMPL.ZS',    title: 'Employment in Agriculture (% of total)',                type: 'area', yFormat: v => `${v.toFixed(1)}%` },
      { code: 'SL.IND.EMPL.ZS',    title: 'Employment in Industry (% of total)',                  type: 'bar',  yFormat: v => `${v.toFixed(1)}%` },
      { code: 'SL.SRV.EMPL.ZS',    title: 'Employment in Services (% of total)',                  type: 'bar',  yFormat: v => `${v.toFixed(1)}%` },
    ],
  },
};

function ChartBlock({ title, data, type, color, yFormat }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data available for this chart</p>
      </div>
    );
  }

  const ChartComponent = type === 'bar' ? BarChart : type === 'area' ? AreaChart : LineChart;

  return (
    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <ChartComponent data={data} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={52} tickFormatter={yFormat || (v => v.toLocaleString())} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13 }}
            cursor={{ fill: `${color}18` }}
            formatter={(v) => [yFormat ? yFormat(v) : v.toLocaleString(), '']}
          />
          {type === 'area' ? (
            <Area type="monotone" dataKey="value" stroke={color} fill={`${color}20`} strokeWidth={2} dot={false} />
          ) : type === 'line' ? (
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ) : (
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}

function IndicatorCard({ label, value, change, source, note }) {
  return (
    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1 }}>{value}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {change != null ? (
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600,
            color: change > 0 ? 'var(--success)' : change < 0 ? 'var(--error)' : 'var(--text-muted)'
          }}>
            {change > 0 ? <TrendingUp size={13} /> : change < 0 ? <TrendingDown size={13} /> : null}
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        ) : <span />}
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
          {source}{note ? ` · ${note}` : ''}
        </span>
      </div>
    </div>
  );
}

const CLUSTER_DATASETS = {
  finance: [
    { id: 'usd-exchange-rate', title: 'USD/KHR Daily Exchange Rate', description: 'Official daily exchange rates from the National Bank of Cambodia.', ministry: MINISTRIES.nbc, lastUpdated: new Date().toISOString(), hasGeospatial: false, category: 'Financial Markets' },
    { id: 'csx-index', title: 'CSX Stock Market Index', description: 'Daily Cambodia Securities Exchange index and trading data.', ministry: MINISTRIES.nbc, lastUpdated: new Date().toISOString(), hasGeospatial: false, category: 'Financial Markets' },
    { id: 'microfinance', title: 'Microfinance Loan Disbursements', description: 'Monthly microfinance stats by province.', ministry: MINISTRIES.nbc, lastUpdated: new Date(Date.now() - 15 * 864e5).toISOString(), hasGeospatial: true, category: 'Financial Markets' },
  ],
};

export default function TopicDashboardPage() {
  const { slug } = useParams();
  const cluster = DATA_CLUSTERS.find(c => c.id === slug);
  const wbConfig = WB_CONFIG[slug];
  const datasets = CLUSTER_DATASETS[slug] || [];

  const [wbData, setWbData] = useState({});
  const [loading, setLoading] = useState(false);
  const [climateData, setClimateData] = useState(null);
  const [khrRate, setKhrRate] = useState(null);

  useEffect(() => {
    if (!wbConfig) return;
    setLoading(true);
    setWbData({});

    const codes = [...new Set([
      ...wbConfig.indicators.map(i => i.code),
      ...wbConfig.charts.map(c => c.code),
    ])];

    fetchIndicators(codes, { startYear: 2010, endYear: 2024 })
      .then(data => { setWbData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (slug !== 'environment') return;
    fetchCambodiaClimate()
      .then(setClimateData)
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (slug !== 'finance') return;
    getLatestExchangeRates()
      .then(rows => {
        const usd = rows?.find(r => r.currency === 'USD');
        if (usd?.average) setKhrRate(Math.round(usd.average).toLocaleString());
      })
      .catch(() => {});
  }, [slug]);

  if (!cluster) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '16px' }}>Topic not found</h1>
        <Link to="/topics" style={{ color: 'var(--accent-text)', fontWeight: 600 }}>← All Topics</Link>
      </div>
    );
  }

  const Icon = LucideIcons[cluster.icon] || LucideIcons.Database;
  const staticCards = STATIC_CARDS[slug] || [];
  const khrCards = slug === 'finance' && khrRate
    ? [{ label: 'USD/KHR Rate', value: khrRate, source: 'NBC', note: 'today' }]
    : [];

  // Build WB indicator cards
  const wbCards = wbConfig ? wbConfig.indicators.map(ind => {
    const series = wbData[ind.code] || [];
    if (!series.length) return null;
    const latest = series[series.length - 1];
    const prev = series[series.length - 2];
    const change = prev && prev.value ? ((latest.value - prev.value) / Math.abs(prev.value)) * 100 : null;
    return { label: ind.label, value: ind.format(latest.value), change, source: 'World Bank', note: String(latest.year) };
  }).filter(Boolean) : [];

  // Build chart data from WB series
  const buildChartData = (chartCfg) => {
    const series = wbData[chartCfg.code] || [];
    return series.map(d => ({
      label: String(d.year),
      value: chartCfg.transform ? chartCfg.transform(d.value) : d.value,
    }));
  };

  const hasWbCharts = wbConfig && wbConfig.charts.some(c => (wbData[c.code] || []).length > 0);
  const staticCharts = STATIC_CHARTS[slug] || [];
  const showStaticCharts = !wbConfig || (!loading && !hasWbCharts);

  const allCards = [...wbCards, ...khrCards, ...staticCards];

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <Helmet>
        <title>{cluster.name} — CamData Topics</title>
        <meta name="description" content={`${cluster.description}. Real data from the World Bank and official Cambodian sources.`} />
      </Helmet>

      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link to="/topics" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> All Topics
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-xl)', background: `${cluster.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={32} color={cluster.color} />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{cluster.name}</h1>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{cluster.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

        {/* Key Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <RomduolIconOutline size={16} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Key Indicators</h2>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 0', color: 'var(--text-muted)', marginBottom: 40 }}>
            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 14 }}>Loading World Bank data…</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {allCards.map((card, i) => (
              <IndicatorCard key={i} {...card} />
            ))}
          </div>
        )}

        {/* Charts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <RomduolIconOutline size={16} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Charts</h2>
        </div>

        {wbConfig && loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 0', color: 'var(--text-muted)', marginBottom: 40 }}>
            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 14 }}>Fetching time series data…</span>
          </div>
        ) : (
          <>
            {/* World Bank charts */}
            {wbConfig && hasWbCharts && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px', marginBottom: wbConfig.charts.length > 0 ? '12px' : '40px' }}>
                {wbConfig.charts.map((chartCfg, i) => (
                  <ChartBlock
                    key={i}
                    title={chartCfg.title}
                    data={buildChartData(chartCfg)}
                    type={chartCfg.type}
                    color={cluster.color}
                    yFormat={chartCfg.yFormat}
                  />
                ))}
              </div>
            )}
            {wbConfig && hasWbCharts && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 40 }}>
                Source: World Bank Open Data · Cambodia (KHM) · 2010–2024
              </p>
            )}

            {/* NASA POWER climate charts — environment cluster only */}
            {slug === 'environment' && climateData && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px', marginBottom: '12px' }}>
                  <ChartBlock title="Mean Air Temperature by Month (°C) — 2001–2020 avg" data={climateData.temperature} type="line" color="#f97316" yFormat={v => `${v.toFixed(1)}°C`} />
                  <ChartBlock title="Average Monthly Precipitation (mm/day) — 2001–2020 avg" data={climateData.precipitation} type="bar" color="#0ea5e9" yFormat={v => `${v.toFixed(1)}`} />
                  <ChartBlock title="Solar Irradiance — All-Sky (kWh/m²/day) — 2001–2020 avg" data={climateData.solar} type="area" color="#FFCC33" yFormat={v => `${v.toFixed(2)}`} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 40 }}>
                  {climateData.attribution}
                </p>
              </>
            )}

            {/* Static charts for clusters without WB data */}
            {showStaticCharts && staticCharts.length > 0 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px', marginBottom: '12px' }}>
                  {staticCharts.map((chart, i) => (
                    <ChartBlock
                      key={i}
                      title={chart.title}
                      data={chart.data}
                      type={chart.type}
                      color={cluster.color}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 40 }}>
                  Note: Charts show estimated or historical seasonal averages pending official open data publication.
                </p>
              </>
            )}
          </>
        )}

        {/* Datasets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <RomduolIconOutline size={16} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            Datasets in this Topic
          </h2>
        </div>
        {datasets.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {datasets.map(d => (
              <Link key={d.id} to={`/datasets/${d.id}`} style={{ textDecoration: 'none' }}>
                <DataCard dataset={d} onDownload={() => {}} />
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Explore all datasets for this topic</p>
            <Link to={`/datasets?topic=${slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-text)', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
              Browse {cluster.name} datasets <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          div[style*="minmax(440px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
