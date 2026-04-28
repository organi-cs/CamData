import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Map, Database } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import '../styles/design-tokens.css';

const PROVINCES = [
  { slug: 'banteay-meanchey', name: 'Banteay Meanchey', nameKm: 'បន្ទាយមានជ័យ', type: 'Province', population: '0.9M', area: '6,679 km²', capital: 'Serei Saophoan', districts: 9, description: 'A northwestern province bordering Thailand, known for Poipet border crossing and Banteay Chhmar temple.', highlights: ['Poipet SEZ', 'Banteay Chhmar Temple', 'Thailand border trade'] },
  { slug: 'battambang', name: 'Battambang', nameKm: 'បាត់ដំបង', type: 'Province', population: '1.0M', area: '11,702 km²', capital: 'Battambang City', districts: 14, description: "Cambodia's second largest city. Known for French colonial architecture, Phare circus, and the bamboo train.", highlights: ['Colonial architecture', 'Phare Circus', 'Bamboo train'] },
  { slug: 'kampong-cham', name: 'Kampong Cham', nameKm: 'កំពង់ចាម', type: 'Province', population: '0.9M', area: '4,549 km²', capital: 'Kampong Cham City', districts: 8, description: 'A major Mekong river province known for rubber plantations, Wat Nokor temple, and the twin temples Phnom Pros and Phnom Srei.', highlights: ['Rubber plantations', 'Wat Nokor', 'Mekong riverside'] },
  { slug: 'kampong-chhnang', name: 'Kampong Chhnang', nameKm: 'កំពង់ឆ្នាំង', type: 'Province', population: '0.5M', area: '5,521 km²', capital: 'Kampong Chhnang City', districts: 8, description: 'Famous for its pottery tradition and floating villages on the Tonle Sap lake.', highlights: ['Traditional pottery', 'Floating villages', 'Tonle Sap lake'] },
  { slug: 'kampong-speu', name: 'Kampong Speu', nameKm: 'កំពង់ស្ពឺ', type: 'Province', population: '0.9M', area: '7,017 km²', capital: 'Chbar Mon', districts: 8, description: 'Home to Phnom Aural, Cambodia\'s highest peak, and palm sugar production.', highlights: ['Phnom Aural', 'Palm sugar', 'Garment factories'] },
  { slug: 'kampong-thom', name: 'Kampong Thom', nameKm: 'កំពង់ធំ', type: 'Province', population: '0.7M', area: '13,814 km²', capital: 'Stung Sen', districts: 8, description: 'Central province along National Highway 6, home to pre-Angkorian Sambor Prei Kuk temples.', highlights: ['Sambor Prei Kuk temples', 'Tonle Sap access', 'Central location'] },
  { slug: 'kampot', name: 'Kampot', nameKm: 'កំពត', type: 'Province', population: '0.6M', area: '4,873 km²', capital: 'Kampot City', districts: 7, description: 'Coastal province famed for Kampot pepper, the Bokor Hill Station, and relaxed riverside atmosphere.', highlights: ['Kampot pepper', 'Bokor Hill Station', 'Riverside charm'] },
  { slug: 'kandal', name: 'Kandal', nameKm: 'កណ្ដាល', type: 'Province', population: '1.2M', area: '3,568 km²', capital: 'Ta Khmau', districts: 11, description: 'Surrounding Phnom Penh, Kandal is the most densely populated province, known for silk weaving and Udong, former capital.', highlights: ['Silk weaving', 'Udong (former capital)', 'Phnom Penh surroundings'] },
  { slug: 'kep', name: 'Kep', nameKm: 'កែប', type: 'Province', population: '0.04M', area: '336 km²', capital: 'Kep City', districts: 2, description: "Cambodia's smallest province, a coastal resort known for fresh crab, French colonial villas, and Koh Tonsay (Rabbit Island).", highlights: ['Fresh crab market', 'Koh Tonsay', 'French villas'] },
  { slug: 'koh-kong', name: 'Koh Kong', nameKm: 'កោះកុង', type: 'Province', population: '0.1M', area: '11,160 km²', capital: 'Koh Kong City', districts: 7, description: 'Vast coastal province with pristine rainforest, Cardamom Mountains, and mangrove ecosystems.', highlights: ['Cardamom Mountains', 'Eco-tourism', 'Gulf of Thailand coast'] },
  { slug: 'kratie', name: 'Kratié', nameKm: 'ក្រចេះ', type: 'Province', population: '0.4M', area: '11,094 km²', capital: 'Kratié City', districts: 5, description: 'Known for the endangered Irrawaddy dolphins in the Mekong river and French colonial architecture.', highlights: ['Irrawaddy dolphins', 'Mekong dolphins', 'Colonial architecture'] },
  { slug: 'mondulkiri', name: 'Mondulkiri', nameKm: 'មណ្ឌលគិរី', type: 'Province', population: '0.1M', area: '14,288 km²', capital: 'Sen Monorom', districts: 5, description: "Cambodia's largest province by area, a highland plateau with elephant sanctuaries, waterfalls, and indigenous communities.", highlights: ['Elephant sanctuary', 'Bou Sraa waterfall', 'Indigenous communities'] },
  { slug: 'oddar-meanchey', name: 'Oddar Meanchey', nameKm: 'ឧត្តរមានជ័យ', type: 'Province', population: '0.3M', area: '6,158 km²', capital: 'Samraong', districts: 5, description: 'Northern border province sharing borders with Thailand, known for border trade and land reform history.', highlights: ['Thailand border', 'Land reform', 'Prasat Preah Vihear access'] },
  { slug: 'pailin', name: 'Pailin', nameKm: 'ប៉ៃលិន', type: 'Province', population: '0.07M', area: '803 km²', capital: 'Pailin City', districts: 2, description: 'Former Khmer Rouge stronghold now known for gemstone mining, fruit production, and border trade.', highlights: ['Gemstone mining', 'Tropical fruits', 'Border town'] },
  { slug: 'phnom-penh', name: 'Phnom Penh', nameKm: 'ភ្នំពេញ', type: 'Capital', population: '2.3M', area: '678 km²', capital: 'Phnom Penh', districts: 14, description: "Cambodia's vibrant capital city on the confluence of the Mekong and Tonle Sap rivers. Home to the Royal Palace, National Museum, and Central Market.", highlights: ['Royal Palace', 'National Museum', 'Toul Sleng Genocide Museum', 'Central Market'] },
  { slug: 'preah-sihanouk', name: 'Preah Sihanouk', nameKm: 'ព្រះសីហនុ', type: 'Province', population: '0.3M', area: '868 km²', capital: 'Sihanoukville', districts: 4, description: "Cambodia's main port city and beach destination. Sihanoukville has Cambodia's only deep-sea port and is the gateway to the southern islands.", highlights: ['Deep-sea port', 'Southern islands', 'Beaches'] },
  { slug: 'preah-vihear', name: 'Preah Vihear', nameKm: 'ព្រះវិហារ', type: 'Province', population: '0.3M', area: '13,788 km²', capital: 'Tbeng Meanchey', districts: 8, description: 'Remote northern province home to Prasat Preah Vihear, a UNESCO World Heritage temple perched on the Dangrek Mountains.', highlights: ['Prasat Preah Vihear (UNESCO)', 'Dangrek Mountains', 'Remote wilderness'] },
  { slug: 'prey-veng', name: 'Prey Veng', nameKm: 'ព្រៃវែង', type: 'Province', population: '1.1M', area: '4,883 km²', capital: 'Prey Veng City', districts: 12, description: 'A Mekong delta province, one of the most densely populated, known for rice cultivation and fisheries.', highlights: ['Rice cultivation', 'Mekong delta', 'Fisheries'] },
  { slug: 'pursat', name: 'Pursat', nameKm: 'ពោធិ៍សាត់', type: 'Province', population: '0.4M', area: '12,692 km²', capital: 'Pursat City', districts: 5, description: 'Known for the Cardamom Mountains, marble quarrying, and Pursat river. Gateway to the western Cardamoms.', highlights: ['Cardamom Mountains', 'Marble quarrying', 'Tonle Sap access'] },
  { slug: 'ratanakiri', name: 'Ratanakiri', nameKm: 'រតនគិរី', type: 'Province', population: '0.2M', area: '10,782 km²', capital: 'Banlung', districts: 8, description: 'Remote northeastern highland province known for volcanic crater lake Yeak Laom, coffee plantations, and diverse indigenous communities.', highlights: ['Yeak Laom crater lake', 'Coffee plantations', 'Indigenous villages'] },
  { slug: 'siem-reap', name: 'Siem Reap', nameKm: 'សៀមរាប', type: 'Province', population: '1.0M', area: '10,299 km²', capital: 'Siem Reap City', districts: 13, description: "Gateway to Angkor Wat, the world's largest religious monument. Siem Reap is Cambodia's top tourist destination.", highlights: ['Angkor Wat (UNESCO)', 'Bayon temple', 'Ta Prohm', 'Tonle Sap lake'] },
  { slug: 'stung-treng', name: 'Stung Treng', nameKm: 'ស្ទឹងត្រែង', type: 'Province', population: '0.2M', area: '11,092 km²', capital: 'Stung Treng City', districts: 5, description: 'Remote northern province at the confluence of the Mekong and Sekong rivers, known for freshwater dolphins.', highlights: ['Mekong-Sekong confluence', 'Freshwater dolphins', 'Laos border'] },
  { slug: 'svay-rieng', name: 'Svay Rieng', nameKm: 'ស្វាយរៀង', type: 'Province', population: '0.5M', area: '2,966 km²', capital: 'Svay Rieng City', districts: 8, description: 'A southern province bordering Vietnam, known for Bavet border crossing and special economic zones.', highlights: ['Bavet border crossing', 'Special economic zones', 'Vietnam border trade'] },
  { slug: 'takeo', name: 'Takéo', nameKm: 'តាកែវ', type: 'Province', population: '0.9M', area: '3,563 km²', capital: 'Takéo City', districts: 10, description: 'Known for the ancient Angkorian temples of Phnom Chisor and Tonle Bati, as well as rice and sugar palm cultivation.', highlights: ['Phnom Chisor temple', 'Tonle Bati', 'Rice cultivation'] },
  { slug: 'tboung-khmum', name: 'Tboung Khmum', nameKm: 'ត្បូងឃ្មុំ', type: 'Province', population: '0.8M', area: '4,601 km²', capital: 'Suong', districts: 6, description: "Cambodia's newest province (2014), split from Kampong Cham. Known for rubber plantations and Mekong river access.", highlights: ['Rubber plantations', 'Newest province (2014)', 'Mekong river'] },
];

