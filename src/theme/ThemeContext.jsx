// src/theme/ThemeContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * Theme Provider - Manages dark/light mode state
 */
export function ThemeProvider({ children }) {
    // Get initial theme from localStorage or system preference
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('camdata-theme');
            if (saved) return saved;

            // Check system preference
            if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    // Apply theme to document
    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('camdata-theme', theme);
        }
    }, [theme]);

    // Toggle theme
    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    // Set specific theme
    const setThemeMode = useCallback((newTheme) => {
        if (newTheme === 'light' || newTheme === 'dark') {
            setTheme(newTheme);
        }
    }, []);

    const value = useMemo(() => ({
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme: setThemeMode,
    }), [theme, toggleTheme, setThemeMode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access theme context
 * @returns {{ theme: string, isDark: boolean, toggleTheme: function, setTheme: function }}
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;
