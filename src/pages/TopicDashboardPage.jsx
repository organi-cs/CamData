import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DataCard } from '../components/features/DataCard';
import { RomduolIconOutline } from '../components/ui/RomduolIcon';
import { DATA_CLUSTERS, MINISTRIES } from '../types';
import '../styles/design-tokens.css';

const TOPIC_DATA = {
  finance: {
    indicators: [
      { label: 'USD/KHR Rate', value: '4,120', unit: 'KHR', change: +0.24, source: 'NBC' },
      { label: 'CSX Index', value: '481.25', unit: 'pts', change: +0.45, source: 'CSX' },
      { label: 'Total Deposits', value: '$47.2B', unit: '', change: +8.3, source: 'NBC' },
      { label: 'Microfinance Loans', value: '$9.8B', unit: '', change: +12.1, source: 'NBC' },
    ],
    chart1: {
      title: 'USD/KHR Exchange Rate (2024)',
      data: [
        { label: 'Jan', value: 4100 }, { label: 'Feb', value: 4095 }, { label: 'Mar', value: 4102 },
        { label: 'Apr', value: 4098 }, { label: 'May', value: 4105 }, { label: 'Jun', value: 4110 },
        { label: 'Jul', value: 4108 }, { label: 'Aug', value: 4115 }, { label: 'Sep', value: 4112 },
        { label: 'Oct', value: 4120 }, { label: 'Nov', value: 4118 }, { label: 'Dec', value: 4125 },
      ],
      type: 'line',
      color: '#FFCC33',
    },
    chart2: {
      title: 'CSX Market Index (2024)',
      data: [
        { label: 'Jan', value: 456 }, { label: 'Feb', value: 462 }, { label: 'Mar', value: 471 },
        { label: 'Apr', value: 465 }, { label: 'May', value: 478 }, { label: 'Jun', value: 472 },
        { label: 'Jul', value: 481 }, { label: 'Aug', value: 488 }, { label: 'Sep', value: 479 },
        { label: 'Oct', value: 481 }, { label: 'Nov', value: 476 }, { label: 'Dec', value: 492 },
      ],
      type: 'area',
      color: '#0ea5e9',
    },
  },
  agriculture: {
    indicators: [
      { label: 'Rice Exports (Jan)', value: '75,000 t', unit: '', change: +8.7, source: 'MAFF' },
      { label: 'Rubber Production', value: '182,000 t', unit: '', change: +5.2, source: 'MAFF' },
      { label: 'Cassava Yield', value: '1.15M t', unit: '', change: +6.5, source: 'MAFF' },
      { label: 'Arable Land', value: '4.2M ha', unit: '', change: +1.1, source: 'MAFF' },
    ],
    chart1: {
      title: 'Monthly Rice Exports (tonnes)',
      data: [
        { label: 'Jan', value: 45000 }, { label: 'Feb', value: 52000 }, { label: 'Mar', value: 48000 },
        { label: 'Apr', value: 55000 }, { label: 'May', value: 61000 }, { label: 'Jun', value: 58000 },
        { label: 'Jul', value: 65000 }, { label: 'Aug', value: 72000 }, { label: 'Sep', value: 68000 },
        { label: 'Oct', value: 75000 }, { label: 'Nov', value: 78000 }, { label: 'Dec', value: 82000 },
      ],
      type: 'bar',
      color: '#84CC16',
    },
    chart2: {
      title: 'Rubber Production by Year (thousand tonnes)',
      data: [
        { label: '2018', value: 145 }, { label: '2019', value: 152 }, { label: '2020', value: 148 },
        { label: '2021', value: 160 }, { label: '2022', value: 165 }, { label: '2023', value: 172 },
        { label: '2024', value: 182 },
      ],
      type: 'area',
      color: '#84CC16',
    },
  },
  tourism: {
    indicators: [
      { label: 'Angkor Visitors (Dec)', value: '158,000', unit: '', change: +17.0, source: 'APSARA' },
      { label: 'International Arrivals', value: '750,000/mo', unit: '', change: +14.5, source: 'MOT' },
      { label: 'Tourism Revenue', value: '$3.9B', unit: '', change: +22.0, source: 'MOT' },
      { label: 'Hotels Licensed', value: '4,200', unit: '', change: +3.2, source: 'MOT' },
    ],
    chart1: {
      title: 'Angkor Visitors by Month (thousands)',
      data: [
        { label: 'Jan', value: 125 }, { label: 'Feb', value: 142 }, { label: 'Mar', value: 138 },
        { label: 'Apr', value: 95 }, { label: 'May', value: 78 }, { label: 'Jun', value: 82 },
        { label: 'Jul', value: 98 }, { label: 'Aug', value: 105 }, { label: 'Sep', value: 88 },
        { label: 'Oct', value: 115 }, { label: 'Nov', value: 135 }, { label: 'Dec', value: 158 },
      ],
      type: 'area',
      color: '#A855F7',
    },
    chart2: {
      title: 'International Arrivals by Month (thousands)',
      data: [
        { label: 'Jan', value: 450 }, { label: 'Feb', value: 520 }, { label: 'Mar', value: 480 },
        { label: 'Apr', value: 550 }, { label: 'May', value: 610 }, { label: 'Jun', value: 580 },
        { label: 'Jul', value: 650 }, { label: 'Aug', value: 720 }, { label: 'Sep', value: 680 },
        { label: 'Oct', value: 750 }, { label: 'Nov', value: 690 }, { label: 'Dec', value: 810 },
      ],
      type: 'bar',
      color: '#A855F7',
    },
  },
  garment: {
    indicators: [
      { label: 'Employed Workers', value: '760,000', unit: '', change: +1.3, source: 'MIH' },
      { label: 'Export Value (Jan)', value: '$1.15B', unit: '', change: +6.7, source: 'MOC' },
      { label: 'Factories Active', value: '1,050', unit: '', change: -0.5, source: 'MIH' },
      { label: 'SEZ Occupancy', value: '82%', unit: '', change: +4.1, source: 'CSEZB' },
    ],
    chart1: {
      title: 'Garment Factory Employment (thousands)',
      data: [
        { label: 'Jan', value: 720 }, { label: 'Feb', value: 715 }, { label: 'Mar', value: 730 },
        { label: 'Apr', value: 725 }, { label: 'May', value: 740 }, { label: 'Jun', value: 738 },
        { label: 'Jul', value: 745 }, { label: 'Aug', value: 750 }, { label: 'Sep', value: 755 },
        { label: 'Oct', value: 760 }, { label: 'Nov', value: 758 }, { label: 'Dec', value: 762 },
      ],
      type: 'line',
      color: '#F97316',
    },
    chart2: {
      title: 'Monthly Garment Export Value ($M)',
      data: [
        { label: 'Jan', value: 850 }, { label: 'Feb', value: 920 }, { label: 'Mar', value: 880 },
        { label: 'Apr', value: 950 }, { label: 'May', value: 1020 }, { label: 'Jun', value: 980 },
        { label: 'Jul', value: 1050 }, { label: 'Aug', value: 1120 }, { label: 'Sep', value: 1080 },
        { label: 'Oct', value: 1150 }, { label: 'Nov', value: 1200 }, { label: 'Dec', value: 1280 },
      ],
      type: 'bar',
      color: '#F97316',
    },
  },
  'mekong-water': {
    indicators: [
      { label: 'Mekong Level (Kratie)', value: '8.0 m', unit: '', change: -2.4, source: 'MOWRAM' },
      { label: 'Tonle Sap (Phnom Penh)', value: '3.2 m', unit: '', change: -18.0, source: 'MOWRAM' },
      { label: 'Flood Alerts Active', value: '3', unit: '', change: 0, source: 'MOWRAM' },
      { label: 'Rainfall (Monthly)', value: '142 mm', unit: '', change: +12.0, source: 'MOWRAM' },
    ],
    chart1: {
      title: 'Mekong River Level at Kratie (m)',
      data: [
        { label: 'Jan', value: 4.2 }, { label: 'Feb', value: 3.8 }, { label: 'Mar', value: 3.5 },
        { label: 'Apr', value: 3.8 }, { label: 'May', value: 6.1 }, { label: 'Jun', value: 8.7 },
        { label: 'Jul', value: 11.2 }, { label: 'Aug', value: 12.8 }, { label: 'Sep', value: 13.1 },
        { label: 'Oct', value: 11.5 }, { label: 'Nov', value: 8.0 }, { label: 'Dec', value: 5.8 },
      ],
      type: 'area',
      color: '#0EA5E9',
    },
    chart2: {
      title: 'Monthly Rainfall (mm)',
      data: [
        { label: 'Jan', value: 8 }, { label: 'Feb', value: 12 }, { label: 'Mar', value: 35 },
        { label: 'Apr', value: 78 }, { label: 'May', value: 142 }, { label: 'Jun', value: 168 },
        { label: 'Jul', value: 182 }, { label: 'Aug', value: 195 }, { label: 'Sep', value: 210 },
        { label: 'Oct', value: 172 }, { label: 'Nov', value: 68 }, { label: 'Dec', value: 22 },
      ],
      type: 'bar',
      color: '#0EA5E9',
    },
  },
  'urban-mobility': {
    indicators: [
      { label: 'Daily Incidents (PP)', value: '47', unit: '', change: -4.1, source: 'MPWT' },
      { label: 'Bus Ridership/Day', value: '17,200', unit: '', change: +7.5, source: 'MPWT' },
      { label: 'Registered Vehicles', value: '3.6M', unit: '', change: +8.2, source: 'MPWT' },
      { label: 'Road Length', value: '62,000 km', unit: '', change: +2.1, source: 'MPWT' },
    ],
    chart1: {
      title: 'Daily Traffic Incidents (Phnom Penh)',
      data: [
        { label: 'Jan', value: 52 }, { label: 'Feb', value: 48 }, { label: 'Mar', value: 55 },
        { label: 'Apr', value: 41 }, { label: 'May', value: 38 }, { label: 'Jun', value: 45 },
        { label: 'Jul', value: 50 }, { label: 'Aug', value: 42 }, { label: 'Sep', value: 39 },
        { label: 'Oct', value: 47 }, { label: 'Nov', value: 44 }, { label: 'Dec', value: 48 },
      ],
      type: 'bar',
      color: '#EC4899',
    },
    chart2: {
      title: 'Public Bus Ridership (daily avg)',
      data: [
        { label: 'Jan', value: 12000 }, { label: 'Feb', value: 11500 }, { label: 'Mar', value: 13200 },
        { label: 'Apr', value: 12800 }, { label: 'May', value: 14500 }, { label: 'Jun', value: 15200 },
        { label: 'Jul', value: 14800 }, { label: 'Aug', value: 16000 }, { label: 'Sep', value: 15500 },
        { label: 'Oct', value: 17200 }, { label: 'Nov', value: 16800 }, { label: 'Dec', value: 18000 },
      ],
      type: 'line',
      color: '#EC4899',
    },
  },
};

