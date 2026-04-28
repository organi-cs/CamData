import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

/**
 * MinistryBadge - Displays ministry name with consistent styling
 * Truncates long names with tooltip on hover
 * 
 * @param {Object} props
 * @param {Object} props.ministry - Ministry object
 * @param {string} props.ministry.name - Full name
 * @param {string} [props.ministry.abbreviation] - Short code
 * @param {string} [props.size='md'] - 'sm' | 'md' | 'lg'
 * @param {boolean} [props.showIcon=true] - Show building icon
 * @param {function} [props.onClick] - Click handler for linking
 */
export function MinistryBadge({
    ministry,
    size = 'md',
    showIcon = true,
    onClick,
    maxWidth = 200
}) {
    const [showTooltip, setShowTooltip] = useState(false);

    if (!ministry) return null;

    const { name, abbreviation } = ministry;
    const displayName = abbreviation || name;
    const isClickable = !!onClick;

    const sizeStyles = {
        sm: { fontSize: '11px', padding: '3px 8px', iconSize: 12 },
        md: { fontSize: '13px', padding: '5px 12px', iconSize: 14 },
        lg: { fontSize: '14px', padding: '6px 14px', iconSize: 16 },
    };

    const { fontSize, padding, iconSize } = sizeStyles[size] || sizeStyles.md;

    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        fontSize,
        fontWeight: 500,
        background: 'var(--bg-secondary, #f8fafc)',
        color: 'var(--text-secondary, #64748b)',
        borderRadius: 'var(--radius-full, 9999px)',
        border: '1px solid var(--border-light, #e2e8f0)',
        maxWidth,
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all var(--transition-fast, 0.15s)',
        position: 'relative',
    };

    const textStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    };

    const tooltipStyle = {
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '8px',
        padding: '8px 12px',
        background: 'var(--bg-dark, #0f172a)',
        color: 'var(--text-inverse, #fff)',
        fontSize: '12px',
        borderRadius: 'var(--radius-md, 8px)',
        whiteSpace: 'nowrap',
        zIndex: 'var(--z-tooltip, 400)',
        boxShadow: 'var(--shadow-lg)',
        opacity: showTooltip ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity var(--transition-fast, 0.15s)',
    };

    const arrowStyle = {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid var(--bg-dark, #0f172a)',
    };

    return (
        <span
            style={badgeStyle}
            onMouseEnter={() => abbreviation && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={onClick}
            onMouseOver={(e) => {
                if (isClickable) {
                    e.currentTarget.style.background = 'var(--accent-light, #fff5cc)';
                    e.currentTarget.style.borderColor = 'var(--accent-primary, #FFCC33)';
                    e.currentTarget.style.color = 'var(--accent-text, #7A5C00)';
                }
            }}
            onMouseOut={(e) => {
                if (isClickable) {
                    e.currentTarget.style.background = 'var(--bg-secondary, #f8fafc)';
                    e.currentTarget.style.borderColor = 'var(--border-light, #e2e8f0)';
                    e.currentTarget.style.color = 'var(--text-secondary, #64748b)';
                }
            }}
        >
            {showIcon && <Building2 size={iconSize} />}
            <span style={textStyle}>{displayName}</span>

            {/* Tooltip showing full name when abbreviated */}
            {abbreviation && (
                <span style={tooltipStyle}>
                    {name}
                    <span style={arrowStyle} />
                </span>
            )}
        </span>
    );
}

/**
 * MinistryBadgeGroup - Display multiple ministry badges
 */
export function MinistryBadgeGroup({ ministries, maxVisible = 3, size = 'sm' }) {
    if (!ministries || ministries.length === 0) return null;

    const visible = ministries.slice(0, maxVisible);
    const remaining = ministries.length - maxVisible;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            {visible.map((ministry, index) => (
                <MinistryBadge key={ministry.id || index} ministry={ministry} size={size} />
            ))}
            {remaining > 0 && (
                <span style={{
                    fontSize: '12px',
                    color: 'var(--text-muted, #94a3b8)',
                    padding: '3px 8px',
                }}>
                    +{remaining} more
                </span>
            )}
        </div>
    );
}

export default MinistryBadge;
