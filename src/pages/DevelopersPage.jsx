import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Code2, Zap, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { RomduolIcon, RomduolIconOutline } from '../components/ui/RomduolIcon';
import '../styles/design-tokens.css';

const ENDPOINTS = [
  {
    id: 'exchange',
    method: 'GET',
    path: '/api/mef/realtime-api/exchange-rate',
    title: 'Exchange Rates',
    desc: 'Real-time KHR exchange rates for 30+ currencies, sourced from the National Bank of Cambodia.',
    source: 'MEF → NBC',
    example: `{
  "status": "ok",
  "data": [
    {
      "currency_id": "USD",
      "currency": "US Dollar",
      "buy": 4110,
      "sell": 4130,
      "average": 4120
    },
    ...
  ]
}`,
  },
  {
    id: 'csx',
    method: 'GET',
    path: '/api/mef/realtime-api/csx-index',
    title: 'CSX Index',
    desc: 'Cambodia Securities Exchange market index with daily open, high, low, close, and volume.',
    source: 'MEF → CSX',
    example: `{
  "status": "ok",
  "data": {
    "value": 481.25,
    "change": 2.15,
    "change_percent": 0.45,
    "volume": 125400,
    "date": "2026-04-28"
  }
}`,
  },
  {
    id: 'csx-trade',
    method: 'GET',
    path: '/api/mef/realtime-api/csx-trade-summary',
    title: 'CSX Trade Summary',
    desc: 'Daily trade summary for all listed companies: price, change, volume.',
    source: 'MEF → CSX',
    example: `{
  "status": "ok",
  "data": [
    {
      "symbol": "PWSA",
      "price": 6200,
      "change": 50,
      "change_percent": 0.81,
      "volume": 12500
    },
    ...
  ]
}`,
  },
  {
    id: 'aqi',
    method: 'GET',
    path: '/api/waqi/feed/phnom-penh/?token=YOUR_TOKEN',
    title: 'Air Quality (Phnom Penh)',
    desc: 'Real-time AQI and pollutant data (PM2.5, PM10, O3, NO2, SO2, CO) from WAQI.',
    source: 'WAQI',
    example: `{
  "status": "ok",
  "data": {
    "aqi": 68,
    "dominentpol": "pm25",
    "iaqi": {
      "pm25": { "v": 18.5 },
      "pm10": { "v": 32.0 },
      "t": { "v": 29 },
      "h": { "v": 72 }
    },
    "time": { "s": "2026-04-28 09:00:00" }
  }
}`,
  },
  {
    id: 'datasets',
    method: 'GET',
    path: '/api/mef/public-datasets?page=1&page_size=20',
    title: 'Dataset Catalog',
    desc: 'List all public datasets from the MEF open data platform with pagination.',
    source: 'MEF',
    example: `{
  "total": 120,
  "page": 1,
  "page_size": 20,
  "data": [
    {
      "id": "pd_66a8603700604c000123e144",
      "title": "Province Population Data",
      "updated_at": "2025-12-15",
      "formats": ["csv", "json"]
    },
    ...
  ]
}`,
  },
];

