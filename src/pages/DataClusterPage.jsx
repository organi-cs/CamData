// src/pages/DataClusterPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DataCard, DataCardSkeleton } from '../components/features/DataCard';
import { RomduolIcon, RomduolIconOutline } from '../components/ui/RomduolIcon';
import { PageLoader } from '../components/ui/RomduolLoader';
import { DATA_CLUSTERS, MINISTRIES } from '../types';
import '../styles/design-tokens.css';

// Sample datasets per cluster
const CLUSTER_DATASETS = {
    'mekong-water': [
        {
            id: 'mekong-water-levels',
            title: 'Mekong River Daily Water Levels',
            description: 'Daily water level readings from monitoring stations along the Mekong.',
            ministry: MINISTRIES.mowram,
            lastUpdated: new Date().toISOString(),
            hasGeospatial: true,
            category: 'Mekong River & Water',
            sparklineData: [8.2, 8.5, 8.1, 7.9, 8.3, 8.7, 9.1, 8.8, 8.4, 8.0],
            downloadCount: 5420,
        },
        {
            id: 'tonle-sap-levels',
            title: 'Tonle Sap Lake Water Levels',
            description: 'Daily water level measurements for Tonle Sap Lake.',
            ministry: MINISTRIES.mowram,
            lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Mekong River & Water',
            sparklineData: [5.2, 5.5, 5.8, 6.1, 6.4, 6.8, 7.2, 7.5, 7.1, 6.8],
            downloadCount: 3890,
        },
        {
            id: 'flood-alerts',
            title: 'Flood Alert Zones',
            description: 'Historical and current flood risk zones and alerts.',
            ministry: MINISTRIES.mowram,
            lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Mekong River & Water',
            sparklineData: [2, 1, 3, 5, 8, 12, 9, 6, 4, 3],
            downloadCount: 2340,
        },
    ],
    'agriculture': [
        {
            id: 'rice-exports',
            title: 'Rice Export Volumes by Month',
            description: 'Monthly rice and paddy export statistics.',
            ministry: MINISTRIES.maff,
            lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Agricultural Trade',
            sparklineData: [45000, 52000, 48000, 55000, 61000, 58000, 65000, 72000, 68000, 75000],
            downloadCount: 8320,
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
            id: 'cassava-yield',
            title: 'Cassava Yield Data',
            description: 'Provincial cassava production and yield statistics.',
            ministry: MINISTRIES.maff,
            lastUpdated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Agricultural Trade',
            sparklineData: [850, 920, 880, 950, 1020, 980, 1050, 1120, 1080, 1150],
            downloadCount: 1560,
        },
    ],
    'garment': [
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
            id: 'garment-exports',
            title: 'Garment Export Values',
            description: 'Monthly garment and textile export values by destination.',
            ministry: MINISTRIES.moc,
            lastUpdated: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: false,
            category: 'Garment & Manufacturing',
            sparklineData: [850, 920, 880, 950, 1020, 980, 1050, 1120, 1080, 1150],
            downloadCount: 3210,
        },
    ],
    'tourism': [
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
            id: 'international-arrivals',
            title: 'International Arrivals by Nationality',
            description: 'Monthly international visitor arrivals data.',
            ministry: MINISTRIES.mot,
            lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: false,
            category: 'Tourism & Heritage',
            sparklineData: [450000, 520000, 480000, 550000, 610000, 580000, 650000, 720000, 680000, 750000],
            downloadCount: 6540,
        },
    ],
    'urban-mobility': [
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
            id: 'bus-ridership',
            title: 'Public Bus Routes & Ridership',
            description: 'Daily public bus ridership data for Phnom Penh.',
            ministry: MINISTRIES.mpwt,
            lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Urban Mobility',
            sparklineData: [12000, 11500, 13200, 12800, 14500, 15200, 14800, 16000, 15500, 17200],
            downloadCount: 1890,
        },
    ],
    'finance': [
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
        {
            id: 'microfinance',
            title: 'Microfinance Loan Disbursements',
            description: 'Monthly microfinance lending statistics by province.',
            ministry: MINISTRIES.nbc,
            lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            hasGeospatial: true,
            category: 'Financial Markets',
            sparklineData: [250, 280, 265, 310, 340, 325, 380, 410, 395, 450],
            downloadCount: 2340,
        },
    ],
};

