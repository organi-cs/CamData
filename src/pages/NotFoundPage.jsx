import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Home, Database } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { RomduolIcon } from '../components/ui/RomduolIcon';
import '../styles/design-tokens.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <Helmet>
        <title>Page Not Found — CamData</title>
      </Helmet>

      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 96, height: 96, borderRadius: '50%', background: 'var(--accent-light)', marginBottom: '24px' }}>
          <RomduolIcon size={48} color="var(--accent-primary)" />
        </div>

        <div style={{ fontSize: '80px', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1, marginBottom: '8px' }}>404</div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Page not found</h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.6 }}>
          The page you're looking for doesn't exist. It may have been moved, or you might have followed a broken link.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
          >
            <ArrowLeft size={16} /> Go back
          </button>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'var(--accent-primary)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: 600 }}
          >
            <Home size={16} /> Home
          </Link>
        </div>

        <div style={{ marginTop: '48px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <Link to="/datasets" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-text)', fontSize: '14px', fontWeight: 500 }}>
            <Database size={15} /> Browse Datasets
          </Link>
          <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-text)', fontSize: '14px', fontWeight: 500 }}>
            <Search size={15} /> Search
          </Link>
        </div>
      </div>
    </div>
  );
}
