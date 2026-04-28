import React, { useState } from 'react';
import { Download, Quote, MapPin, Calendar, Building2, ExternalLink } from 'lucide-react';

/**
 * DataCard - Reusable card component for displaying dataset search results
 * 
 * @param {Object} props
 * @param {Object} props.dataset - Dataset object
 * @param {string} props.dataset.title - Dataset title
 * @param {string} props.dataset.description - Short description
 * @param {Object} props.dataset.ministry - Ministry object with name
 * @param {string} props.dataset.lastUpdated - ISO date string
 * @param {boolean} [props.dataset.hasGeospatial] - Whether dataset has map data
 * @param {number[]} [props.dataset.sparklineData] - Mini chart data points
 * @param {string} [props.dataset.category] - Category name
 */
export function DataCard({
    dataset,
    onDownload,
    onCite,
    onClick
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [showCiteModal, setShowCiteModal] = useState(false);

    const {
        title,
        description,
        ministry,
        lastUpdated,
        hasGeospatial = false,
        sparklineData = [20, 35, 28, 45, 38, 52, 48, 60, 55, 70],
        category,
        downloadCount = 0,
    } = dataset;

    // Format relative time
    const formatRelativeTime = (dateStr) => {
        if (!dateStr) return 'Unknown';
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    // Generate sparkline SVG path
    const generateSparkline = (data) => {
        if (!data || data.length < 2) return '';
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const width = 100;
        const height = 30;

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return points;
    };

    const cardStyle = {
        background: 'var(--bg-primary, #fff)',
        border: '1px solid var(--border-light, #e2e8f0)',
        borderRadius: 'var(--radius-xl, 16px)',
        padding: '24px',
        transition: 'all var(--transition-base, 0.2s)',
        cursor: 'pointer',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
    };

    const titleStyle = {
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--text-primary, #1e293b)',
        marginBottom: '4px',
        lineHeight: 1.3,
    };

    const descriptionStyle = {
        fontSize: '14px',
        color: 'var(--text-secondary, #64748b)',
        marginBottom: '16px',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    };

    const metaRowStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '13px',
        color: 'var(--text-muted, #94a3b8)',
        marginBottom: '16px',
    };

    const metaItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    };

    const sparklineContainerStyle = {
        background: 'var(--bg-secondary, #f8fafc)',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '12px',
        marginBottom: '16px',
    };

    const actionsStyle = {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    };

    const primaryButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 16px',
        background: 'var(--accent-primary, #FFCC33)',
        color: 'var(--accent-text, #7A5C00)',
        border: 'none',
        borderRadius: 'var(--radius-lg, 12px)',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all var(--transition-fast, 0.15s)',
    };

    const secondaryButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 16px',
        background: 'transparent',
        color: 'var(--text-secondary, #64748b)',
        border: '1px solid var(--border-light, #e2e8f0)',
        borderRadius: 'var(--radius-lg, 12px)',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all var(--transition-fast, 0.15s)',
    };

    const geoBadgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        background: 'var(--info-bg, #f0f9ff)',
        color: 'var(--info, #0ea5e9)',
        borderRadius: 'var(--radius-full, 9999px)',
        fontSize: '12px',
        fontWeight: 500,
    };

    const categoryBadgeStyle = {
        display: 'inline-flex',
        padding: '4px 10px',
        background: 'var(--bg-secondary, #f8fafc)',
        color: 'var(--text-secondary, #64748b)',
        borderRadius: 'var(--radius-full, 9999px)',
        fontSize: '12px',
        fontWeight: 500,
    };

    // Citation modal
    const renderCiteModal = () => {
        if (!showCiteModal) return null;

        const citation = `${ministry?.name || 'Government of Cambodia'}. (${new Date(lastUpdated).getFullYear()}). ${title}. CamData Open Data Portal. Retrieved ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} from https://camdata.gov.kh/datasets/${dataset.id || 'unknown'}`;

        return (
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}
                onClick={() => setShowCiteModal(false)}
            >
                <div
                    style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        maxWidth: '500px',
                        width: '90%',
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
                        Cite this Dataset
                    </h3>
                    <div style={{
                        background: 'var(--bg-secondary, #f8fafc)',
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        marginBottom: '16px',
                    }}>
                        {citation}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(citation);
                                setShowCiteModal(false);
                            }}
                            style={primaryButtonStyle}
                        >
                            Copy Citation
                        </button>
                        <button
                            onClick={() => setShowCiteModal(false)}
                            style={secondaryButtonStyle}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div
                style={cardStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                <div style={headerStyle}>
                    <div style={{ flex: 1 }}>
                        <h3 style={titleStyle}>{title}</h3>
                        {category && <span style={categoryBadgeStyle}>{category}</span>}
                    </div>
                    {hasGeospatial && (
                        <span style={geoBadgeStyle}>
                            <MapPin size={12} />
                            Map Data
                        </span>
                    )}
                </div>

                <p style={descriptionStyle}>{description}</p>

                <div style={metaRowStyle}>
                    {ministry && (
                        <span style={metaItemStyle}>
                            <Building2 size={14} />
                            {ministry.abbreviation || ministry.name}
                        </span>
                    )}
                    <span style={metaItemStyle}>
                        <Calendar size={14} />
                        Updated {formatRelativeTime(lastUpdated)}
                    </span>
                    {downloadCount > 0 && (
                        <span style={metaItemStyle}>
                            <Download size={14} />
                            {downloadCount.toLocaleString()} downloads
                        </span>
                    )}
                </div>

                {/* Sparkline */}
                <div style={sparklineContainerStyle}>
                    <svg width="100%" height="30" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline
                            points={generateSparkline(sparklineData)}
                            fill="none"
                            stroke="var(--accent-primary, #FFCC33)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div style={actionsStyle}>
                    <button
                        style={primaryButtonStyle}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload && onDownload(dataset);
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-hover, #E6B800)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'var(--accent-primary, #FFCC33)'}
                    >
                        <Download size={16} />
                        Download CSV
                    </button>
                    <button
                        style={secondaryButtonStyle}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowCiteModal(true);
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--bg-secondary, #f8fafc)';
                            e.currentTarget.style.borderColor = 'var(--border-medium, #cbd5e1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'var(--border-light, #e2e8f0)';
                        }}
                    >
                        <Quote size={16} />
                        Cite this
                    </button>
                </div>
            </div>

            {renderCiteModal()}
        </>
    );
}

/**
 * DataCardSkeleton - Loading state for DataCard
 */
export function DataCardSkeleton() {
    const skeletonPulse = {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        background: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)',
        backgroundSize: '200% 100%',
    };

    return (
        <div style={{
            background: 'var(--bg-primary, #fff)',
            border: '1px solid var(--border-light, #e2e8f0)',
            borderRadius: 'var(--radius-xl, 16px)',
            padding: '24px',
        }}>
            <div style={{ ...skeletonPulse, height: '24px', width: '70%', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ ...skeletonPulse, height: '16px', width: '40%', borderRadius: '4px', marginBottom: '16px' }} />
            <div style={{ ...skeletonPulse, height: '14px', width: '100%', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ ...skeletonPulse, height: '14px', width: '80%', borderRadius: '4px', marginBottom: '16px' }} />
            <div style={{ ...skeletonPulse, height: '30px', width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ ...skeletonPulse, height: '40px', width: '120px', borderRadius: '12px' }} />
                <div style={{ ...skeletonPulse, height: '40px', width: '100px', borderRadius: '12px' }} />
            </div>
            <style>{`
        @keyframes pulse {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: 0 0; }
        }
      `}</style>
        </div>
    );
}

export default DataCard;