const CLUSTER_DATASETS = {
  finance: [
    { id: 'usd-exchange-rate', title: 'USD/KHR Daily Exchange Rate', description: 'Official exchange rates from NBC.', ministry: MINISTRIES.nbc, lastUpdated: new Date().toISOString(), hasGeospatial: false, category: 'Financial Markets', sparklineData: [4100,4095,4102,4098,4105,4110,4108,4115,4112,4120], downloadCount: 12450 },
    { id: 'csx-index', title: 'CSX Stock Market Index', description: 'Daily CSX index and trading data.', ministry: MINISTRIES.nbc, lastUpdated: new Date().toISOString(), hasGeospatial: false, category: 'Financial Markets', sparklineData: [560,555,572,568,580,575,590,585,595,602], downloadCount: 6540 },
    { id: 'microfinance', title: 'Microfinance Loan Disbursements', description: 'Monthly microfinance stats by province.', ministry: MINISTRIES.nbc, lastUpdated: new Date(Date.now()-15*864e5).toISOString(), hasGeospatial: true, category: 'Financial Markets', sparklineData: [250,280,265,310,340,325,380,410,395,450], downloadCount: 2340 },
  ],
};

function ChartBlock({ chart, color }) {
  const { title, data, type } = chart;
  const ChartComponent = type === 'bar' ? BarChart : type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'bar' ? Bar : type === 'area' ? Area : Line;

  return (
    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={45} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13 }}
            cursor={{ fill: `${color}18` }}
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

