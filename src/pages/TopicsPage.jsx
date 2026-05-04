import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { RomduolIcon, RomduolIconOutline } from '../components/ui/RomduolIcon';
import { DATA_CLUSTERS } from '../types';
import '../styles/design-tokens.css';

const CLUSTER_STATS = {
  'mekong-water':  { datasets: 3, liveFeeds: 2 },
  'agriculture':   { datasets: 5, liveFeeds: 0 },
  'garment':       { datasets: 4, liveFeeds: 0 },
  'tourism':       { datasets: 6, liveFeeds: 1 },
  'urban-mobility':{ datasets: 3, liveFeeds: 1 },
  'finance':       { datasets: 8, liveFeeds: 3 },
  'health':        { datasets: 4, liveFeeds: 0 },
  'environment':   { datasets: 3, liveFeeds: 1 },
  'labour':        { datasets: 3, liveFeeds: 0 },
};

export default function TopicsPage() {
  return (
    <div style={{ background: 'var(--bg-secondary, #f8fafc)', minHeight: '100vh' }}>
      <Helmet>
        <title>Topics — CamData</title>
        <meta name="description" content="Explore Cambodia's open data by topic: economy, environment, agriculture, tourism, urban mobility, and financial markets." />
      </Helmet>

      {/* Header */}
      <div style={{
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)',
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <RomduolIcon size={32} color="var(--accent-primary)" />
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Data Topics
            </h1>
          </div>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: 600 }}>
            Explore Cambodia's open datasets organized by sector. Each topic brings together related datasets, live feeds, and visualizations.
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <RomduolIconOutline size={18} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            {DATA_CLUSTERS.length} Topics Available
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {DATA_CLUSTERS.map(cluster => {
            const Icon = LucideIcons[cluster.icon] || LucideIcons.Database;
            const stats = CLUSTER_STATS[cluster.id] || { datasets: 0, liveFeeds: 0 };
            return (
              <Link
                key={cluster.id}
                to={`/cluster/${cluster.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-2xl)',
                    padding: '28px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = cluster.color;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }}
                >
                  {/* Background accent */}
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `${cluster.color}08`,
                  }} />

                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-xl)',
                    background: `${cluster.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={28} color={cluster.color} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {cluster.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {cluster.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <span><strong style={{ color: 'var(--text-primary)' }}>{stats.datasets}</strong> datasets</span>
                      {stats.liveFeeds > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
                          <strong style={{ color: 'var(--success)' }}>{stats.liveFeeds}</strong> live
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: cluster.color, fontSize: '14px', fontWeight: 600 }}>
                      Explore <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Live data shortcuts */}
        <div style={{ marginTop: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <RomduolIconOutline size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
              Live Data Feeds
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { path: '/exchange-rates', label: 'Exchange Rates', desc: 'Live KHR rates from NBC', color: '#FFCC33', icon: 'TrendingUp' },
              { path: '/air-quality', label: 'Air Quality', desc: 'Real-time AQI from WAQI', color: '#10b981', icon: 'Wind' },
              { path: '/stock-market', label: 'Stock Market', desc: 'CSX index & listed stocks', color: '#0ea5e9', icon: 'BarChart3' },
              { path: '/weather', label: 'Weather', desc: '7-day forecasts from Open-Meteo', color: '#f97316', icon: 'CloudSun' },
              { path: '/alerts', label: 'Hazard Alerts', desc: 'Floods & earthquakes from GDACS/USGS', color: '#ef4444', icon: 'AlertTriangle' },
              { path: '/provinces', label: 'Provinces', desc: '25 provinces interactive map', color: '#a855f7', icon: 'Map' },
            ].map(({ path, label, desc, color, icon }) => {
              const Icon = LucideIcons[icon] || LucideIcons.Database;
              return (
                <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.15s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = color; }}
                    onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={22} color={color} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{label}</span>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
