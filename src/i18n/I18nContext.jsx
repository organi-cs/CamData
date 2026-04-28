// src/i18n/I18nContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import en from './translations/en';
import km from './translations/km';

const translations = { en, km };

const I18nContext = createContext(null);

/**
 * I18n Provider - Manages language state and provides translation function
 */
export function I18nProvider({ children }) {
    // Get initial language from localStorage or default to English
    const [locale, setLocale] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('camdata-locale') || 'en';
        }
        return 'en';
    });

    // Translation function
    const t = useCallback((key, params = {}) => {
        const translation = translations[locale]?.[key] || translations.en[key] || key;

        // Replace placeholders like {count} with actual values
        if (Object.keys(params).length > 0) {
            return Object.entries(params).reduce(
                (str, [param, value]) => str.replace(`{${param}}`, value),
                translation
            );
        }
        return translation;
    }, [locale]);

    // Change language
    const changeLocale = useCallback((newLocale) => {
        if (translations[newLocale]) {
            setLocale(newLocale);
            if (typeof window !== 'undefined') {
                localStorage.setItem('camdata-locale', newLocale);
                // Update document lang attribute
                document.documentElement.lang = newLocale;
            }
        }
    }, []);

    // Toggle between EN and KM
    const toggleLocale = useCallback(() => {
        changeLocale(locale === 'en' ? 'km' : 'en');
    }, [locale, changeLocale]);

    const value = useMemo(() => ({
        locale,
        t,
        changeLocale,
        toggleLocale,
        isKhmer: locale === 'km',
        availableLocales: Object.keys(translations),
    }), [locale, t, changeLocale, toggleLocale]);

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

/**
 * Hook to access i18n context
 * @returns {{ locale: string, t: function, changeLocale: function, toggleLocale: function, isKhmer: boolean }}
 */
export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

export default I18nContext;