const CODE_EXAMPLES = {
  js: (path) => `// JavaScript (Fetch API)
const response = await fetch('https://camdata.vercel.app${path}');
const data = await response.json();
console.log(data);`,
  python: (path) => `# Python (requests)
import requests

resp = requests.get('https://camdata.vercel.app${path}')
data = resp.json()
print(data)`,
  curl: (path) => `# cURL
curl -s 'https://camdata.vercel.app${path}' | python -m json.tool`,
};

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', background: 'var(--bg-dark, #0f172a)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '5px 10px', fontSize: '12px', fontWeight: 500,
          background: copied ? 'var(--success)' : 'rgba(255,255,255,0.1)',
          color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre style={{ margin: 0, padding: '20px', overflowX: 'auto', fontSize: '13px', lineHeight: 1.6, color: '#e2e8f0', fontFamily: 'JetBrains Mono, Fira Code, monospace' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DevelopersPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0].id);
  const [activeLang, setActiveLang] = useState('js');

  const endpoint = ENDPOINTS.find(e => e.id === activeEndpoint) || ENDPOINTS[0];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Helmet>
        <title>Developers — CamData API</title>
        <meta name="description" content="CamData API documentation. Access Cambodia's open data programmatically: exchange rates, air quality, CSX market data, and more." />
      </Helmet>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--bg-dark, #0f172a) 0%, #1e3a5f 100%)', color: '#fff', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <RomduolIcon size={32} color="var(--accent-primary, #FFCC33)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary, #FFCC33)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Developer API</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>
            CamData API Reference
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: 560, marginBottom: '32px' }}>
            Access all of Cambodia's open data endpoints programmatically. No authentication required for most endpoints.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { icon: Zap, label: 'No API Key Required', sub: 'for most endpoints' },
              { icon: Shield, label: 'Rate Limit: 1,000 req/hr', sub: 'per IP address' },
              { icon: Code2, label: 'JSON + GeoJSON', sub: 'response formats' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icon size={18} color="var(--accent-primary, #FFCC33)" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Explorer */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
          {/* Sidebar */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <RomduolIconOutline size={16} color="var(--accent-primary)" />
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Endpoints</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {ENDPOINTS.map(ep => (
                <button
                  key={ep.id}
                  onClick={() => setActiveEndpoint(ep.id)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: activeEndpoint === ep.id ? 'var(--accent-light)' : 'transparent',
                    color: activeEndpoint === ep.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                    border: `1px solid ${activeEndpoint === ep.id ? 'var(--accent-primary)' : 'transparent'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeEndpoint === ep.id ? 600 : 500,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 6px',
                      background: 'var(--success-bg)', color: 'var(--success)',
                      borderRadius: 'var(--radius-sm)', letterSpacing: '0.5px',
                    }}>
                      GET
                    </span>
                    {ep.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '28px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{endpoint.title}</h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>{endpoint.desc}</p>
                </div>
                <span style={{ fontSize: '12px', padding: '4px 10px', background: 'var(--accent-light)', color: 'var(--accent-text)', borderRadius: 'var(--radius-full)', fontWeight: 500, flexShrink: 0 }}>
                  Source: {endpoint.source}
                </span>
              </div>

              {/* Endpoint URL */}
              <div style={{ background: 'var(--bg-dark, #0f172a)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success)', background: 'var(--success-bg)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>GET</span>
                <code style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {endpoint.path}
                </code>
              </div>
            </div>

            {/* Code examples */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <RomduolIconOutline size={16} color="var(--accent-primary)" />
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Code Examples</p>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {[{ id: 'js', label: 'JavaScript' }, { id: 'python', label: 'Python' }, { id: 'curl', label: 'cURL' }].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveLang(id)}
                    style={{
                      padding: '7px 14px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                      background: activeLang === id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: activeLang === id ? 'var(--accent-text)' : 'var(--text-secondary)',
                      border: `1px solid ${activeLang === id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <CodeBlock code={CODE_EXAMPLES[activeLang](endpoint.path)} />
            </div>

            {/* Example Response */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <RomduolIconOutline size={16} color="var(--accent-primary)" />
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Example Response</p>
              </div>
              <CodeBlock code={endpoint.example} />
            </div>
          </div>
        </div>

        {/* Rate limits & notes */}
        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--info-bg)', border: '1px solid var(--info)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--info)', marginBottom: '8px' }}>WAQI API Key</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Air quality endpoints require a free WAQI token. Get yours at{' '}
              <a href="https://aqicn.org/data-platform/token/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--info)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                aqicn.org <ExternalLink size={12} />
              </a>
            </p>
          </div>
          <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--warning)', marginBottom: '8px' }}>Rate Limits</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Please limit requests to 1,000/hr per IP. For higher volume access, use the source APIs directly.
            </p>
          </div>
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--success)', marginBottom: '8px' }}>Data License</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Most MEF datasets are published under CC-BY 4.0. Please attribute the source ministry when using this data.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 280px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
