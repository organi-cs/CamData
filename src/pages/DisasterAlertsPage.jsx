import React, { useEffect, useState } from 'react';
import { AlertTriangle, Waves, Activity, Wind, Flame, RefreshCw, ExternalLink, FileText } from 'lucide-react';
import { RomduolIcon } from '../components/ui/RomduolIcon';
import { getDisasterAlerts } from '../services/supabaseData';
import { fetchCambodiaReports } from '../services/reliefWebApi';
import '../styles/design-tokens.css';

const EVENT_CONFIG = {
  flood:      { label: 'Flood',      icon: Waves,         color: '#0ea5e9' },
  earthquake: { label: 'Earthquake', icon: Activity,      color: '#f97316' },
  cyclone:    { label: 'Cyclone',    icon: Wind,          color: '#a855f7' },
  wildfire:   { label: 'Wildfire',   icon: Flame,         color: '#ef4444' },
  drought:    { label: 'Drought',    icon: AlertTriangle, color: '#eab308' },
  volcano:    { label: 'Volcano',    icon: AlertTriangle, color: '#dc2626' },
  unknown:    { label: 'Alert',      icon: AlertTriangle, color: '#64748b' },
};

const SEVERITY_COLOR = {
  red:      '#ef4444',
  orange:   '#f97316',
  green:    '#10b981',
  moderate: '#f97316',
  strong:   '#ef4444',
  minor:    '#10b981',
  light:    '#10b981',
};

function severityColor(severity) {
  return SEVERITY_COLOR[severity?.toLowerCase()] ?? '#64748b';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const FILTERS = ['all', 'flood', 'earthquake', 'cyclone', 'wildfire'];

export default function DisasterAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.allSettled([
      getDisasterAlerts({ days: 60 }),
      fetchCambodiaReports({ limit: 6 }),
    ]).then(([alertsResult, reportsResult]) => {
      if (!active) return;
      if (alertsResult.status === 'fulfilled') setAlerts(alertsResult.value ?? []);
      if (reportsResult.status === 'fulfilled') setReports(reportsResult.value ?? []);
    }).catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.event_type === filter);

  const countByType = alerts.reduce((acc, a) => {
    acc[a.event_type] = (acc[a.event_type] ?? 0) + 1;
    return acc;
  }, {});

  const countBySeverity = {
    red:    alerts.filter((a) => a.severity === 'red').length,
    orange: alerts.filter((a) => a.severity === 'orange').length,
    green:  alerts.filter((a) => a.severity === 'green' || a.severity === 'minor' || a.severity === 'light').length,
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <RomduolIcon size={28} color="var(--accent-primary)" />
            <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Disaster & Hazard Alerts
            </h1>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            Active alerts for the Mekong region from{' '}
            <a href="https://www.gdacs.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>GDACS</a>
            {' '}(UN) and{' '}
            <a href="https://earthquake.usgs.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>USGS</a>
            {' '}· Last 60 days
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <RefreshCw size={32} style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Loading alerts…</p>
          </div>
        ) : error ? (
          <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', borderRadius: 12, padding: 16 }}>
            <p style={{ color: 'var(--warning)', margin: 0 }}>{error}</p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
              {[
                { label: 'Total alerts', value: alerts.length, color: 'var(--accent-primary)' },
                { label: 'High severity', value: countBySeverity.red, color: '#ef4444' },
                { label: 'Medium', value: countBySeverity.orange, color: '#f97316' },
                { label: 'Low', value: countBySeverity.green, color: '#10b981' },
                { label: 'Floods', value: countByType.flood ?? 0, color: '#0ea5e9' },
                { label: 'Earthquakes', value: countByType.earthquake ?? 0, color: '#f97316' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 12, padding: '16px 20px' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 28, fontWeight: 700, color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {FILTERS.map((f) => {
                const cfg = EVENT_CONFIG[f] ?? EVENT_CONFIG.unknown;
                const count = f === 'all' ? alerts.length : (countByType[f] ?? 0);
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: `1px solid ${filter === f ? cfg.color : 'var(--border-light)'}`,
                      background: filter === f ? `${cfg.color}18` : 'transparent',
                      color: filter === f ? cfg.color : 'var(--text-secondary)',
                      fontWeight: filter === f ? 600 : 400,
                      fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    {f === 'all' ? 'All' : cfg.label} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>

            {/* Alert cards */}
            {filtered.length === 0 ? (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                  {alerts.length === 0
                    ? 'No alerts in the last 60 days. Run the ingest-disasters edge function to populate data.'
                    : `No ${filter} alerts in the last 60 days.`}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((alert) => {
                  const cfg = EVENT_CONFIG[alert.event_type] ?? EVENT_CONFIG.unknown;
                  const EventIcon = cfg.icon;
                  const sColor = severityColor(alert.severity);
                  const mag = alert.severity_score;

                  return (
                    <div
                      key={alert.id}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderLeft: `4px solid ${sColor}`,
                        borderRadius: 12,
                        padding: '18px 20px',
                        display: 'flex',
                        gap: 16,
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <EventIcon size={20} color={cfg.color} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {alert.title}
                          </span>
                          {alert.severity && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: sColor, background: `${sColor}18`, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase' }}>
                              {alert.severity}
                            </span>
                          )}
                          {mag != null && (
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              {alert.event_type === 'earthquake' ? `M${Number(mag).toFixed(1)}` : `Score: ${Number(mag).toFixed(1)}`}
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.5 }}>
                          {alert.description ?? alert.region ?? '—'}
                        </p>

                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <span>{formatDate(alert.event_date)}</span>
                          {alert.country && <span>📍 {alert.country}</span>}
                          <span style={{ background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: 6 }}>{alert.source}</span>
                          {alert.url && (
                            <a href={alert.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              Details <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ReliefWeb reports */}
            {reports.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <FileText size={18} color="var(--accent-primary)" />
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Latest Reports — Cambodia
                  </h2>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>via ReliefWeb (UN OCHA)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {reports.map((report) => (
                    <a
                      key={report.id}
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 10,
                        padding: '14px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                        textDecoration: 'none',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', margin: 0, marginBottom: 4 }}>
                          {report.title}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                          {report.type} · {report.source}
                          {report.date && ` · ${new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`}
                        </p>
                      </div>
                      <ExternalLink size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Attribution */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, fontSize: 13, color: 'var(--text-muted)', marginTop: 32 }}>
              <strong>Data sources:</strong>{' '}
              <a href="https://www.gdacs.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>GDACS</a>
              {' '}(UN OCHA), {' '}
              <a href="https://earthquake.usgs.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>USGS</a>
              {' '}Earthquake Catalog, and{' '}
              <a href="https://reliefweb.int" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>ReliefWeb</a>
              {' '}(UN OCHA). All free, public-domain, non-commercial.
            </div>
          </>
        )}
      </div>
      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
