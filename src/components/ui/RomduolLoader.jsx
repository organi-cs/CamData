import React from 'react';
import { RomduolIcon } from './RomduolIcon';

/**
 * RomduolLoader - Animated loading spinner using Romduol geometry
 * 
 * @param {Object} props
 * @param {number} [props.size=40] - Loader size in pixels
 * @param {string} [props.color='#FFCC33'] - Romduol accent color
 * @param {string} [props.text] - Optional loading text
 */
export function RomduolLoader({ size = 40, color = '#FFCC33', text = '' }) {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
    };

    const spinnerStyle = {
        animation: 'romduol-spin 1.5s linear infinite',
    };

    const textStyle = {
        fontSize: '14px',
        color: '#64748b',
        fontWeight: 500,
    };

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}>
                <RomduolIcon size={size} color={color} />
            </div>
            {text && <span style={textStyle}>{text}</span>}
        </div>
    );
}

/**
 * RomduolPulseLoader - Pulsing version for subtle loading states
 */
export function RomduolPulseLoader({ size = 32, color = '#FFCC33' }) {
    const pulseStyle = {
        animation: 'romduol-pulse 2s ease-in-out infinite',
    };

    return (
        <div style={pulseStyle}>
            <RomduolIcon size={size} color={color} />
        </div>
    );
}

/**
 * RomduolDotsLoader - Three dots animation inspired by petals
 */
export function RomduolDotsLoader({ size = 8, color = '#FFCC33' }) {
    const containerStyle = {
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
    };

    const dotStyle = (delay) => ({
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        animation: 'romduol-pulse 1.4s ease-in-out infinite',
        animationDelay: `${delay}s`,
    });

    return (
        <div style={containerStyle}>
            <div style={dotStyle(0)} />
            <div style={dotStyle(0.2)} />
            <div style={dotStyle(0.4)} />
        </div>
    );
}

/**
 * PageLoader - Full page loading state
 */
export function PageLoader({ text = 'Loading data...' }) {
    const overlayStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        width: '100%',
    };

    return (
        <div style={overlayStyle}>
            <RomduolLoader size={48} text={text} />
        </div>
    );
}

export default RomduolLoader;
