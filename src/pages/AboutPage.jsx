import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Globe, Shield, Code2, ExternalLink, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { RomduolIcon, RomduolIconOutline } from '../components/ui/RomduolIcon';
import '../styles/design-tokens.css';

const DATA_SOURCES = [
  {
    name: 'Ministry of Economy & Finance',
    abbr: 'MEF / data.mef.gov.kh',
    desc: 'Exchange rates, CSX market data, public datasets, economic statistics.',
    url: 'https://data.mef.gov.kh',
    color: '#FFCC33',
  },
  {
    name: 'World Air Quality Index',
    abbr: 'WAQI / aqicn.org',
    desc: 'Real-time air quality measurements for Cambodian cities.',
    url: 'https://aqicn.org',
    color: '#10b981',
  },
  {
    name: 'Cambodia Securities Exchange',
    abbr: 'CSX / csx.com.kh',
    desc: 'Listed company data and historical market information.',
    url: 'https://csx.com.kh',
    color: '#0ea5e9',
  },
  {
    name: 'World Bank Open Data',
    abbr: 'World Bank API',
    desc: 'Macroeconomic indicators: GDP, inflation, poverty, demographics.',
    url: 'https://data.worldbank.org',
    color: '#a855f7',
  },
];

const PRINCIPLES = [
  { icon: Globe, title: 'Open by Default', desc: 'All datasets on CamData are freely accessible. No registration required to browse, preview, or download data.' },
  { icon: Shield, title: 'Official Sources', desc: 'Every dataset is sourced from official Cambodian government APIs and internationally recognized data providers.' },
  { icon: Database, title: 'Machine Readable', desc: 'Data is available in CSV, JSON, and GeoJSON formats — ready for analysis in Python, R, Excel, or any tool.' },
  { icon: Code2, title: 'Developer Friendly', desc: 'All data sources are accessible via API. Full documentation and code examples are available for developers.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Helmet>
        <title>About CamData — Cambodia's Open Data Portal</title>
        <meta name="description" content="CamData is Cambodia's open data portal, providing free access to government datasets on exchange rates, air quality, agriculture, tourism, and more." />
      </Helmet>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(180deg, var(--accent-light, #fff5cc) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border-light)',
        padding: '80px 24px 64px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <RomduolIcon size={36} color="var(--accent-primary)" />
          <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>CamData</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.3 }}>
          Cambodia's Open Data Portal
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto' }}>
          Making Cambodian government data accessible, understandable, and useful for researchers, journalists, developers, and citizens.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
        {/* Mission */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <RomduolIconOutline size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Mission</h2>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-2xl)', padding: '32px', borderLeft: '4px solid var(--accent-primary)' }}>
            <p style={{ fontSize: '18px', color: 'var(--text-primary)', lineHeight: 1.8, margin: 0 }}>
              CamData was built to close the gap between Cambodia's rich public datasets and the people who need them. Unlike many data portals, CamData works without a custom backend — it proxies directly to official government APIs and open data providers, ensuring you always get the most current data.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <RomduolIconOutline size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Principles</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
            {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-light)', display: 'flex', gap: '16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="var(--accent-text)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <RomduolIconOutline size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Data Sources</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DATA_SOURCES.map(src => (
              <div key={src.name} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: src.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{src.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{src.abbr}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{src.desc}</div>
                </div>
                <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--accent-text)', fontWeight: 500, flexShrink: 0 }}>
                  Visit <ExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Architecture */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <RomduolIconOutline size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Technical Architecture</h2>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-light)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '12px' }}>CamData is a React 18 single-page application hosted on Vercel. It uses Vercel rewrites to proxy API requests to data sources, eliminating the need for a custom backend and ensuring zero server maintenance cost.</p>
            <p style={{ marginBottom: '12px' }}>The tech stack: <strong>React 18</strong> · <strong>React Router 6</strong> · <strong>Recharts</strong> for visualizations · <strong>React-Leaflet</strong> for maps · <strong>Lucide</strong> for icons · vanilla CSS custom properties for theming.</p>
            <p style={{ margin: 0 }}>The design system uses the "Romduol Tech" palette, inspired by Cambodia's national flower (Rumdul). All colors are CSS custom properties, supporting seamless light/dark mode switching.</p>
          </div>
        </section>

        {/* Built by */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <RomduolIconOutline size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Built By</h2>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>Samputhy Khim</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Building tools for Cambodia's digital future</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://github.com/organi-cs/camdata" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                GitHub <ExternalLink size={14} />
              </a>
              <Link to="/developers" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'var(--accent-primary)', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', color: 'var(--accent-text)', fontWeight: 600 }}>
                API Docs <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="minmax(380px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