export default function ProvinceDetailPage() {
  const { slug } = useParams();
  const province = PROVINCES.find(p => p.slug === slug);

  if (!province) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '16px' }}>Province not found</h1>
        <Link to="/provinces" style={{ color: 'var(--accent-text)', fontWeight: 600 }}>← Back to Provinces</Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <Helmet>
        <title>{province.name} — CamData Provinces</title>
        <meta name="description" content={province.description} />
      </Helmet>

      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link to="/provinces" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            <ArrowLeft size={15} /> All Provinces
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-xl)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={28} color="var(--accent-text)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{province.name}</h1>
                <span style={{ fontSize: '13px', padding: '3px 10px', background: province.type === 'Capital' ? 'var(--accent-light)' : 'var(--bg-tertiary)', color: province.type === 'Capital' ? 'var(--accent-text)' : 'var(--text-muted)', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>
                  {province.type}
                </span>
              </div>
              <p style={{ fontSize: '18px', color: 'var(--text-muted)', margin: 0 }}>{province.nameKm}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
          {/* Main */}
          <div>
            {/* Description */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Overview</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{province.description}</p>
            </div>

            {/* Highlights */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Highlights</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {province.highlights.map(h => (
                  <span key={h} style={{ padding: '6px 14px', background: 'var(--accent-light)', color: 'var(--accent-text)', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 500 }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
              borderRadius: 'var(--radius-xl)',
              height: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #c7d2fe',
            }}>
              <div style={{ textAlign: 'center' }}>
                <Map size={40} color="#4f46e5" />
                <p style={{ marginTop: 12, fontSize: '16px', fontWeight: 600, color: '#312e81' }}>Interactive map</p>
                <p style={{ fontSize: '13px', color: '#4338ca' }}>Province map coming soon</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick facts */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Quick Facts</h3>
              {[
                { icon: Users, label: 'Population', value: province.population },
                { icon: Map, label: 'Area', value: province.area },
                { icon: MapPin, label: 'Capital', value: province.capital },
                { icon: Database, label: 'Districts', value: province.districts.toString() },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="var(--text-muted)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Related data */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Related Data</h3>
              {[
                { to: '/datasets?q=' + province.name, label: `Datasets for ${province.name}` },
                { to: '/exchange-rates', label: 'Exchange Rates' },
                { to: '/air-quality', label: 'Air Quality' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{ display: 'block', padding: '10px 0', color: 'var(--accent-text)', fontSize: '14px', fontWeight: 500, borderBottom: '1px solid var(--border-light)' }}>
                  → {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 320px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
