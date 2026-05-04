import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, Menu, X, Sun, Moon, Globe, Database, LayoutGrid, Code2, CloudSun, AlertTriangle } from 'lucide-react';
import { RomduolIcon } from './ui/RomduolIcon';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';
import '../styles/design-tokens.css';

export default function Nav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { toggleLocale, t, isKhmer } = useI18n();

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  const navLinks = [
    { path: '/datasets', label: 'Datasets', icon: Database },
    { path: '/cluster', label: 'Topics', icon: LayoutGrid },
    { path: '/weather', label: 'Weather', icon: CloudSun },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { path: '/developers', label: 'Developers', icon: Code2 },
  ];

  const linkStyle = (path) => ({
    fontSize: '14px',
    color: isActive(path) ? 'var(--accent-text, #7A5C00)' : 'var(--text-secondary, #64748b)',
    fontWeight: isActive(path) ? 600 : 500,
    background: isActive(path) ? 'var(--accent-light, #fff5cc)' : 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    cursor: 'pointer',
    padding: '8px 14px',
    transition: 'all var(--transition-fast, 0.15s)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });

  const iconButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    background: 'transparent',
    border: '1px solid var(--border-light, #e2e8f0)',
    borderRadius: 'var(--radius-md, 8px)',
    cursor: 'pointer',
    color: 'var(--text-secondary, #64748b)',
    transition: 'all var(--transition-fast, 0.15s)',
  };

  return (
    <nav style={{
      borderBottom: '1px solid var(--border-light, #e2e8f0)',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky, 200)',
      backdropFilter: 'blur(8px)',
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo + Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <RomduolIcon size={28} color="var(--accent-primary, #FFCC33)" />
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              CamData
            </span>
          </Link>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                style={linkStyle(path)}
                onMouseOver={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.background = 'var(--bg-secondary, #f8fafc)';
                    e.currentTarget.style.color = 'var(--text-primary, #1e293b)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary, #64748b)';
                  }
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleLocale}
            style={iconButtonStyle}
            className="desktop-only"
            aria-label="Toggle language"
            title={isKhmer ? 'Switch to English' : 'ប្ដូរទៅភាសាខ្មែរ'}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-secondary, #f8fafc)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '24px' }}>
              {isKhmer ? 'EN' : 'ខ្មែរ'}
            </span>
          </button>

          <button
            onClick={toggleTheme}
            style={iconButtonStyle}
            className="desktop-only"
            aria-label="Toggle theme"
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-secondary, #f8fafc)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/about"
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary, #64748b)',
              padding: '8px 12px',
              border: '1px solid var(--border-light, #e2e8f0)',
              borderRadius: 'var(--radius-md, 8px)',
              textDecoration: 'none',
              transition: 'all var(--transition-fast, 0.15s)',
            }}
            className="desktop-only"
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-secondary, #f8fafc)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            About
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              background: 'transparent',
              border: '1px solid var(--border-light, #e2e8f0)',
              borderRadius: 'var(--radius-md, 8px)',
              cursor: 'pointer',
              color: 'var(--text-secondary, #64748b)',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--bg-primary, #fff)',
          borderBottom: '1px solid var(--border-light, #e2e8f0)',
          padding: '16px 24px',
          boxShadow: 'var(--shadow-lg)',
        }} className="mobile-menu">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                fontSize: '16px',
                color: isActive(path) ? 'var(--accent-text, #7A5C00)' : 'var(--text-primary, #1e293b)',
                fontWeight: isActive(path) ? 600 : 500,
                background: isActive(path) ? 'var(--accent-light, #fff5cc)' : 'transparent',
                borderRadius: 'var(--radius-md, 8px)',
                textDecoration: 'none',
                marginBottom: '4px',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <Link
            to="/about"
            style={{
              display: 'block',
              padding: '12px 16px',
              fontSize: '16px',
              color: 'var(--text-primary, #1e293b)',
              fontWeight: 500,
              textDecoration: 'none',
              marginBottom: '4px',
              borderRadius: 'var(--radius-md, 8px)',
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>

          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-light, #e2e8f0)',
          }}>
            <button
              onClick={toggleLocale}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border-light, #e2e8f0)',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: '14px',
                color: 'var(--text-primary, #1e293b)',
                cursor: 'pointer',
              }}
            >
              <Globe size={16} />
              {isKhmer ? 'English' : 'ខ្មែរ'}
            </button>
            <button
              onClick={toggleTheme}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border-light, #e2e8f0)',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: '14px',
                color: 'var(--text-primary, #1e293b)',
                cursor: 'pointer',
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
