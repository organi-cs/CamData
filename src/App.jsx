import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { I18nProvider } from './i18n/I18nContext';
import { ThemeProvider } from './theme/ThemeContext';

import Nav from './components/Nav';
import Footer from './components/Footer';
import { PageLoader } from './components/ui/RomduolLoader';

// Eager-load homepage for fast initial paint
import HomePage from './pages/HomePage';

// Lazy-load all other pages
const ExchangeRatesPage = lazy(() => import('./pages/ExchangeRatesPage'));
const AirQualityPage = lazy(() => import('./pages/AirQualityPage'));
const StockMarketPage = lazy(() => import('./pages/StockMarketPage'));
const ProvincesPage = lazy(() => import('./pages/ProvincesPage'));
const ProvinceDetailPage = lazy(() => import('./pages/ProvinceDetailPage'));
const DatasetDetailPage = lazy(() => import('./pages/DatasetDetailPage'));
const DatasetsPage = lazy(() => import('./pages/DatasetsPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const DataClusterPage = lazy(() => import('./pages/DataClusterPage'));
const TopicsPage = lazy(() => import('./pages/TopicsPage'));
const TopicDashboardPage = lazy(() => import('./pages/TopicDashboardPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DevelopersPage = lazy(() => import('./pages/DevelopersPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

import './styles/design-tokens.css';

const globalStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: var(--bg-primary, #fff);
    color: var(--text-primary, #1e293b);
    line-height: 1.6;
    transition: background 0.3s ease, color 0.3s ease;
  }
  a { text-decoration: none; }
  html { scroll-behavior: smooth; }
  :focus-visible {
    outline: 2px solid var(--accent-primary, #FFCC33);
    outline-offset: 2px;
  }
  [lang="km"] {
    font-family: 'Noto Sans Khmer', 'Khmer OS', system-ui, sans-serif;
  }
  .app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .app-main { flex: 1; }
`;

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <I18nProvider>
          <BrowserRouter>
            <style>{globalStyles}</style>
            <div className="app-wrapper">
              <Nav />
              <main className="app-main">
                <Suspense fallback={<PageLoader text="Loading..." />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />

                    {/* Dataset routes */}
                    <Route path="/datasets" element={<DatasetsPage />} />
                    <Route path="/datasets/:id" element={<DatasetDetailPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />

                    {/* Topics */}
                    <Route path="/topics" element={<TopicsPage />} />
                    <Route path="/topics/:slug" element={<TopicDashboardPage />} />

                    {/* Data Cluster routes (alias for topics) */}
                    <Route path="/cluster/:clusterId" element={<DataClusterPage />} />
                    <Route path="/cluster" element={<TopicsPage />} />

                    {/* Live Data */}
                    <Route path="/exchange-rates" element={<ExchangeRatesPage />} />
                    <Route path="/air-quality" element={<AirQualityPage />} />
                    <Route path="/stock-market" element={<StockMarketPage />} />

                    {/* Provinces */}
                    <Route path="/provinces" element={<ProvincesPage />} />
                    <Route path="/provinces/:slug" element={<ProvinceDetailPage />} />

                    {/* Info */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/developers" element={<DevelopersPage />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
