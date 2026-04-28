import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Code2, Zap, Shield, Database } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { RomduolIcon, RomduolIconOutline } from '../components/ui/RomduolIcon';
import '../styles/design-tokens.css';

const CAMDATA_BASE_URL = 'https://camdata.vercel.app';
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';

const ENDPOINTS = [
  {
    id: 'exchange-proxy',
    method: 'GET',
    path: '/api/mef/realtime-api/exchange-rate',
    baseUrl: CAMDATA_BASE_URL,
    title: 'Exchange Rates Proxy',
    desc: 'Current exchange rate snapshot proxied through CamData.',
    source: 'MEF -> NBC',
    auth: 'No auth required',
    example: `{
  "status": "ok",
  "data": [
    {
      "currency_id": "USD",
      "currency": "US Dollar",
      "buy": 4110,
      "sell": 4130,
      "average": 4120
    }
  ]
}`,
  },
  {
    id: 'datasets-rest',
    method: 'GET',
    path: '/rest/v1/mef_datasets?select=*&order=title.asc',
    baseUrl: SUPABASE_URL,
    title: 'Dataset Catalog (Supabase)',
    desc: 'Curated dataset metadata served directly from the mef_datasets table.',
    source: 'Supabase PostgREST',
    auth: 'Anon key required',
    example: `[
  {
    "id": "usd-exchange-rate",
    "title": "USD/KHR Daily Exchange Rate",
    "cluster_id": "finance",
    "formats": ["CSV"],
    "last_updated": "2026-04-28"
  }
]`,
  },
  {
    id: 'exchange-rest',
    method: 'GET',
    path: '/rest/v1/exchange_rates?currency_id=eq.USD&order=date.desc&limit=30',
    baseUrl: SUPABASE_URL,
    title: 'Exchange Rate History (Supabase)',
    desc: 'Historical daily exchange rate snapshots for charting and analytics.',
    source: 'Supabase PostgREST',
    auth: 'Anon key required',
    example: `[
  {
    "date": "2026-04-28",
    "currency_id": "USD",
    "average": 4120,
    "bid": 4110,
    "ask": 4130
  }
]`,
  },
  {
    id: 'air-quality-rest',
    method: 'GET',
    path: '/rest/v1/air_quality_readings?station_id=eq.phnom-penh&order=recorded_at.desc&limit=12',
    baseUrl: SUPABASE_URL,
    title: 'Air Quality History (Supabase)',
    desc: 'Station snapshots ingested from WAQI and stored in air_quality_readings.',
    source: 'Supabase PostgREST',
    auth: 'Anon key required',
    example: `[
  {
    "station_id": "phnom-penh",
    "station_name": "Phnom Penh",
    "aqi": 68,
    "pm25": 18.5,
    "recorded_at": "2026-04-28T09:00:00Z"
  }
]`,
  },
];

function buildExampleUrl(endpoint) {
  return `${endpoint.baseUrl}${endpoint.path}`;
}

