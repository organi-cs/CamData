import React from 'react';

/**
 * RomduolIcon - Abstract 3-petal geometry of Cambodia's national flower
 * Used as the core identity element throughout CamData
 * 
 * @param {Object} props
 * @param {number} [props.size=24] - Icon size in pixels
 * @param {string} [props.color='currentColor'] - Fill color
 * @param {string} [props.className] - Additional CSS classes
 */
export function RomduolIcon({ size = 24, color = 'currentColor', className = '' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Romduol flower icon"
        >
            {/* Center circle */}
            <circle cx="24" cy="24" r="6" fill={color} opacity="0.9" />

            {/* Three petals arranged 120° apart - abstract teardrop shapes */}
            {/* Petal 1 - Top */}
            <path
                d="M24 4C27 8 30 14 30 20C30 26 27.5 24 24 24C20.5 24 18 26 18 20C18 14 21 8 24 4Z"
                fill={color}
                opacity="0.8"
            />

            {/* Petal 2 - Bottom Left (rotated 120°) */}
            <path
                d="M24 4C27 8 30 14 30 20C30 26 27.5 24 24 24C20.5 24 18 26 18 20C18 14 21 8 24 4Z"
                fill={color}
                opacity="0.8"
                transform="rotate(120 24 24)"
            />

            {/* Petal 3 - Bottom Right (rotated 240°) */}
            <path
                d="M24 4C27 8 30 14 30 20C30 26 27.5 24 24 24C20.5 24 18 26 18 20C18 14 21 8 24 4Z"
                fill={color}
                opacity="0.8"
                transform="rotate(240 24 24)"
            />
        </svg>
    );
}

/**
 * RomduolIconOutline - Line art version for subtle decorations
 */
export function RomduolIconOutline({ size = 24, color = 'currentColor', className = '' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Romduol flower outline"
        >
            <circle cx="24" cy="24" r="5" stroke={color} strokeWidth="1.5" fill="none" />

            <path
                d="M24 6C26.5 10 28.5 15 28.5 20C28.5 23 26.5 22 24 22C21.5 22 19.5 23 19.5 20C19.5 15 21.5 10 24 6Z"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
            />
            <path
                d="M24 6C26.5 10 28.5 15 28.5 20C28.5 23 26.5 22 24 22C21.5 22 19.5 23 19.5 20C19.5 15 21.5 10 24 6Z"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                transform="rotate(120 24 24)"
            />
            <path
                d="M24 6C26.5 10 28.5 15 28.5 20C28.5 23 26.5 22 24 22C21.5 22 19.5 23 19.5 20C19.5 15 21.5 10 24 6Z"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                transform="rotate(240 24 24)"
            />
        </svg>
    );
}

export default RomduolIcon;
