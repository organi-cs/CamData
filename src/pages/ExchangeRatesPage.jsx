import React, { useEffect, useState } from 'react';
import { Search, Download, RefreshCw, TrendingUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';
import { getExchangeRateHistory, getLatestExchangeRates } from '../services/supabaseData';
import '../styles/design-tokens.css';

const HISTORICAL_USD_FALLBACK = [
  { label: 'Jan', rate: 4100 },
  { label: 'Feb', rate: 4095 },
  { label: 'Mar', rate: 4102 },
  { label: 'Apr', rate: 4098 },
  { label: 'May', rate: 4105 },
  { label: 'Jun', rate: 4110 },
  { label: 'Jul', rate: 4108 },
  { label: 'Aug', rate: 4115 },
  { label: 'Sep', rate: 4112 },
  { label: 'Oct', rate: 4120 },
  { label: 'Nov', rate: 4118 },
  { label: 'Dec', rate: 4125 },
];

function formatHistoryPoint(point) {
  const date = new Date(`${point.date}T00:00:00`);
  return {
    label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: point.date,
    rate: point.average,
  };
}

export default function ExchangeRatesPage() {
  const [rates, setRates] = useState([]);
  const [history, setHistory] = useState(HISTORICAL_USD_FALLBACK);
  const [historySource, setHistorySource] = useState('fallback');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [amount, setAmount] = useState(100);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [storedRates, storedHistory] = await Promise.all([
          getLatestExchangeRates(),
          getExchangeRateHistory('USD', 365),
        ]);

        if (!active) return;

        if (storedRates?.length) {
          setRates(storedRates);
        } else {
          const fallbackRates = await api.getExchangeRates();
          if (active && fallbackRates && Array.isArray(fallbackRates)) {
            setRates(fallbackRates);
          }
        }

        if (storedHistory?.length) {
          setHistory(storedHistory.map(formatHistoryPoint));
          setHistorySource('supabase');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredRates = rates.filter((rate) =>
    rate.currency_id?.toLowerCase().includes(search.toLowerCase()) ||
    rate.currency?.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedRate = rates.find((rate) => rate.currency_id === selectedCurrency);
  const convertedAmount = selectedRate ? amount * selectedRate.average : 0;

  const majorCurrencies = ['USD', 'EUR', 'GBP', 'THB', 'CNY', 'JPY', 'AUD', 'SGD'];
  const majorRates = rates.filter((rate) => majorCurrencies.includes(rate.currency_id));

  const handleExportCSV = () => {
    const csv = `Currency,Name,Bid,Ask,Average\n${rates.map((rate) =>
      `${rate.currency_id},${rate.currency},${rate.bid},${rate.ask},${rate.average}`).join('\n')}`;
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'exchange_rates.csv',
    });
    link.click();
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <Helmet>
        <title>Exchange Rates - CamData</title>
        <meta
          name="description"
          content="Daily KHR exchange rates sourced from the National Bank of Cambodia and historical snapshots stored in Supabase."
        />
      </Helmet>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <TrendingUp size={28} color="var(--accent-primary, #FFCC33)" />
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Exchange Rates
          </h1>
        </div>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
          National Bank of Cambodia rates with Supabase-backed daily history
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <RefreshCw
            size={28}
            style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }}
          />
          <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Loading rates...</p>
        </div>
      ) : (
        <>
          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 16,
              padding: '24px 24px 16px',
              marginBottom: 28,
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}
            >
              USD/KHR - Last 365 days
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              {historySource === 'supabase'
                ? 'Daily averages served from stored exchange_rate snapshots.'
                : 'Showing bundled fallback values until Supabase history is populated.'}
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={history} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  width={54}
                />
                <Tooltip
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                  formatter={(value) => [`KHR ${Number(value).toLocaleString()}`, 'Average']}
                  contentStyle={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--accent-primary, #FFCC33)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 16,
              padding: 28,
              marginBottom: 28,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 20,
              }}
            >
              Currency Converter
            </h2>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="number"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                style={{
                  padding: '12px 16px',
                  fontSize: 18,
                  border: '1px solid var(--border-light)',
                  borderRadius: 8,
                  width: 150,
                  outline: 'none',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              />
              <select
                value={selectedCurrency}
                onChange={(event) => setSelectedCurrency(event.target.value)}
                style={{
                  padding: '12px 16px',
                  fontSize: 16,
                  border: '1px solid var(--border-light)',
                  borderRadius: 8,
                  outline: 'none',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              >
                {rates.map((rate) => (
                  <option key={rate.currency_id} value={rate.currency_id}>
                    {rate.currency_id} - {rate.currency}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: 22, color: 'var(--text-muted)' }}>=</span>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
                KHR {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>

          {majorRates.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 14,
                }}
              >
                Major Currencies
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 14,
                }}
              >
                {majorRates.map((rate) => (
                  <div
                    key={rate.currency_id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 12,
                      padding: 18,
                    }}
                  >
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {rate.currency_id}
                    </p>
                    <p
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: 4,
                      }}
                    >
                      KHR {rate.average?.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rate.currency}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 14,
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                All Currencies ({filteredRates.length})
              </h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={15}
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    style={{
                      padding: '8px 10px 8px 32px',
                      fontSize: 13,
                      border: '1px solid var(--border-light)',
                      borderRadius: 8,
                      outline: 'none',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      width: 180,
                    }}
                  />
                </div>
                <button
                  onClick={handleExportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    fontSize: 13,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Download size={15} /> CSV
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    <th
                      style={{
                        padding: '11px 24px',
                        textAlign: 'left',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                      }}
                    >
                      Code
                    </th>
                    <th
                      style={{
                        padding: '11px 24px',
                        textAlign: 'left',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                      }}
                    >
                      Currency
                    </th>
                    <th
                      style={{
                        padding: '11px 24px',
                        textAlign: 'right',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                      }}
                    >
                      Bid
                    </th>
                    <th
                      style={{
                        padding: '11px 24px',
                        textAlign: 'right',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                      }}
                    >
                      Ask
                    </th>
                    <th
                      style={{
                        padding: '11px 24px',
                        textAlign: 'right',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                      }}
                    >
                      Average
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRates.map((rate, index) => (
                    <tr
                      key={rate.currency_id}
                      style={{
                        borderTop: '1px solid var(--border-light)',
                        background: index % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
                      }}
                    >
                      <td
                        style={{
                          padding: '13px 24px',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {rate.currency_id}
                      </td>
                      <td style={{ padding: '13px 24px', color: 'var(--text-secondary)' }}>
                        {rate.currency}
                      </td>
                      <td
                        style={{
                          padding: '13px 24px',
                          textAlign: 'right',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {rate.bid ? `KHR ${rate.bid.toLocaleString()}` : '-'}
                      </td>
                      <td
                        style={{
                          padding: '13px 24px',
                          textAlign: 'right',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {rate.ask ? `KHR ${rate.ask.toLocaleString()}` : '-'}
                      </td>
                      <td
                        style={{
                          padding: '13px 24px',
                          textAlign: 'right',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        KHR {rate.average?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}
          >
            Live snapshots originate from{' '}
            <a
              href="https://data.mef.gov.kh"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-text)' }}
            >
              data.mef.gov.kh
            </a>{' '}
            and are cached into Supabase for historical charts.
          </div>
        </>
      )}

      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
