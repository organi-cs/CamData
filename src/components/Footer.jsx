// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';
import { RomduolIcon } from './ui/RomduolIcon';
import { useI18n } from '../i18n/I18nContext';
import { useTheme } from '../theme/ThemeContext';
import '../styles/design-tokens.css';

export default function Footer() {
    const { t, isKhmer } = useI18n();
    const { isDark } = useTheme();

    const footerLinks = [
        { label: 'Datasets', path: '/search' },
        { label: 'Ministries', path: '/ministries' },
        { label: 'API Docs', path: '/api' },
        { label: 'About', path: '/about' },
    ];

    const dataLinks = [
        { label: 'Exchange Rates', path: '/exchange-rates' },
        { label: 'Air Quality', path: '/air-quality' },
        { label: 'Stock Market', path: '/stock-market' },
        { label: 'Provinces', path: '/provinces' },
    ];

    return (
        <footer style={{
            background: isDark ? 'var(--bg-secondary, #1e293b)' : 'var(--bg-dark, #0f172a)',
            color: 'var(--text-inverse, #f8fafc)',
            padding: '60px 24px 30px',
            marginTop: 'auto',
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Main Footer Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '40px',
                    marginBottom: '40px',
                }}>
                    {/* Brand Column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <RomduolIcon size={32} color="var(--accent-primary, #FFCC33)" />
                            <span style={{ fontSize: '22px', fontWeight: 700 }}>CamData</span>
                        </div>
                        <p style={{
                            fontSize: '14px',
                            color: 'rgba(248, 250, 252, 0.7)',
                            lineHeight: 1.7,
                            marginBottom: '20px',
                        }}>
                            {isKhmer
                                ? 'វេទិកាទិន្នន័យបើកចំហរបស់កម្ពុជាសម្រាប់អ្នកស្រាវជ្រាវ អ្នកកាសែត និងអ្នកច្នៃប្រឌិត។'
                                : 'Cambodia\'s open data platform for researchers, journalists, and innovators.'}
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <a
                                href="https://github.com/organi-cs/camdata"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '36px',
                                    height: '36px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'rgba(248, 250, 252, 0.8)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '36px',
                                    height: '36px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'rgba(248, 250, 252, 0.8)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="mailto:contact@camdata.gov.kh"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '36px',
                                    height: '36px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'rgba(248, 250, 252, 0.8)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '16px',
                            color: 'var(--accent-primary, #FFCC33)',
                        }}>
                            {isKhmer ? 'តំណភ្ជាប់រហ័ស' : 'Quick Links'}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {footerLinks.map(link => (
                                <li key={link.path} style={{ marginBottom: '10px' }}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            color: 'rgba(248, 250, 252, 0.7)',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Data Categories */}
                    <div>
                        <h4 style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '16px',
                            color: 'var(--accent-primary, #FFCC33)',
                        }}>
                            {isKhmer ? 'ទិន្នន័យពេញនិយម' : 'Popular Data'}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {dataLinks.map(link => (
                                <li key={link.path} style={{ marginBottom: '10px' }}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            color: 'rgba(248, 250, 252, 0.7)',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* API/Developer */}
                    <div>
                        <h4 style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '16px',
                            color: 'var(--accent-primary, #FFCC33)',
                        }}>
                            {isKhmer ? 'អ្នកអភិវឌឍន៍' : 'Developers'}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '10px' }}>
                                <a
                                    href="https://data.nbc.gov.kh"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        color: 'rgba(248, 250, 252, 0.7)',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    NBC API <ExternalLink size={12} />
                                </a>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <Link
                                    to="/api"
                                    style={{
                                        color: 'rgba(248, 250, 252, 0.7)',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                    }}
                                >
                                    REST API Docs
                                </Link>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <a
                                    href="https://github.com/organi-cs/camdata"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        color: 'rgba(248, 250, 252, 0.7)',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    GitHub <ExternalLink size={12} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    gap: '16px',
                }}>
                    <p style={{
                        fontSize: '13px',
                        color: 'rgba(248, 250, 252, 0.5)',
                        margin: 0,
                    }}>
                        {isKhmer
                            ? '© ២០២៤ រាជរដ្ឋាភិបាលកម្ពុជា។ ទិន្នន័យផ្សព្វផ្សាយក្រោមអាជ្ញាប័ណ្ណ CC-BY។'
                            : '© 2024 Royal Government of Cambodia. Data published under CC-BY license.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RomduolIcon size={16} color="var(--accent-primary, #FFCC33)" />
                        <span style={{ fontSize: '12px', color: 'rgba(248, 250, 252, 0.5)' }}>
                            Built with Romduol Tech
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
