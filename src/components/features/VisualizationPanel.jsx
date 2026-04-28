import React, { useState } from 'react';
import { BarChart3, Map, Table, Maximize2, Minimize2 } from 'lucide-react';
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RomduolLoader } from '../ui/RomduolLoader';

export function VisualizationPanel({ data = [], config = {}, title = 'Data Visualization' }) {
  const { defaultView = 'chart', chartType = 'bar', mapConfig } = config;
  const [activeView, setActiveView] = useState(defaultView);
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { id: 'chart', label: 'Chart', icon: BarChart3 },
    { id: 'map', label: 'Map', icon: Map, disabled: !mapConfig },
    { id: 'table', label: 'Table', icon: Table },
  ];

  const renderChart = () => {
    if (!data || data.length === 0) {
      return <EmptyState icon={BarChart3} message="No data available" />;
    }

    const color = '#FFCC33';
    const valueKey = Object.keys(data[0]).find(k => typeof data[0][k] === 'number') || 'value';
    const labelKey = Object.keys(data[0]).find(k => typeof data[0][k] === 'string') || 'label';

    const chartData = data.map(d => ({ label: d[labelKey], value: d[valueKey] }));

    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 16, left: 0, bottom: 0 },
    };

    const commonAxis = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light, #e2e8f0)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted, #94a3b8)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted, #94a3b8)' }} axisLine={false} tickLine={false} width={45} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-primary, #fff)',
            border: '1px solid var(--border-light, #e2e8f0)',
            borderRadius: 8,
            fontSize: 13,
          }}
          cursor={{ fill: `${color}18` }}
        />
      </>
    );

    return (
      <ResponsiveContainer width="100%" height={isExpanded ? 380 : 240}>
        {chartType === 'line' ? (
          <LineChart {...commonProps}>
            {commonAxis}
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 5, fill: color }} />
          </LineChart>
        ) : chartType === 'area' ? (
          <AreaChart {...commonProps}>
            {commonAxis}
            <Area type="monotone" dataKey="value" stroke={color} fill={`${color}20`} strokeWidth={2} dot={false} />
          </AreaChart>
        ) : (
          <BarChart {...commonProps}>
            {commonAxis}
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  const renderMap = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 240 }}>
      {mapConfig ? (
        <div style={{
          width: '100%', height: isExpanded ? 380 : 240,
          background: 'linear-gradient(135deg, #dbeafe 0%, #bae6fd 100%)',
          borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center', color: '#1e40af' }}>
            <Map size={32} />
            <p style={{ marginTop: 8, fontSize: 14, fontWeight: 600 }}>Interactive Map</p>
            <p style={{ fontSize: 12, color: '#3b82f6', marginTop: 4 }}>Leaflet map renders in provinces page</p>
          </div>
        </div>
      ) : (
        <EmptyState icon={Map} message="No geospatial data available" />
      )}
    </div>
  );

  const renderTable = () => {
    if (!data || data.length === 0) return <EmptyState icon={Table} message="No data available" />;
    const columns = Object.keys(data[0] || {});
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary, #f8fafc)' }}>
              {columns.map(col => (
                <th key={col} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '2px solid var(--border-light)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, isExpanded ? data.length : 8).map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)' }}>
                {columns.map(col => (
                  <td key={col} style={{ padding: '9px 14px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                    {typeof row[col] === 'number' ? row[col].toLocaleString() : row[col]?.toString() || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!isExpanded && data.length > 8 && (
          <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            Showing 8 of {data.length} rows · click Expand to see all
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      {/* Tab header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-lg)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', fontSize: '13px',
                fontWeight: activeView === tab.id ? 600 : 500,
                color: tab.disabled ? 'var(--text-muted)' : activeView === tab.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                background: activeView === tab.id ? 'var(--accent-primary)' : 'transparent',
                border: 'none', borderRadius: 'var(--radius-md)',
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                opacity: tab.disabled ? 0.5 : 1,
              }}
              onClick={() => !tab.disabled && setActiveView(tab.id)}
              disabled={tab.disabled}
            >
              <tab.icon size={14} />
              <span className="hidden-mobile">{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', fontSize: '12px', color: 'var(--text-secondary)', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        {activeView === 'chart' && renderChart()}
        {activeView === 'map' && renderMap()}
        {activeView === 'table' && renderTable()}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--text-muted)', gap: '10px' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={24} />
      </div>
      <p style={{ fontSize: 13 }}>{message}</p>
    </div>
  );
}

export default VisualizationPanel;
