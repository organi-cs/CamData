import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List, Download, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { DataCard, DataCardSkeleton } from '../components/features/DataCard';
import { RomduolIconOutline } from '../components/ui/RomduolIcon';
import { DATA_CLUSTERS, MINISTRIES } from '../types';
import '../styles/design-tokens.css';

const ALL_DATASETS = [
  { id: 'usd-exchange-rate', title: 'USD/KHR Daily Exchange Rate', description: 'Official exchange rates from the National Bank of Cambodia, updated every business day.', ministry: MINISTRIES.nbc, lastUpdated: new Date().toISOString(), hasGeospatial: false, category: 'Financial Markets', clusterId: 'finance', sparklineData: [4100,4095,4102,4098,4105,4110,4108,4115,4112,4120], downloadCount: 12450, format: 'CSV' },
  { id: 'rice-exports', title: 'Rice Export Volumes by Month', description: 'Monthly rice and paddy export statistics by province and destination country.', ministry: MINISTRIES.maff, lastUpdated: new Date(Date.now()-7*864e5).toISOString(), hasGeospatial: true, category: 'Agricultural Trade', clusterId: 'agriculture', sparklineData: [45000,52000,48000,55000,61000,58000,65000,72000,68000,75000], downloadCount: 8320, format: 'CSV' },
  { id: 'angkor-visitors', title: 'Angkor Wat Visitor Statistics', description: 'Daily ticket sales and visitor counts for Angkor Archaeological Park.', ministry: MINISTRIES.mot, lastUpdated: new Date(Date.now()-2*864e5).toISOString(), hasGeospatial: true, category: 'Tourism & Heritage', clusterId: 'tourism', sparklineData: [2500,3200,2800,3500,4100,3800,4500,5200,4800,5500], downloadCount: 15780, format: 'JSON' },
  { id: 'mekong-water-levels', title: 'Mekong River Daily Water Levels', description: 'Daily water level readings from monitoring stations along the Mekong and Tonle Sap.', ministry: MINISTRIES.mowram, lastUpdated: new Date().toISOString(), hasGeospatial: true, category: 'Mekong River & Water', clusterId: 'mekong-water', sparklineData: [8.2,8.5,8.1,7.9,8.3,8.7,9.1,8.8,8.4,8.0], downloadCount: 5420, format: 'CSV' },
  { id: 'garment-employment', title: 'Garment Factory Employment Statistics', description: 'Monthly employment data from garment and textile factories across Cambodia.', ministry: MINISTRIES.mih, lastUpdated: new Date(Date.now()-14*864e5).toISOString(), hasGeospatial: true, category: 'Garment & Manufacturing', clusterId: 'garment', sparklineData: [720000,715000,730000,725000,740000,738000,745000,750000,755000,760000], downloadCount: 4890, format: 'XLSX' },
  { id: 'traffic-incidents', title: 'Road Traffic Incidents (Phnom Penh)', description: 'Daily traffic accident reports, locations, and severity data for Phnom Penh.', ministry: MINISTRIES.mpwt, lastUpdated: new Date(Date.now()-864e5).toISOString(), hasGeospatial: true, category: 'Urban Mobility', clusterId: 'urban-mobility', sparklineData: [45,38,52,41,35,48,55,42,39,47], downloadCount: 3210, format: 'GeoJSON' },
  { id: 'rubber-production', title: 'Rubber Production by Province', description: 'Annual rubber latex production statistics by province and processing method.', ministry: MINISTRIES.maff, lastUpdated: new Date(Date.now()-30*864e5).toISOString(), hasGeospatial: true, category: 'Agricultural Trade', clusterId: 'agriculture', sparklineData: [120,135,128,142,155,148,160,175,168,182], downloadCount: 2780, format: 'CSV' },
  { id: 'csx-index', title: 'CSX Stock Market Index', description: 'Daily Cambodia Securities Exchange index and trading data for all listed companies.', ministry: MINISTRIES.nbc, lastUpdated: new Date().toISOString(), hasGeospatial: false, category: 'Financial Markets', clusterId: 'finance', sparklineData: [560,555,572,568,580,575,590,585,595,602], downloadCount: 6540, format: 'JSON' },
  { id: 'tonle-sap-levels', title: 'Tonle Sap Lake Water Levels', description: 'Daily water level measurements and seasonal flow patterns for Tonle Sap Lake.', ministry: MINISTRIES.mowram, lastUpdated: new Date(Date.now()-864e5).toISOString(), hasGeospatial: true, category: 'Mekong River & Water', clusterId: 'mekong-water', sparklineData: [5.2,5.5,5.8,6.1,6.4,6.8,7.2,7.5,7.1,6.8], downloadCount: 3890, format: 'CSV' },
  { id: 'international-arrivals', title: 'International Arrivals by Nationality', description: 'Monthly international visitor arrivals to Cambodia broken down by nationality and entry point.', ministry: MINISTRIES.mot, lastUpdated: new Date(Date.now()-10*864e5).toISOString(), hasGeospatial: false, category: 'Tourism & Heritage', clusterId: 'tourism', sparklineData: [450000,520000,480000,550000,610000,580000,650000,720000,680000,750000], downloadCount: 6540, format: 'CSV' },
  { id: 'garment-exports', title: 'Garment Export Values', description: 'Monthly garment and textile export values by destination country and product category.', ministry: MINISTRIES.moc, lastUpdated: new Date(Date.now()-21*864e5).toISOString(), hasGeospatial: false, category: 'Garment & Manufacturing', clusterId: 'garment', sparklineData: [850,920,880,950,1020,980,1050,1120,1080,1150], downloadCount: 3210, format: 'XLSX' },
  { id: 'microfinance', title: 'Microfinance Loan Disbursements', description: 'Monthly microfinance lending statistics by province, institution, and loan type.', ministry: MINISTRIES.nbc, lastUpdated: new Date(Date.now()-15*864e5).toISOString(), hasGeospatial: true, category: 'Financial Markets', clusterId: 'finance', sparklineData: [250,280,265,310,340,325,380,410,395,450], downloadCount: 2340, format: 'CSV' },
];