export default function TopicDashboardPage() {
  const { slug } = useParams();
  const cluster = DATA_CLUSTERS.find(c => c.id === slug);
  const topicData = TOPIC_DATA[slug];
  const datasets = CLUSTER_DATASETS[slug] || [];

  if (!cluster) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '16px' }}>Topic not found</h1>
        <Link to="/topics" style={{ color: 'var(--accent-text)', fontWeight: 600 }}>← All Topics</Link>
      </div>
    );
  }

  const Icon = LucideIcons[cluster.icon] || LucideIcons.Database;

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <Helmet>
        <title>{cluster.name} — CamData Topics</title>
        <meta name="description" content={`${cluster.description}. Explore datasets and visualizations.`} />
      </Helmet>

      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link to="/topics" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            <ArrowLeft size={15} /> All Topics
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-xl)', background: `${cluster.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        {topicData ? (
          <>
            {/* Key Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <RomduolIconOutline size={16} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Key Indicators</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '40px' }}>
              {topicData.indicators.map((ind, i) => (
                <div key={i} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{ind.label}</p>
                  <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1 }}>{ind.value}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600,
                      color: ind.change > 0 ? 'var(--success)' : ind.change < 0 ? 'var(--error)' : 'var(--text-muted)'
                    }}>
                      {ind.change > 0 ? <TrendingUp size={13} /> : ind.change < 0 ? <TrendingDown size={13} /> : null}
                      {ind.change > 0 ? '+' : ''}{ind.change}%
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ind.source}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <RomduolIconOutline size={16} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Charts</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px', marginBottom: '48px' }}>
              <ChartBlock chart={topicData.chart1} color={cluster.color} />
              <ChartBlock chart={topicData.chart2} color={cluster.color} />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', marginBottom: '40px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Dashboard data for this topic is coming soon.</p>
          </div>
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
            <Link to={`/cluster/${slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-text)', fontWeight: 600, fontSize: '14px' }}>
              Browse {cluster.name} datasets <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="minmax(480px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
