import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import '../styles/design-tokens.css';

const PROVINCES = [
  { slug: 'banteay-meanchey', name: 'Banteay Meanchey', nameKm: 'បន្ទាយមានជ័យ', type: 'Province', population: '0.9M', capital: 'Serei Saophoan' },
  { slug: 'battambang', name: 'Battambang', nameKm: 'បាត់ដំបង', type: 'Province', population: '1.0M', capital: 'Battambang City' },
  { slug: 'kampong-cham', name: 'Kampong Cham', nameKm: 'កំពង់ចាម', type: 'Province', population: '0.9M', capital: 'Kampong Cham City' },
  { slug: 'kampong-chhnang', name: 'Kampong Chhnang', nameKm: 'កំពង់ឆ្នាំង', type: 'Province', population: '0.5M', capital: 'Kampong Chhnang City' },
  { slug: 'kampong-speu', name: 'Kampong Speu', nameKm: 'កំពង់ស្ពឺ', type: 'Province', population: '0.9M', capital: 'Chbar Mon' },
  { slug: 'kampong-thom', name: 'Kampong Thom', nameKm: 'កំពង់ធំ', type: 'Province', population: '0.7M', capital: 'Stung Sen' },
  { slug: 'kampot', name: 'Kampot', nameKm: 'កំពត', type: 'Province', population: '0.6M', capital: 'Kampot City' },
  { slug: 'kandal', name: 'Kandal', nameKm: 'កណ្ដាល', type: 'Province', population: '1.2M', capital: 'Ta Khmau' },
  { slug: 'kep', name: 'Kep', nameKm: 'កែប', type: 'Province', population: '0.04M', capital: 'Kep City' },
  { slug: 'koh-kong', name: 'Koh Kong', nameKm: 'កោះកុង', type: 'Province', population: '0.1M', capital: 'Koh Kong City' },
  { slug: 'kratie', name: 'Kratié', nameKm: 'ក្រចេះ', type: 'Province', population: '0.4M', capital: 'Kratié City' },
  { slug: 'mondulkiri', name: 'Mondulkiri', nameKm: 'មណ្ឌលគិរី', type: 'Province', population: '0.1M', capital: 'Sen Monorom' },
  { slug: 'oddar-meanchey', name: 'Oddar Meanchey', nameKm: 'ឧត្តរមានជ័យ', type: 'Province', population: '0.3M', capital: 'Samraong' },
  { slug: 'pailin', name: 'Pailin', nameKm: 'ប៉ៃលិន', type: 'Province', population: '0.07M', capital: 'Pailin City' },
  { slug: 'phnom-penh', name: 'Phnom Penh', nameKm: 'ភ្នំពេញ', type: 'Capital', population: '2.3M', capital: 'Phnom Penh' },
  { slug: 'preah-sihanouk', name: 'Preah Sihanouk', nameKm: 'ព្រះសីហនុ', type: 'Province', population: '0.3M', capital: 'Sihanoukville' },
  { slug: 'preah-vihear', name: 'Preah Vihear', nameKm: 'ព្រះវិហារ', type: 'Province', population: '0.3M', capital: 'Tbeng Meanchey' },
  { slug: 'prey-veng', name: 'Prey Veng', nameKm: 'ព្រៃវែង', type: 'Province', population: '1.1M', capital: 'Prey Veng City' },
  { slug: 'pursat', name: 'Pursat', nameKm: 'ពោធិ៍សាត់', type: 'Province', population: '0.4M', capital: 'Pursat City' },
  { slug: 'ratanakiri', name: 'Ratanakiri', nameKm: 'រតនគិរី', type: 'Province', population: '0.2M', capital: 'Banlung' },
  { slug: 'siem-reap', name: 'Siem Reap', nameKm: 'សៀមរាប', type: 'Province', population: '1.0M', capital: 'Siem Reap City' },
  { slug: 'stung-treng', name: 'Stung Treng', nameKm: 'ស្ទឹងត្រែង', type: 'Province', population: '0.2M', capital: 'Stung Treng City' },
  { slug: 'svay-rieng', name: 'Svay Rieng', nameKm: 'ស្វាយរៀង', type: 'Province', population: '0.5M', capital: 'Svay Rieng City' },
  { slug: 'takeo', name: 'Takéo', nameKm: 'តាកែវ', type: 'Province', population: '0.9M', capital: 'Takéo City' },
  { slug: 'tboung-khmum', name: 'Tboung Khmum', nameKm: 'ត្បូងឃ្មុំ', type: 'Province', population: '0.8M', capital: 'Suong' },
];

export default function ProvincesPage() {
  const [search, setSearch] = useState('');

  const filtered = PROVINCES.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.nameKm.includes(search) ||
    p.capital.toLowerCase().includes(search.toLowerCase())
  );

  const capital = filtered.find(p => p.type === 'Capital');
  const provinces = filtered.filter(p => p.type !== 'Capital');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <Helmet>
        <title>Provinces — CamData</title>
        <meta name="description" content="Explore Cambodia's 25 provinces and capital. Population, area, capital city, and available datasets for each province." />
      </Helmet>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <MapPin size={28} color="var(--accent-primary, #FFCC33)" />
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Provinces</h1>
        </div>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Cambodia's 25 provinces and capital city</p>
      </div>

      {/* Map Placeholder */}
      <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', borderRadius: 16, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, border: '1px solid #c7d2fe' }}>
        <div style={{ textAlign: 'center' }}>
          <MapPin size={44} color="#4338ca" />
          <p style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: '#312e81' }}>Interactive Map</p>
          <p style={{ fontSize: 14, color: '#4338ca', marginTop: 4 }}>Click a province card below to explore its data</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24, maxWidth: 440 }}>
        <div style={{ position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search provinces, capitals… (e.g. Siem Reap, ភ្នំពេញ)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 14px 12px 42px', fontSize: 14, border: '1px solid var(--border-light)', borderRadius: 10, outline: 'none', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          />
        </div>
        {search && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Capital */}
      {capital && (
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Capital</p>
          <Link to={`/provinces/${capital.slug}`} style={{ textDecoration: 'none' }}>
            <div
              style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--bg-primary) 100%)', border: '1px solid var(--accent-primary)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{capital.name}</h3>
                  <span style={{ fontSize: 12, padding: '2px 8px', background: 'var(--accent-primary)', color: 'var(--accent-text)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>Capital</span>
                </div>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>{capital.nameKm} · Population {capital.population}</p>
              </div>
              <ArrowRight size={20} color="var(--accent-text)" />
            </div>
          </Link>
        </div>
      )}

      {/* Provinces Grid */}
      {provinces.length > 0 && (
        <>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
            Provinces ({provinces.length})
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {provinces.map(province => (
              <Link key={province.slug} to={`/provinces/${province.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 12, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{province.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{province.nameKm}</p>
                    <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>{province.capital}</span>
                      <span>·</span>
                      <span>{province.population}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <MapPin size={32} style={{ marginBottom: 12 }} />
          <p>No provinces match "{search}"</p>
        </div>
      )}
    </div>
  );
}
