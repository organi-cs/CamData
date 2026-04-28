import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { getCSXIndex, getCSXStocks, getCSXTradeSummary } from '../services/csxApi';
import { RomduolIcon } from '../components/ui/RomduolIcon';
import '../styles/design-tokens.css';

export default function StockMarketPage() {
  const [index, setIndex] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from CSX service (static data)
    const indexData = getCSXIndex();
    const stocksData = getCSXStocks();
    const summaryData = getCSXTradeSummary();

    setIndex(indexData);
    setStocks(stocksData);
    setSummary(summaryData);
    setLoading(false);
  }, []);

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp size={16} />;
    if (change < 0) return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'var(--success, #10b981)';
    if (change < 0) return 'var(--error, #ef4444)';
    return 'var(--text-muted, #94a3b8)';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <RomduolIcon size={28} color="var(--accent-primary)" />
            <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Stock Market
            </h1>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            Cambodia Securities Exchange (CSX) • {stocks.length} Listed Companies
          </p>
        </div>

        {/* Index Card */}
        {index && (
          <div style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
            borderRadius: 20,
            padding: 32,
            marginBottom: 32,
            color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <BarChart3 size={20} />
              <span style={{ fontSize: 14, opacity: 0.7 }}>CSX Index</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
              <span style={{ fontSize: 56, fontWeight: 800 }}>
                {index.value.toFixed(2)}
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: index.change >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: index.change >= 0 ? '#4ade80' : '#f87171',
              }}>
                {getChangeIcon(index.change)}
                <span style={{ fontWeight: 600 }}>
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32, fontSize: 13, opacity: 0.7 }}>
              <span>Volume: {formatPrice(index.volume)}</span>
              <span>Last updated: {new Date(index.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Market Summary Cards */}
        {summary && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}>
            <div style={{ background: 'var(--success-bg)', borderRadius: 12, padding: 20, borderLeft: '4px solid var(--success)' }}>
              <p style={{ fontSize: 13, color: 'var(--success)', marginBottom: 4 }}>Gainers</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--success)' }}>{summary.gainers}</p>
            </div>
            <div style={{ background: 'var(--error-bg)', borderRadius: 12, padding: 20, borderLeft: '4px solid var(--error)' }}>
              <p style={{ fontSize: 13, color: 'var(--error)', marginBottom: 4 }}>Losers</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--error)' }}>{summary.losers}</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, borderLeft: '4px solid var(--text-muted)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Unchanged</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-secondary)' }}>{summary.unchanged}</p>
            </div>
            <div style={{ background: 'var(--accent-light)', borderRadius: 12, padding: 20, borderLeft: '4px solid var(--accent-primary)' }}>
              <p style={{ fontSize: 13, color: 'var(--accent-text)', marginBottom: 4 }}>Total Volume</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-text)' }}>{formatPrice(summary.totalVolume)}</p>
            </div>
          </div>
        )}

        {/* Stocks Table */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-light)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          <div style={{ padding: 20, borderBottom: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Listed Companies
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Symbol</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Company</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Sector</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Price (KHR)</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Change</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, i) => (
                  <tr key={stock.symbol} style={{
                    borderTop: '1px solid var(--border-light)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
                  }}>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        background: 'var(--accent-light)',
                        padding: '4px 8px',
                        borderRadius: 6,
                      }}>
                        {stock.symbol}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{stock.name}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        background: 'var(--bg-tertiary)',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}>
                        {stock.sector}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                      ៛{formatPrice(stock.price)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontWeight: 600,
                        color: getChangeColor(stock.change),
                      }}>
                        {getChangeIcon(stock.change)}
                        {stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {formatPrice(stock.volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 12,
          padding: 16,
          marginTop: 24,
          fontSize: 13,
          color: 'var(--text-muted)',
        }}>
          <strong>Note:</strong> CSX does not provide a public API. This data is for demonstration purposes
          and may not reflect real-time market conditions. For live data, visit{' '}
          <a href="https://csx.com.kh" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-text)' }}>
            csx.com.kh
          </a>
        </div>
      </div>
    </div>
  );
}