export default function DataClusterPage() {
    const { clusterId } = useParams();
    const [cluster, setCluster] = useState(null);
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Find cluster info
        const clusterInfo = DATA_CLUSTERS.find(c => c.id === clusterId);
        setCluster(clusterInfo);

        // Simulate API fetch
        setTimeout(() => {
            setDatasets(CLUSTER_DATASETS[clusterId] || []);
            setLoading(false);
        }, 500);
    }, [clusterId]);

    if (!cluster) {
        return (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <h1>Cluster not found</h1>
                <Link to="/" style={{ color: 'var(--accent-text)' }}>Return home</Link>
            </div>
        );
    }

    const IconComponent = LucideIcons[cluster.icon] || LucideIcons.Database;

    return (
        <div style={{ background: 'var(--bg-secondary, #f8fafc)', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{
                background: 'var(--bg-primary, #fff)',
                borderBottom: '1px solid var(--border-light, #e2e8f0)',
                padding: '40px 24px',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--text-secondary, #64748b)',
                            fontSize: '14px',
                            textDecoration: 'none',
                            marginBottom: '24px',
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to all clusters
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: 72,
                            height: 72,
                            borderRadius: 'var(--radius-xl, 16px)',
                            background: `${cluster.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <IconComponent size={36} color={cluster.color} />
                        </div>
                        <div>
                            <h1 style={{
                                fontSize: '32px',
                                fontWeight: 700,
                                color: 'var(--text-primary, #1e293b)',
                                marginBottom: '8px',
                            }}>
                                {cluster.name}
                            </h1>
                            <p style={{
                                fontSize: '16px',
                                color: 'var(--text-secondary, #64748b)',
                            }}>
                                {cluster.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Datasets Grid */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <RomduolIconOutline size={18} color="var(--accent-primary, #FFCC33)" />
                    <h2 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-muted, #64748b)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        margin: 0,
                    }}>
                        Available Datasets ({loading ? '...' : datasets.length})
                    </h2>
                </div>

                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '24px',
                    }}>
                        {[1, 2, 3].map(i => <DataCardSkeleton key={i} />)}
                    </div>
                ) : datasets.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 24px',
                        background: 'var(--bg-primary, #fff)',
                        borderRadius: 'var(--radius-xl, 16px)',
                        border: '1px solid var(--border-light, #e2e8f0)',
                    }}>
                        <RomduolIcon size={48} color="var(--text-muted, #94a3b8)" />
                        <h3 style={{ marginTop: '16px', color: 'var(--text-primary)' }}>
                            No datasets yet
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                            Datasets for this cluster are coming soon.
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '24px',
                    }}>
                        {datasets.map(dataset => (
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

                {/* Related Clusters */}
                <div style={{ marginTop: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <RomduolIconOutline size={18} color="var(--accent-primary, #FFCC33)" />
                        <h2 style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--text-muted, #64748b)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            margin: 0,
                        }}>
                            Other Data Clusters
                        </h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '16px',
                    }}>
                        {DATA_CLUSTERS.filter(c => c.id !== clusterId).slice(0, 4).map(c => {
                            const Icon = LucideIcons[c.icon] || LucideIcons.Database;
                            return (
                                <Link
                                    key={c.id}
                                    to={`/cluster/${c.id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        background: 'var(--bg-primary, #fff)',
                                        border: '1px solid var(--border-light, #e2e8f0)',
                                        borderRadius: 'var(--radius-lg, 12px)',
                                        textDecoration: 'none',
                                        transition: 'all var(--transition-fast, 0.15s)',
                                    }}
                                >
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 'var(--radius-md, 8px)',
                                        background: `${c.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Icon size={20} color={c.color} />
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: 'var(--text-primary, #1e293b)',
                                    }}>
                                        {c.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
