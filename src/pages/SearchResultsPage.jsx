// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, Grid, List } from 'lucide-react';
import { DataCard, DataCardSkeleton } from '../components/features/DataCard';
import { MinistryBadge } from '../components/features/MinistryBadge';
import { RomduolIconOutline } from '../components/ui/RomduolIcon';
import { DATA_CLUSTERS, MINISTRIES } from '../types';
import '../styles/design-tokens.css';

// Sample search results data
const generateSampleResults = (query) => {
    const allDatasets = [
        {
            id: 'usd-exchange-rate',
            title: 'USD/KHR Daily Exchange Rate',
            description: 'Official exchange rates from the National Bank of Cambodia.',
            ministry: MINISTRIES.nbc,
            lastUpdated: new Date().toISOString(),
            hasGeospatial: false,
            category: 'Financial Markets',
            sparklineData: [4100, 4095, 4102, 4098, 4105, 4110, 4108, 4115, 4112, 4120],
            downloadCount: 12450,
        },
        {
            id: 'rice-exports',
            title: 'Rice Export Volumes by Month',
            description: 'Monthly rice and paddy export statistics by province.',
            ministry: MINISTRIES.maff,
            lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Agricultural Trade',
            sparklineData: [45000, 52000, 48000, 55000, 61000, 58000, 65000, 72000, 68000, 75000],
            downloadCount: 8320,
        },
        {
            id: 'angkor-visitors',
            title: 'Angkor Wat Visitor Statistics',
            description: 'Daily ticket sales for Angkor Archaeological Park.',
            ministry: MINISTRIES.mot,
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Tourism & Heritage',
            sparklineData: [2500, 3200, 2800, 3500, 4100, 3800, 4500, 5200, 4800, 5500],
            downloadCount: 15780,
        },
        {
            id: 'mekong-water-levels',
            title: 'Mekong River Daily Water Levels',
            description: 'Daily water level readings from monitoring stations.',
            ministry: MINISTRIES.mowram,
            lastUpdated: new Date().toISOString(),
            hasGeospatial: true,
            category: 'Mekong River & Water',
            sparklineData: [8.2, 8.5, 8.1, 7.9, 8.3, 8.7, 9.1, 8.8, 8.4, 8.0],
            downloadCount: 5420,
        },
        {
            id: 'garment-employment',
            title: 'Garment Factory Employment Statistics',
            description: 'Monthly employment data from garment and textile factories.',
            ministry: MINISTRIES.mih,
            lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Garment & Manufacturing',
            sparklineData: [720000, 715000, 730000, 725000, 740000, 738000, 745000, 750000, 755000, 760000],
            downloadCount: 4890,
        },
        {
            id: 'traffic-incidents',
            title: 'Road Traffic Incidents (Phnom Penh)',
            description: 'Daily traffic accident reports and locations.',
            ministry: MINISTRIES.mpwt,
            lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Urban Mobility',
            sparklineData: [45, 38, 52, 41, 35, 48, 55, 42, 39, 47],
            downloadCount: 3210,
        },
        {
            id: 'rubber-production',
            title: 'Rubber Production by Province',
            description: 'Annual rubber latex production statistics.',
            ministry: MINISTRIES.maff,
            lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Agricultural Trade',
            sparklineData: [120, 135, 128, 142, 155, 148, 160, 175, 168, 182],
            downloadCount: 2780,
        },
        {
            id: 'csx-index',
            title: 'CSX Stock Market Index',
            description: 'Daily Cambodia Securities Exchange trading data.',
            ministry: MINISTRIES.nbc,
            lastUpdated: new Date().toISOString(),
            hasGeospatial: false,
            category: 'Financial Markets',
            sparklineData: [560, 555, 572, 568, 580, 575, 590, 585, 595, 602],
            downloadCount: 6540,
        },
    ];

    if (!query) return allDatasets;

    const q = query.toLowerCase();
    return allDatasets.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.ministry.name.toLowerCase().includes(q)
    );
};

