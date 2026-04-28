// src/pages/DatasetDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Share2,
    Quote,
    Calendar,
    Building2,
    MapPin,
    FileText,
    ExternalLink,
    Copy,
    Check,
    FileDown
} from 'lucide-react';
import { VisualizationPanel } from '../components/features/VisualizationPanel';
import { MinistryBadge } from '../components/features/MinistryBadge';
import { RomduolIcon, RomduolIconOutline } from '../components/ui/RomduolIcon';
import { PageLoader } from '../components/ui/RomduolLoader';
import { MINISTRIES } from '../types';
import { exportToCSV, exportToJSON, exportToPDF } from '../utils/export';
import '../styles/design-tokens.css';

// Sample datasets for demo
const SAMPLE_DATASETS = {
    'usd-exchange-rate': {
        id: 'usd-exchange-rate',
        title: 'USD/KHR Daily Exchange Rate',
        description: 'Official exchange rates published by the National Bank of Cambodia. This dataset includes daily buying and selling rates for USD to Cambodian Riel (KHR), updated every business day. The data is sourced directly from the NBC official API and reflects the interbank rate used for official transactions.',
        ministry: MINISTRIES.nbc,
        lastUpdated: new Date().toISOString(),
        createdAt: '2020-01-01',
        hasGeospatial: false,
        category: 'Financial Markets',
        license: 'CC-BY',
        updateFrequency: 'daily',
        downloadCount: 12450,
        resources: [
            { id: 1, name: 'exchange_rates_2024.csv', format: 'CSV', sizeBytes: 245000 },
            { id: 2, name: 'exchange_rates_2024.json', format: 'JSON', sizeBytes: 312000 },
            { id: 3, name: 'exchange_rates_2024.xlsx', format: 'XLSX', sizeBytes: 198000 },
        ],
        visualization: {
            defaultView: 'chart',
            chartType: 'line',
        },
        data: [
            { date: '2024-01-01', rate: 4100, label: 'Jan' },
            { date: '2024-02-01', rate: 4095, label: 'Feb' },
            { date: '2024-03-01', rate: 4102, label: 'Mar' },
            { date: '2024-04-01', rate: 4098, label: 'Apr' },
            { date: '2024-05-01', rate: 4105, label: 'May' },
            { date: '2024-06-01', rate: 4110, label: 'Jun' },
            { date: '2024-07-01', rate: 4108, label: 'Jul' },
            { date: '2024-08-01', rate: 4115, label: 'Aug' },
            { date: '2024-09-01', rate: 4112, label: 'Sep' },
            { date: '2024-10-01', rate: 4120, label: 'Oct' },
            { date: '2024-11-01', rate: 4118, label: 'Nov' },
            { date: '2024-12-01', rate: 4125, label: 'Dec' },
        ],
    },
    'rice-exports': {
        id: 'rice-exports',
        title: 'Rice Export Volumes by Month',
        description: 'Monthly rice and paddy export statistics by province and destination country. Includes milled rice, paddy rice, and fragrant rice varieties. Data collected by the Ministry of Agriculture, Forestry and Fisheries in collaboration with customs authorities.',
        ministry: MINISTRIES.maff,
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: '2019-06-15',
        hasGeospatial: true,
        category: 'Agricultural Trade',
        license: 'CC-BY-SA',
        updateFrequency: 'monthly',
        downloadCount: 8320,
        resources: [
            { id: 1, name: 'rice_exports_2024.csv', format: 'CSV', sizeBytes: 456000 },
            { id: 2, name: 'rice_exports_2024.geojson', format: 'GeoJSON', sizeBytes: 1250000 },
        ],
        visualization: {
            defaultView: 'chart',
            chartType: 'bar',
            mapConfig: { center: [12.5657, 104.9910], zoom: 7 },
        },
        data: [
            { month: 'Jan', value: 45000, label: 'Jan' },
            { month: 'Feb', value: 52000, label: 'Feb' },
            { month: 'Mar', value: 48000, label: 'Mar' },
            { month: 'Apr', value: 55000, label: 'Apr' },
            { month: 'May', value: 61000, label: 'May' },
            { month: 'Jun', value: 58000, label: 'Jun' },
            { month: 'Jul', value: 65000, label: 'Jul' },
            { month: 'Aug', value: 72000, label: 'Aug' },
            { month: 'Sep', value: 68000, label: 'Sep' },
            { month: 'Oct', value: 75000, label: 'Oct' },
            { month: 'Nov', value: 78000, label: 'Nov' },
            { month: 'Dec', value: 82000, label: 'Dec' },
        ],
    },
    'angkor-visitors': {
        id: 'angkor-visitors',
        title: 'Angkor Wat Visitor Statistics',
        description: 'Daily ticket sales and visitor counts for Angkor Archaeological Park. Includes breakdown by nationality, ticket type (1-day, 3-day, 7-day passes), and revenue data. Source: APSARA National Authority.',
        ministry: MINISTRIES.mot,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: '2018-03-01',
        hasGeospatial: true,
        category: 'Tourism & Heritage',
        license: 'CC-BY',
        updateFrequency: 'daily',
        downloadCount: 15780,
        resources: [
            { id: 1, name: 'angkor_visitors_2024.csv', format: 'CSV', sizeBytes: 890000 },
            { id: 2, name: 'angkor_visitors_2024.json', format: 'JSON', sizeBytes: 1120000 },
        ],
        visualization: {
            defaultView: 'chart',
            chartType: 'area',
            mapConfig: { center: [13.4125, 103.8670], zoom: 12 },
        },
        data: [
            { month: 'Jan', value: 125000, label: 'Jan' },
            { month: 'Feb', value: 142000, label: 'Feb' },
            { month: 'Mar', value: 138000, label: 'Mar' },
            { month: 'Apr', value: 95000, label: 'Apr' },
            { month: 'May', value: 78000, label: 'May' },
            { month: 'Jun', value: 82000, label: 'Jun' },
            { month: 'Jul', value: 98000, label: 'Jul' },
            { month: 'Aug', value: 105000, label: 'Aug' },
            { month: 'Sep', value: 88000, label: 'Sep' },
            { month: 'Oct', value: 115000, label: 'Oct' },
            { month: 'Nov', value: 135000, label: 'Nov' },
            { month: 'Dec', value: 158000, label: 'Dec' },
        ],
    },
};

