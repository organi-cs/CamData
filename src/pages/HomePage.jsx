// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Waves,
  Wheat,
  Factory,
  Landmark,
  Car,
  TrendingUp,
  Database,
  Users,
  Globe
} from 'lucide-react';
import { api } from '../services/api';
import { HeroSearch } from '../components/features/HeroSearch';
import { DataCard } from '../components/features/DataCard';
import { RomduolIcon, RomduolIconOutline } from '../components/ui/RomduolIcon';
import { DATA_CLUSTERS, MINISTRIES } from '../types';
import { useI18n } from '../i18n/I18nContext';
import '../styles/design-tokens.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { t, isKhmer } = useI18n();
  const [stats, setStats] = useState({ rates: null, aqi: null });
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping for clusters
  const iconMap = {
    Waves, Wheat, Factory, Landmark, Car, TrendingUp
  };

  // Fetch live data on mount
  useEffect(() => {
    async function loadData() {
      const rates = await api.getExchangeRates();
      if (rates && Array.isArray(rates)) {
        const usd = rates.find(r => r.currency_id === 'USD');
        setStats(s => ({ ...s, rates: usd?.average || null }));
      }
    }
    loadData();
  }, []);

  // Categories with enhanced styling
  const categories = DATA_CLUSTERS.map(cluster => ({
    ...cluster,
    Icon: iconMap[cluster.icon] || Database,
    path: `/cluster/${cluster.id}`,
  }));

  // Featured datasets for demo
  const featuredDatasets = [
    {
      id: 1,
      title: 'USD/KHR Daily Exchange Rate',
      description: 'Official exchange rates published by the National Bank of Cambodia, updated daily.',
      ministry: MINISTRIES.nbc,
      lastUpdated: new Date().toISOString(),
      hasGeospatial: false,
      category: 'Financial Markets',
      sparklineData: [4100, 4095, 4102, 4098, 4105, 4110, 4108, 4115, 4112, 4120],
      downloadCount: 12450,
    },
    {
      id: 2,
      title: 'Rice Export Volumes by Month',
      description: 'Monthly rice and paddy export statistics by province and destination country.',
      ministry: MINISTRIES.maff,
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      hasGeospatial: true,
      category: 'Agricultural Trade',
      sparklineData: [45000, 52000, 48000, 55000, 61000, 58000, 65000, 72000, 68000, 75000],
      downloadCount: 8320,
    },
    {
      id: 3,
      title: 'Angkor Wat Visitor Statistics',
      description: 'Daily ticket sales and visitor counts for Angkor Archaeological Park by nationality.',
      ministry: MINISTRIES.mot,
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      hasGeospatial: true,
      category: 'Tourism & Heritage',
      sparklineData: [2500, 3200, 2800, 3500, 4100, 3800, 4500, 5200, 4800, 5500],
      downloadCount: 15780,
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ background: 'var(--bg-primary, #fff)' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(180deg, #fff 0%, var(--bg-secondary, #f8fafc) 100%)',
        borderBottom: '1px solid var(--border-light, #e2e8f0)',
        padding: '80px 24px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative Romduol pattern */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '10%',
          opacity: 0.06,
          transform: 'rotate(15deg)',
        }}>
          <RomduolIcon size={200} color="var(--accent-primary, #FFCC33)" />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '5%',
          opacity: 0.04,
          transform: 'rotate(-20deg)',
        }}>
          <RomduolIcon size={300} color="var(--text-primary, #1e293b)" />
        </div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            padding: '8px 16px',
            background: 'var(--accent-light, #fff5cc)',
            borderRadius: 'var(--radius-full, 9999px)',
          }}>
            <RomduolIcon size={20} color="var(--accent-primary, #FFCC33)" />
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--accent-text, #7A5C00)'
            }}>
              {isKhmer ? 'វេទិកាទិន្នន័យបើកចំហរបស់កម្ពុជា' : 'Cambodia\'s Official Open Data Portal'}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            color: 'var(--text-primary, #0f172a)',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            {t('hero.title')}
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary, #64748b)',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            {t('hero.subtitle')}
          </p>

          {/* Hero Search */}
          <HeroSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Data Clusters Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px'
        }}>
          <RomduolIconOutline size={20} color="var(--accent-primary, #FFCC33)" />
          <h2 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-muted, #64748b)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
          }}>
            Explore by Data Cluster
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={cat.path}
              style={{
                background: 'var(--bg-primary, #fff)',
                border: '1px solid var(--border-light, #e2e8f0)',
                borderRadius: 'var(--radius-xl, 16px)',
                padding: '24px',
                textAlign: 'left',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'all var(--transition-base, 0.2s)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = cat.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-light, #e2e8f0)';
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-lg, 12px)',
                background: `${cat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <cat.Icon size={26} color={cat.color} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text-primary, #0f172a)',
                  marginBottom: '6px'
                }}>
                  {cat.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary, #64748b)',
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {cat.description}
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: cat.color,
                fontSize: '14px',
                fontWeight: 600,
                marginTop: 'auto'
              }}>
                Explore <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Datasets */}
      <div style={{
        background: 'var(--bg-secondary, #f8fafc)',
        padding: '60px 24px',
        borderTop: '1px solid var(--border-light, #e2e8f0)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RomduolIconOutline size={20} color="var(--accent-primary, #FFCC33)" />
              <h2 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-muted, #64748b)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0,
              }}>
                Featured Datasets
              </h2>
            </div>
            <Link
              to="/datasets"
              style={{
                fontSize: '14px',
                color: 'var(--accent-text, #7A5C00)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {featuredDatasets.map(dataset => (
              <DataCard
                key={dataset.id}
                dataset={dataset}
                onDownload={(d) => console.log('Download:', d.title)}
                onClick={() => console.log('View:', dataset.title)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div style={{
        background: 'var(--bg-primary, #fff)',
        borderTop: '1px solid var(--border-light, #e2e8f0)',
        padding: '60px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <RomduolIconOutline size={20} color="var(--accent-primary, #FFCC33)" />
            <h2 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-muted, #64748b)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: 0,
            }}>
              Portal Statistics
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {/* Stat Card 1 */}
            <div style={{
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: '24px',
              border: '1px solid var(--border-light, #e2e8f0)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <TrendingUp size={18} color="var(--cluster-finance, #FFCC33)" />
                <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                  USD/KHR Rate
                </p>
              </div>
              <p style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--text-primary, #0f172a)',
                margin: 0,
              }}>
                {stats.rates ? `៛${stats.rates.toLocaleString()}` : '—'}
              </p>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-muted, #94a3b8)',
                marginTop: '8px'
              }}>
                National Bank of Cambodia
              </p>
            </div>

            {/* Stat Card 2 */}
            <div style={{
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: '24px',
              border: '1px solid var(--border-light, #e2e8f0)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Database size={18} color="var(--cluster-agriculture, #84CC16)" />
                <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                  Datasets
                </p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', margin: 0 }}>
                120+
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', marginTop: '8px' }}>
                Across 6 data clusters
              </p>
            </div>

            {/* Stat Card 3 */}
            <div style={{
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: '24px',
              border: '1px solid var(--border-light, #e2e8f0)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={18} color="var(--cluster-tourism, #A855F7)" />
                <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                  Data Sources
                </p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', margin: 0 }}>
                8
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', marginTop: '8px' }}>
                Government ministries
              </p>
            </div>

            {/* Stat Card 4 */}
            <div style={{
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: '24px',
              border: '1px solid var(--border-light, #e2e8f0)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Globe size={18} color="var(--success, #10b981)" />
                <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                  Status
                </p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success, #10b981)', margin: 0 }}>
                Live
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', marginTop: '8px' }}>
                Real-time updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-light, #e2e8f0)',
        padding: '40px 24px',
        textAlign: 'center',
        background: 'var(--bg-primary, #fff)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <RomduolIcon size={24} color="var(--accent-primary, #FFCC33)" />
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
            CamData
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted, #94a3b8)', marginBottom: '8px' }}>
          Cambodia's Open Data Portal • Democratizing data access for everyone
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted, #94a3b8)' }}>
          Built by{' '}
          <a
            href="https://organi-cs.github.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-text, #7A5C00)', fontWeight: 500 }}
          >
            Samputhy Khim
          </a>
          {' '}· Data from{' '}
          <a
            href="https://data.mef.gov.kh"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-text, #7A5C00)', fontWeight: 500 }}
          >
            data.mef.gov.kh
          </a>
        </p>
      </footer>
    </div>
  );
}