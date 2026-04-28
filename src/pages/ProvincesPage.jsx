import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, CircleMarker, Tooltip as MapTooltip } from 'react-leaflet';
import '../styles/design-tokens.css';

const PROVINCES = [
  { slug: 'banteay-meanchey', name: 'Banteay Meanchey', nameKm: 'បន្ទាយមានជ័យ', type: 'Province', population: '0.9M', capital: 'Serei Saophoan', lat: 13.585, lng: 103.002 },
  { slug: 'battambang', name: 'Battambang', nameKm: 'បាត់ដំបង', type: 'Province', population: '1.0M', capital: 'Battambang City', lat: 13.095, lng: 103.202 },
  { slug: 'kampong-cham', name: 'Kampong Cham', nameKm: 'កំពង់ចាម', type: 'Province', population: '0.9M', capital: 'Kampong Cham City', lat: 12.000, lng: 105.467 },
  { slug: 'kampong-chhnang', name: 'Kampong Chhnang', nameKm: 'កំពង់ឆ្នាំង', type: 'Province', population: '0.5M', capital: 'Kampong Chhnang City', lat: 12.250, lng: 104.667 },
  { slug: 'kampong-speu', name: 'Kampong Speu', nameKm: 'កំពង់ស្ពឺ', type: 'Province', population: '0.9M', capital: 'Chbar Mon', lat: 11.450, lng: 104.520 },
  { slug: 'kampong-thom', name: 'Kampong Thom', nameKm: 'កំពង់ធំ', type: 'Province', population: '0.7M', capital: 'Stung Sen', lat: 12.711, lng: 104.889 },
  { slug: 'kampot', name: 'Kampot', nameKm: 'កំពត', type: 'Province', population: '0.6M', capital: 'Kampot City', lat: 10.617, lng: 104.183 },
  { slug: 'kandal', name: 'Kandal', nameKm: 'កណ្ដាល', type: 'Province', population: '1.2M', capital: 'Ta Khmau', lat: 11.230, lng: 105.120 },
  { slug: 'kep', name: 'Kep', nameKm: 'កែប', type: 'Province', population: '0.04M', capital: 'Kep City', lat: 10.483, lng: 104.317 },
  { slug: 'koh-kong', name: 'Koh Kong', nameKm: 'កោះកុង', type: 'Province', population: '0.1M', capital: 'Koh Kong City', lat: 11.617, lng: 103.000 },
  { slug: 'kratie', name: 'Kratié', nameKm: 'ក្រចេះ', type: 'Province', population: '0.4M', capital: 'Kratié City', lat: 12.488, lng: 106.019 },
  { slug: 'mondulkiri', name: 'Mondulkiri', nameKm: 'មណ្ឌលគិរី', type: 'Province', population: '0.1M', capital: 'Sen Monorom', lat: 12.450, lng: 107.183 },
  { slug: 'oddar-meanchey', name: 'Oddar Meanchey', nameKm: 'ឧត្តរមានជ័យ', type: 'Province', population: '0.3M', capital: 'Samraong', lat: 14.180, lng: 103.520 },
  { slug: 'pailin', name: 'Pailin', nameKm: 'ប៉ៃលិន', type: 'Province', population: '0.07M', capital: 'Pailin City', lat: 12.850, lng: 102.600 },
  { slug: 'phnom-penh', name: 'Phnom Penh', nameKm: 'ភ្នំពេញ', type: 'Capital', population: '2.3M', capital: 'Phnom Penh', lat: 11.556, lng: 104.928 },
  { slug: 'preah-sihanouk', name: 'Preah Sihanouk', nameKm: 'ព្រះសីហនុ', type: 'Province', population: '0.3M', capital: 'Sihanoukville', lat: 10.633, lng: 103.500 },
  { slug: 'preah-vihear', name: 'Preah Vihear', nameKm: 'ព្រះវិហារ', type: 'Province', population: '0.3M', capital: 'Tbeng Meanchey', lat: 13.800, lng: 104.980 },
  { slug: 'prey-veng', name: 'Prey Veng', nameKm: 'ព្រៃវែង', type: 'Province', population: '1.1M', capital: 'Prey Veng City', lat: 11.483, lng: 105.325 },
  { slug: 'pursat', name: 'Pursat', nameKm: 'ពោធិ៍សាត់', type: 'Province', population: '0.4M', capital: 'Pursat City', lat: 12.539, lng: 103.919 },
  { slug: 'ratanakiri', name: 'Ratanakiri', nameKm: 'រតនគិរី', type: 'Province', population: '0.2M', capital: 'Banlung', lat: 13.730, lng: 107.000 },
  { slug: 'siem-reap', name: 'Siem Reap', nameKm: 'សៀមរាប', type: 'Province', population: '1.0M', capital: 'Siem Reap City', lat: 13.363, lng: 103.856 },
  { slug: 'stung-treng', name: 'Stung Treng', nameKm: 'ស្ទឹងត្រែង', type: 'Province', population: '0.2M', capital: 'Stung Treng City', lat: 13.533, lng: 105.967 },
  { slug: 'svay-rieng', name: 'Svay Rieng', nameKm: 'ស្វាយរៀង', type: 'Province', population: '0.5M', capital: 'Svay Rieng City', lat: 11.088, lng: 105.800 },
  { slug: 'takeo', name: 'Takéo', nameKm: 'តាកែវ', type: 'Province', population: '0.9M', capital: 'Takéo City', lat: 10.983, lng: 104.783 },
  { slug: 'tboung-khmum', name: 'Tboung Khmum', nameKm: 'ត្បូងឃ្មុំ', type: 'Province', population: '0.8M', capital: 'Suong', lat: 12.000, lng: 105.650 },
];

function CambodiaMap({ provinces, onProvinceClick }) {
  return (
    <MapContainer
      center={[12.3, 104.5]}
      zoom={7}
      style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      {provinces.map(p => (
        <CircleMarker
          key={p.slug}
          center={[p.lat, p.lng]}
          radius={p.type === 'Capital' ? 10 : 7}
          pathOptions={{
            color: p.type === 'Capital' ? '#1a1a1a' : '#4338ca',
            fillColor: p.type === 'Capital' ? '#FFCC33' : '#818cf8',
            fillOpacity: 0.85,
            weight: 2,
          }}
          eventHandlers={{ click: () => onProvinceClick(p.slug) }}
        >
          <MapTooltip>
            <strong>{p.name}</strong>
            <br />
            {p.nameKm} · Pop. {p.population}
            <br />
            <span style={{ fontSize: 11, color: '#666' }}>Click to explore →</span>
          </MapTooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default function ProvincesPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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

      {/* Leaflet Map */}
      <div style={{ borderRadius: 16, height: 380, overflow: 'hidden', marginBottom: 32, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <CambodiaMap provinces={PROVINCES} onProvinceClick={(slug) => navigate(`/provinces/${slug}`)} />
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
              onMouseOver={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; }}
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
                  onMouseOver={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'none'; }}
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