export default function DatasetDetailPage() {
    const { id } = useParams();
    const [dataset, setDataset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showCiteModal, setShowCiteModal] = useState(false);

    useEffect(() => {
        // Simulate API fetch
        setLoading(true);
        setTimeout(() => {
            const data = SAMPLE_DATASETS[id] || SAMPLE_DATASETS['usd-exchange-rate'];
            setDataset(data);
            setLoading(false);
        }, 500);
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Unknown';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateCitation = () => {
        if (!dataset) return '';
        return `${dataset.ministry?.name || 'Government of Cambodia'}. (${new Date(dataset.lastUpdated).getFullYear()}). ${dataset.title}. CamData Open Data Portal. Retrieved ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} from https://camdata.gov.kh/datasets/${dataset.id}`;
    };

    if (loading) {
        return <PageLoader text="Loading dataset..." />;
    }

    if (!dataset) {
        return (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <h1>Dataset not found</h1>
                <Link to="/" style={{ color: 'var(--accent-text)' }}>Return home</Link>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-primary, #fff)', minHeight: '100vh' }}>
            {/* Breadcrumb Header */}
            <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                borderBottom: '1px solid var(--border-light, #e2e8f0)',
                padding: '16px 24px',
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
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to all datasets
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>

                    {/* Left Column - Main Content */}
                    <div>
                        {/* Title Section */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    background: 'var(--accent-light, #fff5cc)',
                                    color: 'var(--accent-text, #7A5C00)',
                                    borderRadius: 'var(--radius-full, 9999px)',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                }}>
                                    {dataset.category}
                                </span>
                                {dataset.hasGeospatial && (
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 10px',
                                        background: 'var(--info-bg, #f0f9ff)',
                                        color: 'var(--info, #0ea5e9)',
                                        borderRadius: 'var(--radius-full, 9999px)',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                    }}>
                                        <MapPin size={12} />
                                        Includes Map Data
                                    </span>
                                )}
                            </div>

                            <h1 style={{
                                fontSize: '32px',
                                fontWeight: 700,
                                color: 'var(--text-primary, #1e293b)',
                                marginBottom: '16px',
                                lineHeight: 1.3,
                            }}>
                                {dataset.title}
                            </h1>

                            <p style={{
                                fontSize: '16px',
                                color: 'var(--text-secondary, #64748b)',
                                lineHeight: 1.7,
                                marginBottom: '20px',
                            }}>
                                {dataset.description}
                            </p>

                            {/* Meta row */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '20px',
                                fontSize: '14px',
                                color: 'var(--text-muted, #94a3b8)',
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={16} />
                                    Updated {formatDate(dataset.lastUpdated)}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Download size={16} />
                                    {dataset.downloadCount?.toLocaleString()} downloads
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileText size={16} />
                                    {dataset.license}
                                </span>
                            </div>
                        </div>

                        {/* Visualization Panel - Triple View */}
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <RomduolIconOutline size={18} color="var(--accent-primary, #FFCC33)" />
                                <h2 style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted, #64748b)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    margin: 0,
                                }}>
                                    Data Visualization
                                </h2>
                            </div>
                            <VisualizationPanel
                                data={dataset.data}
                                config={dataset.visualization}
                                title={dataset.title}
                            />
                        </div>

                        {/* Data Preview Table */}
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <RomduolIconOutline size={18} color="var(--accent-primary, #FFCC33)" />
                                <h2 style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted, #64748b)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    margin: 0,
                                }}>
                                    Data Preview
                                </h2>
                            </div>
                            <div style={{
                                background: 'var(--bg-primary, #fff)',
                                border: '1px solid var(--border-light, #e2e8f0)',
                                borderRadius: 'var(--radius-xl, 16px)',
                                overflow: 'hidden',
                            }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                            <tr style={{ background: 'var(--bg-secondary, #f8fafc)' }}>
                                                {dataset.data?.[0] && Object.keys(dataset.data[0]).map(key => (
                                                    <th key={key} style={{
                                                        padding: '14px 16px',
                                                        textAlign: 'left',
                                                        fontWeight: 600,
                                                        color: 'var(--text-primary, #1e293b)',
                                                        borderBottom: '2px solid var(--border-light, #e2e8f0)',
                                                        textTransform: 'capitalize',
                                                    }}>
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataset.data?.slice(0, 5).map((row, i) => (
                                                <tr key={i} style={{
                                                    background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary, #f8fafc)',
                                                }}>
                                                    {Object.values(row).map((val, j) => (
                                                        <td key={j} style={{
                                                            padding: '12px 16px',
                                                            color: 'var(--text-secondary, #64748b)',
                                                            borderBottom: '1px solid var(--border-light, #e2e8f0)',
                                                        }}>
                                                            {typeof val === 'number' ? val.toLocaleString() : val}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{
                                    padding: '12px 16px',
                                    background: 'var(--bg-secondary, #f8fafc)',
                                    borderTop: '1px solid var(--border-light, #e2e8f0)',
                                    fontSize: '13px',
                                    color: 'var(--text-muted, #94a3b8)',
                                    textAlign: 'center',
                                }}>
                                    Showing 5 of {dataset.data?.length || 0} rows • Download full dataset below
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div>
                        {/* Source Card */}
                        <div style={{
                            background: 'var(--bg-primary, #fff)',
                            border: '1px solid var(--border-light, #e2e8f0)',
                            borderRadius: 'var(--radius-xl, 16px)',
                            padding: '24px',
                            marginBottom: '20px',
                        }}>
                            <h3 style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-muted, #64748b)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '16px',
                            }}>
                                Source
                            </h3>
                            <MinistryBadge ministry={dataset.ministry} size="lg" />
                            <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary, #64748b)' }}>
                                <p style={{ marginBottom: '8px' }}>
                                    <strong>Update Frequency:</strong> {dataset.updateFrequency}
                                </p>
                                <p style={{ marginBottom: '8px' }}>
                                    <strong>First Published:</strong> {formatDate(dataset.createdAt)}
                                </p>
                                <p>
                                    <strong>License:</strong> {dataset.license}
                                </p>
                            </div>
                        </div>

                        {/* Download Card */}
                        <div style={{
                            background: 'var(--bg-primary, #fff)',
                            border: '1px solid var(--border-light, #e2e8f0)',
                            borderRadius: 'var(--radius-xl, 16px)',
                            padding: '24px',
                            marginBottom: '20px',
                        }}>
                            <h3 style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-muted, #64748b)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '16px',
                            }}>
                                Download
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {/* CSV Export - Primary */}
                                <button
                                    onClick={() => exportToCSV(dataset.data, dataset.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        background: 'var(--accent-primary, #FFCC33)',
                                        color: 'var(--accent-text, #7A5C00)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-lg, 12px)',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast, 0.15s)',
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Download size={16} />
                                        Download CSV
                                    </span>
                                    <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>
                                        Recommended
                                    </span>
                                </button>

                                {/* JSON Export */}
                                <button
                                    onClick={() => exportToJSON(dataset.data, dataset.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        background: 'var(--bg-secondary, #f8fafc)',
                                        color: 'var(--text-primary, #1e293b)',
                                        border: '1px solid var(--border-light, #e2e8f0)',
                                        borderRadius: 'var(--radius-lg, 12px)',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast, 0.15s)',
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Download size={16} />
                                        Download JSON
                                    </span>
                                </button>

                                {/* PDF Export */}
                                <button
                                    onClick={() => exportToPDF(dataset.data, dataset.title, { ministry: dataset.ministry?.name })}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        background: 'var(--bg-secondary, #f8fafc)',
                                        color: 'var(--text-primary, #1e293b)',
                                        border: '1px solid var(--border-light, #e2e8f0)',
                                        borderRadius: 'var(--radius-lg, 12px)',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast, 0.15s)',
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileDown size={16} />
                                        Print / PDF
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div style={{
                            background: 'var(--bg-primary, #fff)',
                            border: '1px solid var(--border-light, #e2e8f0)',
                            borderRadius: 'var(--radius-xl, 16px)',
                            padding: '24px',
                        }}>
                            <h3 style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-muted, #64748b)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '16px',
                            }}>
                                Actions
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onClick={() => setShowCiteModal(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        background: 'transparent',
                                        color: 'var(--text-primary, #1e293b)',
                                        border: '1px solid var(--border-light, #e2e8f0)',
                                        borderRadius: 'var(--radius-lg, 12px)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast, 0.15s)',
                                    }}
                                >
                                    <Quote size={16} />
                                    Cite this dataset
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        background: 'transparent',
                                        color: 'var(--text-primary, #1e293b)',
                                        border: '1px solid var(--border-light, #e2e8f0)',
                                        borderRadius: 'var(--radius-lg, 12px)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast, 0.15s)',
                                    }}
                                >
                                    {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
                                    {copied ? 'Link copied!' : 'Copy link'}
                                </button>
                                <button
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        background: 'transparent',
                                        color: 'var(--text-primary, #1e293b)',
                                        border: '1px solid var(--border-light, #e2e8f0)',
                                        borderRadius: 'var(--radius-lg, 12px)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast, 0.15s)',
                                    }}
                                >
                                    <ExternalLink size={16} />
                                    View API documentation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Citation Modal */}
            {showCiteModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '24px',
                    }}
                    onClick={() => setShowCiteModal(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '28px',
                            borderRadius: '20px',
                            maxWidth: '540px',
                            width: '100%',
                            boxShadow: 'var(--shadow-xl)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <RomduolIcon size={24} color="var(--accent-primary, #FFCC33)" />
                            <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
                                Cite this Dataset
                            </h3>
                        </div>
                        <div style={{
                            background: 'var(--bg-secondary, #f8fafc)',
                            padding: '20px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            lineHeight: 1.7,
                            marginBottom: '20px',
                            border: '1px solid var(--border-light, #e2e8f0)',
                        }}>
                            {generateCitation()}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(generateCitation());
                                    setShowCiteModal(false);
                                }}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '14px',
                                    background: 'var(--accent-primary, #FFCC33)',
                                    color: 'var(--accent-text, #7A5C00)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                <Copy size={18} />
                                Copy Citation
                            </button>
                            <button
                                onClick={() => setShowCiteModal(false)}
                                style={{
                                    padding: '14px 24px',
                                    background: 'transparent',
                                    color: 'var(--text-secondary, #64748b)',
                                    border: '1px solid var(--border-light, #e2e8f0)',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Responsive Styles */}
            <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