export default function SearchResultsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(query);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Simulate API search
        setTimeout(() => {
            let filtered = generateSampleResults(query);
            if (selectedCategory !== 'all') {
                filtered = filtered.filter(d => d.category === selectedCategory);
            }
            setResults(filtered);
            setLoading(false);
        }, 600);
    }, [query, selectedCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchInput });
    };

    const categories = ['all', ...DATA_CLUSTERS.map(c => c.name)];

    return (
        <div style={{ background: 'var(--bg-secondary, #f8fafc)', minHeight: '100vh' }}>
            {/* Search Header */}
            <div style={{
                background: 'var(--bg-primary, #fff)',
                borderBottom: '1px solid var(--border-light, #e2e8f0)',
                padding: '24px',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <form onSubmit={handleSearch} style={{
                        display: 'flex',
                        gap: '12px',
                        maxWidth: 700,
                    }}>
                        <div style={{
                            flex: 1,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Search
                                size={20}
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    color: 'var(--text-muted, #94a3b8)',
                                }}
                            />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search datasets..."
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    fontSize: '16px',
                                    border: '2px solid var(--border-light, #e2e8f0)',
                                    borderRadius: 'var(--radius-lg, 12px)',
                                    outline: 'none',
                                    transition: 'border-color var(--transition-fast, 0.15s)',
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
                                transition: 'all var(--transition-fast, 0.15s)',
                            }}
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
                {/* Results Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: 'var(--text-primary, #1e293b)',
                            marginBottom: '4px',
                        }}>
                            {query ? `Results for "${query}"` : 'All Datasets'}
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted, #94a3b8)' }}>
                            {loading ? 'Searching...' : `${results.length} datasets found`}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '10px 16px',
                                background: showFilters ? 'var(--accent-light, #fff5cc)' : 'var(--bg-primary, #fff)',
                                color: showFilters ? 'var(--accent-text, #7A5C00)' : 'var(--text-secondary, #64748b)',
                                border: `1px solid ${showFilters ? 'var(--accent-primary, #FFCC33)' : 'var(--border-light, #e2e8f0)'}`,
                                borderRadius: 'var(--radius-md, 8px)',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>

                        {/* View Toggle */}
                        <div style={{
                            display: 'flex',
                            background: 'var(--bg-primary, #fff)',
                            border: '1px solid var(--border-light, #e2e8f0)',
                            borderRadius: 'var(--radius-md, 8px)',
                            overflow: 'hidden',
                        }}>
                            <button
                                onClick={() => setViewMode('grid')}
                                style={{
                                    padding: '10px 14px',
                                    background: viewMode === 'grid' ? 'var(--accent-light, #fff5cc)' : 'transparent',
                                    color: viewMode === 'grid' ? 'var(--accent-text, #7A5C00)' : 'var(--text-muted, #94a3b8)',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                style={{
                                    padding: '10px 14px',
                                    background: viewMode === 'list' ? 'var(--accent-light, #fff5cc)' : 'transparent',
                                    color: viewMode === 'list' ? 'var(--accent-text, #7A5C00)' : 'var(--text-muted, #94a3b8)',
                                    border: 'none',
                                    borderLeft: '1px solid var(--border-light, #e2e8f0)',
                                    cursor: 'pointer',
                                }}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div style={{
                        background: 'var(--bg-primary, #fff)',
                        border: '1px solid var(--border-light, #e2e8f0)',
                        borderRadius: 'var(--radius-xl, 16px)',
                        padding: '20px',
                        marginBottom: '24px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <RomduolIconOutline size={16} color="var(--accent-primary, #FFCC33)" />
                            <h3 style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-muted, #64748b)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                margin: 0,
                            }}>
                                Filter by Category
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '8px 16px',
                                        background: selectedCategory === cat
                                            ? 'var(--accent-primary, #FFCC33)'
                                            : 'var(--bg-secondary, #f8fafc)',
                                        color: selectedCategory === cat
                                            ? 'var(--accent-text, #7A5C00)'
                                            : 'var(--text-secondary, #64748b)',
                                        border: `1px solid ${selectedCategory === cat
                                            ? 'var(--accent-primary, #FFCC33)'
                                            : 'var(--border-light, #e2e8f0)'}`,
                                        borderRadius: 'var(--radius-full, 9999px)',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast, 0.15s)',
                                        textTransform: cat === 'all' ? 'capitalize' : 'none',
                                    }}
                                >
                                    {cat === 'all' ? 'All Categories' : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Grid */}
                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: viewMode === 'grid'
                            ? 'repeat(auto-fill, minmax(340px, 1fr))'
                            : '1fr',
                        gap: '24px',
                    }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <DataCardSkeleton key={i} />
                        ))}
                    </div>
                ) : results.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 24px',
                        background: 'var(--bg-primary, #fff)',
                        borderRadius: 'var(--radius-xl, 16px)',
                        border: '1px solid var(--border-light, #e2e8f0)',
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 20px',
                            background: 'var(--bg-secondary, #f8fafc)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Search size={32} color="var(--text-muted, #94a3b8)" />
                        </div>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: 'var(--text-primary, #1e293b)',
                            marginBottom: '8px',
                        }}>
                            No results found
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--text-muted, #94a3b8)',
                            marginBottom: '24px',
                        }}>
                            Try adjusting your search or filters
                        </p>
                        <Link
                            to="/"
                            style={{
                                display: 'inline-flex',
                                padding: '12px 24px',
                                background: 'var(--accent-primary, #FFCC33)',
                                color: 'var(--accent-text, #7A5C00)',
                                borderRadius: 'var(--radius-lg, 12px)',
                                fontSize: '14px',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            Browse all datasets
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: viewMode === 'grid'
                            ? 'repeat(auto-fill, minmax(340px, 1fr))'
                            : '1fr',
                        gap: '24px',
                    }}>
                        {results.map(dataset => (
                            <Link
                                key={dataset.id}
                                to={`/datasets/${dataset.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <DataCard
                                    dataset={dataset}
                                    onDownload={(d) => console.log('Download:', d.title)}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
