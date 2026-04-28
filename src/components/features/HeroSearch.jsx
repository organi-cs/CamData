import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { RomduolIcon } from '../ui/RomduolIcon';
import { DATA_CLUSTERS } from '../../types';

/**
 * HeroSearch - Main search component for the landing page
 * Features debounced input, keyboard navigation, and search suggestions
 * 
 * @param {Object} props
 * @param {function} [props.onSearch] - Callback when search is submitted
 * @param {string} [props.placeholder] - Input placeholder text
 */
export function HeroSearch({
    onSearch,
    placeholder = "Search datasets... (e.g. USD exchange rate, rice exports, Phnom Penh)"
}) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);

    // Sample dataset suggestions for demo
    const sampleDatasets = [
        { id: 1, title: 'USD/KHR Exchange Rate', category: 'Financial Markets' },
        { id: 2, title: 'Rice Export Volumes (Monthly)', category: 'Agricultural Trade' },
        { id: 3, title: 'Mekong Daily Water Levels', category: 'Mekong River & Water' },
        { id: 4, title: 'Angkor Wat Ticket Sales', category: 'Tourism & Heritage' },
        { id: 5, title: 'Garment Factory Employment', category: 'Garment & Manufacturing' },
        { id: 6, title: 'CSX Stock Index', category: 'Financial Markets' },
        { id: 7, title: 'Air Quality Index (AQI)', category: 'Urban Mobility' },
        { id: 8, title: 'Rubber Production by Province', category: 'Agricultural Trade' },
    ];

    // Debounced search
    const debouncedSearch = useCallback((searchQuery) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                setIsLoading(true);
                // Simulate API call
                setTimeout(() => {
                    const filtered = sampleDatasets.filter(
                        d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.category.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setSuggestions(filtered.slice(0, 5));
                    setIsLoading(false);
                }, 150);
            } else {
                setSuggestions([]);
            }
        }, 300);
    }, []);

    useEffect(() => {
        debouncedSearch(query);
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, debouncedSearch]);

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && suggestions[activeIndex]) {
                    handleSelectSuggestion(suggestions[activeIndex]);
                } else {
                    handleSubmit();
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setActiveIndex(-1);
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        if (query.trim() && onSearch) {
            onSearch(query);
        }
        setShowSuggestions(false);
    };

    const handleSelectSuggestion = (suggestion) => {
        setQuery(suggestion.title);
        setShowSuggestions(false);
        if (onSearch) {
            onSearch(suggestion.title);
        }
    };

    const containerStyle = {
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        position: 'relative',
    };

    const inputWrapperStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-primary, #fff)',
        border: '2px solid var(--border-light, #e2e8f0)',
        borderRadius: 'var(--radius-xl, 16px)',
        transition: 'all var(--transition-base, 0.2s)',
        boxShadow: showSuggestions ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
    };

    const inputStyle = {
        flex: 1,
        padding: '18px 20px 18px 52px',
        fontSize: '16px',
        border: 'none',
        background: 'transparent',
        outline: 'none',
        color: 'var(--text-primary, #1e293b)',
    };

    const searchIconStyle = {
        position: 'absolute',
        left: '18px',
        color: 'var(--text-muted, #94a3b8)',
        pointerEvents: 'none',
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        marginRight: '8px',
        background: 'var(--accent-primary, #FFCC33)',
        color: 'var(--accent-text, #7A5C00)',
        border: 'none',
        borderRadius: 'var(--radius-lg, 12px)',
        fontWeight: 600,
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'all var(--transition-base, 0.2s)',
    };

    const suggestionsStyle = {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: '8px',
        background: 'var(--bg-primary, #fff)',
        border: '1px solid var(--border-light, #e2e8f0)',
        borderRadius: 'var(--radius-lg, 12px)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 'var(--z-dropdown, 100)',
        overflow: 'hidden',
    };

    const suggestionItemStyle = (isActive) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        cursor: 'pointer',
        background: isActive ? 'var(--accent-light, #fff5cc)' : 'transparent',
        borderBottom: '1px solid var(--border-light, #e2e8f0)',
        transition: 'background var(--transition-fast, 0.15s)',
    });

    const categoryBadgeStyle = {
        fontSize: '12px',
        padding: '4px 10px',
        background: 'var(--bg-secondary, #f8fafc)',
        color: 'var(--text-secondary, #64748b)',
        borderRadius: 'var(--radius-full, 9999px)',
    };

    return (
        <div style={containerStyle}>
            <div
                style={inputWrapperStyle}
                onFocus={() => query.trim() && setShowSuggestions(true)}
            >
                <Search size={20} style={searchIconStyle} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                        setActiveIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.trim() && suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={placeholder}
                    style={inputStyle}
                    aria-label="Search datasets"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions}
                />
                <button
                    onClick={handleSubmit}
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.background = 'var(--accent-hover, #E6B800)'}
                    onMouseOut={(e) => e.target.style.background = 'var(--accent-primary, #FFCC33)'}
                >
                    <RomduolIcon size={18} color="currentColor" />
                    Search
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div style={suggestionsStyle} role="listbox">
                    {isLoading ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Searching...
                        </div>
                    ) : (
                        suggestions.map((suggestion, index) => (
                            <div
                                key={suggestion.id}
                                role="option"
                                aria-selected={index === activeIndex}
                                style={suggestionItemStyle(index === activeIndex)}
                                onClick={() => handleSelectSuggestion(suggestion)}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <span style={{ fontWeight: 500, color: 'var(--text-primary, #1e293b)' }}>
                                    {suggestion.title}
                                </span>
                                <span style={categoryBadgeStyle}>
                                    {suggestion.category}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Quick Links */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px'
            }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted, #94a3b8)' }}>
                    Popular:
                </span>
                {['Exchange Rates', 'Rice Exports', 'Air Quality', 'Tourism'].map(term => (
                    <button
                        key={term}
                        onClick={() => {
                            setQuery(term);
                            if (onSearch) onSearch(term);
                        }}
                        style={{
                            padding: '4px 12px',
                            fontSize: '13px',
                            background: 'var(--bg-secondary, #f8fafc)',
                            border: '1px solid var(--border-light, #e2e8f0)',
                            borderRadius: 'var(--radius-full, 9999px)',
                            color: 'var(--text-secondary, #64748b)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast, 0.15s)',
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'var(--accent-light, #fff5cc)';
                            e.target.style.borderColor = 'var(--accent-primary, #FFCC33)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'var(--bg-secondary, #f8fafc)';
                            e.target.style.borderColor = 'var(--border-light, #e2e8f0)';
                        }}
                    >
                        {term}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default HeroSearch;
