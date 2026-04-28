import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Download,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { DataCard, DataCardSkeleton } from '../components/features/DataCard';
import { DATA_CLUSTERS } from '../types';
import { DATASET_CATALOG, DATASET_FORMATS } from '../data/datasetCatalog';
import { getDatasetCatalog } from '../services/supabaseData';
import '../styles/design-tokens.css';

const FORMAT_COLORS = {
  CSV: '#10b981',
  JSON: '#0ea5e9',
  XLSX: '#8b5cf6',
  GeoJSON: '#f97316',
};

export default function DatasetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allDatasets, setAllDatasets] = useState(DATASET_CATALOG);
  const [results, setResults] = useState(DATASET_CATALOG);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      setLoading(true);
      const catalog = await getDatasetCatalog();
      if (!active) return;
      setAllDatasets(catalog);
      setLoading(false);
    }

    loadCatalog();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let filtered = allDatasets;

    if (query) {
      const lowered = query.toLowerCase();
      filtered = filtered.filter((dataset) =>
        dataset.title.toLowerCase().includes(lowered) ||
        dataset.description.toLowerCase().includes(lowered) ||
        dataset.category.toLowerCase().includes(lowered) ||
        dataset.ministry?.name?.toLowerCase().includes(lowered),
      );
    }

    if (selectedCluster !== 'all') {
      filtered = filtered.filter((dataset) => dataset.clusterId === selectedCluster);
    }

    if (selectedFormat !== 'all') {
      filtered = filtered.filter((dataset) => dataset.formats?.includes(selectedFormat) || dataset.format === selectedFormat);
    }

    setResults(filtered);
  }, [allDatasets, query, selectedCluster, selectedFormat]);

  const handleSearch = (event) => {
    event.preventDefault();
    setQuery(inputValue);
    if (inputValue) setSearchParams({ q: inputValue });
    else setSearchParams({});
  };

  const ministryCount = new Set(allDatasets.map((dataset) => dataset.ministry?.id).filter(Boolean)).size;

  return (
    <div style={{ background: 'var(--bg-secondary, #f8fafc)', minHeight: '100vh' }}>
      <Helmet>
        <title>Datasets - CamData</title>
        <meta
          name="description"
          content="Browse Cambodia's open datasets, backed by a Supabase catalog so new entries can go live without a frontend deploy."
        />
      </Helmet>

      <div
        style={{
          background: 'var(--bg-primary, #fff)',
          borderBottom: '1px solid var(--border-light, #e2e8f0)',
          padding: '40px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Datasets
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: 24 }}>
            {allDatasets.length} datasets from {ministryCount || 0} ministries
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, maxWidth: 700 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
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
                }}
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

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              {loading ? 'Loading dataset catalog...' : `${results.length} dataset${results.length !== 1 ? 's' : ''} found`}
              {query && (
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}> for "{query}"</span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowFilters((open) => !open)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                background: showFilters ? 'var(--accent-light)' : 'var(--bg-primary)',
                color: showFilters ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: `1px solid ${showFilters ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
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

        {showFilters && (
          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: 20,
              marginBottom: 20,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 10,
                }}
              >
                Topic
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['all', ...DATA_CLUSTERS.map((cluster) => cluster.id)].map((id) => {
                  const cluster = DATA_CLUSTERS.find((item) => item.id === id);
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedCluster(id)}
                      style={{
                        padding: '6px 14px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
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

            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 10,
                }}
              >
                Format
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {DATASET_FORMATS.map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    style={{
                      padding: '6px 14px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: selectedFormat === format ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: selectedFormat === format ? 'var(--accent-text)' : 'var(--text-secondary)',
                      border: `1px solid ${selectedFormat === format ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {format === 'all' ? 'All Formats' : format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
              gap: 20,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((value) => <DataCardSkeleton key={value} />)}
          </div>
        ) : results.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Search size={28} color="var(--text-muted)" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              No datasets found
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 24 }}>
              Try different keywords or clear your filters
            </p>
            <button
              onClick={() => {
                setQuery('');
                setInputValue('');
                setSelectedCluster('all');
                setSelectedFormat('all');
                setSearchParams({});
              }}
              style={{
                padding: '12px 24px',
                background: 'var(--accent-primary)',
                color: 'var(--accent-text)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
              gap: viewMode === 'grid' ? 20 : 12,
            }}
          >
            {results.map((dataset) => (
              viewMode === 'grid' ? (
                <Link key={dataset.id} to={`/datasets/${dataset.id}`} style={{ textDecoration: 'none' }}>
                  <DataCard dataset={dataset} onDownload={() => {}} />
                </Link>
              ) : (
                <Link key={dataset.id} to={`/datasets/${dataset.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      transition: 'all 0.15s',
                    }}
                    onMouseOver={(event) => {
                      event.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      event.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(event) => {
                      event.currentTarget.style.boxShadow = 'none';
                      event.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            padding: '2px 10px',
                            background: 'var(--accent-light)',
                            color: 'var(--accent-text)',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          {dataset.category}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            background: `${FORMAT_COLORS[dataset.format] || '#64748b'}18`,
                            color: FORMAT_COLORS[dataset.format] || '#64748b',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          {dataset.format}
                        </span>
                        {dataset.hasGeospatial && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '12px', color: 'var(--info, #0ea5e9)' }}>
                            <MapPin size={11} /> Map
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {dataset.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {dataset.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                      <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                          <Download size={11} />
                          {dataset.downloadCount?.toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={11} />
                          {new Date(dataset.lastUpdated).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <ArrowRight size={18} color="var(--text-muted)" />
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