function buildCodeExample(language, endpoint) {
  const url = buildExampleUrl(endpoint);
  const needsAnonKey = endpoint.baseUrl === SUPABASE_URL;

  if (language === 'python') {
    return needsAnonKey
      ? `import os
import requests

url = "${url}"
headers = {
    "apikey": os.environ["SUPABASE_ANON_KEY"],
    "Authorization": f"Bearer {os.environ['SUPABASE_ANON_KEY']}",
}

resp = requests.get(url, headers=headers)
print(resp.json())`
      : `import requests

resp = requests.get("${url}")
print(resp.json())`;
  }

  if (language === 'curl') {
    return needsAnonKey
      ? `curl "${url}" \\
  -H "apikey: $SUPABASE_ANON_KEY" \\
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"`
      : `curl "${url}"`;
  }

  return needsAnonKey
    ? `const response = await fetch("${url}", {
  headers: {
    apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
    Authorization: \`Bearer \${process.env.REACT_APP_SUPABASE_ANON_KEY}\`,
  },
});

const data = await response.json();
console.log(data);`
    : `const response = await fetch("${url}");
const data = await response.json();
console.log(data);`;
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--bg-dark, #0f172a)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 10px',
          fontSize: '12px',
          fontWeight: 500,
          background: copied ? 'var(--success)' : 'rgba(255,255,255,0.1)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre
        style={{
          margin: 0,
          padding: 20,
          overflowX: 'auto',
          fontSize: '13px',
          lineHeight: 1.6,
          color: '#e2e8f0',
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DevelopersPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0].id);
  const [activeLang, setActiveLang] = useState('js');

  const endpoint = ENDPOINTS.find((entry) => entry.id === activeEndpoint) || ENDPOINTS[0];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Helmet>
        <title>Developers - CamData API</title>
        <meta
          name="description"
          content="CamData developer documentation for proxy endpoints and Supabase REST tables including exchange_rates, air_quality_readings, and mef_datasets."
        />
      </Helmet>

      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg-dark, #0f172a) 0%, #1e3a5f 100%)',
          color: '#fff',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <RomduolIcon size={32} color="var(--accent-primary, #FFCC33)" />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent-primary, #FFCC33)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Developer API
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 16 }}>
            CamData API Reference
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: 620, marginBottom: 32 }}>
            Proxy endpoints are still available, and Supabase now exposes read-only REST tables for
            historical exchange rates, stored air quality readings, and the dataset catalog.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: Zap, label: 'Proxy + PostgREST', sub: 'choose live or stored data' },
              { icon: Shield, label: 'RLS-protected tables', sub: 'anon key for public reads' },
              { icon: Database, label: 'Historical snapshots', sub: 'exchange + air quality' },
              { icon: Code2, label: 'JSON-first', sub: 'simple browser and server access' },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
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

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <RomduolIconOutline size={16} color="var(--accent-primary)" />
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: 0,
                }}
              >
                Endpoints
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ENDPOINTS.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setActiveEndpoint(entry.id)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: activeEndpoint === entry.id ? 'var(--accent-light)' : 'transparent',
                    color: activeEndpoint === entry.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                    border: `1px solid ${activeEndpoint === entry.id ? 'var(--accent-primary)' : 'transparent'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeEndpoint === entry.id ? 600 : 500,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        background: 'var(--success-bg)',
                        color: 'var(--success)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      GET
                    </span>
                    {entry.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: 28,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {endpoint.title}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                    {endpoint.desc}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: 'var(--accent-light)',
                    color: 'var(--accent-text)',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {endpoint.source}
                </span>
              </div>

              <div
                style={{
                  background: 'var(--bg-dark, #0f172a)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--success)',
                    background: 'var(--success-bg)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    flexShrink: 0,
                  }}
                >
                  GET
                </span>
                <code
                  style={{
                    fontSize: '13px',
                    color: '#e2e8f0',
                    fontFamily: 'JetBrains Mono, monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {buildExampleUrl(endpoint)}
                </code>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Auth: <strong>{endpoint.auth}</strong>
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <RomduolIconOutline size={16} color="var(--accent-primary)" />
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: 0,
                  }}
                >
                  Code Examples
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[{ id: 'js', label: 'JavaScript' }, { id: 'python', label: 'Python' }, { id: 'curl', label: 'cURL' }].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveLang(id)}
                    style={{
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
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
              <CodeBlock code={buildCodeExample(activeLang, endpoint)} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <RomduolIconOutline size={16} color="var(--accent-primary)" />
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: 0,
                  }}
                >
                  Example Response
                </p>
              </div>
              <CodeBlock code={endpoint.example} />
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          <div style={{ background: 'var(--info-bg)', border: '1px solid var(--info)', borderRadius: 'var(--radius-xl)', padding: 20 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--info)', marginBottom: 8 }}>
              Supabase Headers
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              PostgREST reads need the project anon key in both the <code>apikey</code> and
              <code> Authorization</code> headers.
            </p>
          </div>
          <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-xl)', padding: 20 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--warning)', marginBottom: 8 }}>
              Historical Data Freshness
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Exchange rates and air quality history depend on scheduled Supabase Edge Functions being deployed and enabled.
            </p>
          </div>
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', borderRadius: 'var(--radius-xl)', padding: 20 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--success)', marginBottom: 8 }}>
              Data Licensing
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Keep source attribution to the relevant Cambodian ministry or NBC when republishing API results.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 20, fontSize: '13px', color: 'var(--text-muted)' }}>
          Supabase project base URL:{' '}
          <a href={SUPABASE_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-text)' }}>
            {SUPABASE_URL} <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <style>{'@media (max-width: 900px) { div[style*="grid-template-columns: 280px"] { grid-template-columns: 1fr !important; } }'}</style>
    </div>
  );
}