const FORMAT_COLORS = { CSV: '#10b981', JSON: '#0ea5e9', XLSX: '#8b5cf6', GeoJSON: '#f97316' };

export default function DatasetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [inputValue, setInputValue] = useState(initialQ);
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(ALL_DATASETS);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      let filtered = ALL_DATASETS;
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(d =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.ministry?.name?.toLowerCase().includes(q)
        );
      }
      if (selectedCluster !== 'all') filtered = filtered.filter(d => d.clusterId === selectedCluster);
      if (selectedFormat !== 'all') filtered = filtered.filter(d => d.format === selectedFormat);
      setResults(filtered);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, selectedCluster, selectedFormat]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputValue);
    if (inputValue) setSearchParams({ q: inputValue });
    else setSearchParams({});
  };

  const formats = ['all', 'CSV', 'JSON', 'XLSX', 'GeoJSON'];

  return (
    <div style={{ background: 'var(--bg-secondary, #f8fafc)', minHeight: '100vh' }}>
      <Helmet>
        <title>Datasets — CamData</title>
        <meta name="description" content="Browse Cambodia's open government datasets. Download data on exchange rates, agriculture, tourism, urban mobility, and more." />
      </Helmet>

      {/* Page Header */}
      <div style={{
        background: 'var(--bg-primary, #fff)',
        borderBottom: '1px solid var(--border-light, #e2e8f0)',
        padding: '40px 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Datasets
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {ALL_DATASETS.length} datasets from 8 government ministries
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: 700 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search datasets, ministries, topics..."
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  fontSize: '15px',
                  border: '2px solid var(--border-light, #e2e8f0)',
                  borderRadius: 'var(--radius-lg, 12px)',
                  outline: 'none',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary, #FFCC33)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light, #e2e8f0)'}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '14px 28px',
                background: 'var(--accent-primary, #FFCC33)',
                color: 'var(--accent-text, #7A5C00)',
                border: 'none',
                borderRadius: 'var(--radius-lg, 12px)',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {loading ? 'Searching...' : `${results.length} dataset${results.length !== 1 ? 's' : ''} found`}
              {query && <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}> for "{query}"</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 16px',
                background: showFilters ? 'var(--accent-light)' : 'var(--bg-primary)',
                color: showFilters ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: `1px solid ${showFilters ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div style={{ display: 'flex', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '9px 13px',
                    background: viewMode === mode ? 'var(--accent-light)' : 'transparent',
                    color: viewMode === mode ? 'var(--accent-text)' : 'var(--text-muted)',
                    border: 'none',
                    borderLeft: mode === 'list' ? '1px solid var(--border-light)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {/* Topic filter */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Topic</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['all', ...DATA_CLUSTERS.map(c => c.id)].map(id => {
                  const cluster = DATA_CLUSTERS.find(c => c.id === id);
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedCluster(id)}
                      style={{
                        padding: '6px 14px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                        background: selectedCluster === id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: selectedCluster === id ? 'var(--accent-text)' : 'var(--text-secondary)',
                        border: `1px solid ${selectedCluster === id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {id === 'all' ? 'All Topics' : cluster?.name || id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format filter */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Format</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {formats.map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    style={{
                      padding: '6px 14px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                      background: selectedFormat === fmt ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: selectedFormat === fmt ? 'var(--accent-text)' : 'var(--text-secondary)',
                      border: `1px solid ${selectedFormat === fmt ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {fmt === 'all' ? 'All Formats' : fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
            gap: '20px',
          }}>
            {[1,2,3,4,5,6].map(i => <DataCardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Search size={28} color="var(--text-muted)" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No datasets found</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Try different keywords or clear your filters</p>
            <button
              onClick={() => { setQuery(''); setInputValue(''); setSelectedCluster('all'); setSelectedFormat('all'); setSearchParams({}); }}
              style={{ padding: '12px 24px', background: 'var(--accent-primary)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
            gap: viewMode === 'grid' ? '20px' : '12px',
          }}>
            {results.map(dataset =>
              viewMode === 'grid' ? (
                <Link key={dataset.id} to={`/datasets/${dataset.id}`} style={{ textDecoration: 'none' }}>
                  <DataCard dataset={dataset} onDownload={() => {}} />
                </Link>
              ) : (
                <Link key={dataset.id} to={`/datasets/${dataset.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, padding: '2px 10px', background: 'var(--accent-light)', color: 'var(--accent-text)', borderRadius: 'var(--radius-full)' }}>
                          {dataset.category}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', background: `${FORMAT_COLORS[dataset.format] || '#64748b'}18`, color: FORMAT_COLORS[dataset.format] || '#64748b', borderRadius: 'var(--radius-sm)' }}>
                          {dataset.format}
                        </span>
                        {dataset.hasGeospatial && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--info, #0ea5e9)' }}>
                            <MapPin size={11} /> Map
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{dataset.title}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dataset.description}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                      <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                          <Download size={11} />
                          {dataset.downloadCount?.toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} />
                          {new Date(dataset.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <ArrowRight size={18} color="var(--text-muted)" />
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
