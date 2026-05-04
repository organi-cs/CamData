import { DATA_CLUSTERS, MINISTRIES } from '../types';

const MINISTRY_SOURCE_MAP = new Map([
  ['National Bank of Cambodia', MINISTRIES.nbc],
  ['Ministry of Agriculture, Forestry & Fisheries', MINISTRIES.maff],
  ['Ministry of Tourism', MINISTRIES.mot],
  ['Ministry of Water Resources', MINISTRIES.mowram],
  ['Ministry of Industry & Handicraft', MINISTRIES.mih],
  ['Ministry of Public Works & Transport', MINISTRIES.mpwt],
  ['Ministry of Commerce', MINISTRIES.moc],
  ['Ministry of Economy & Finance', MINISTRIES.mef],
]);

export const DATASET_CATALOG = [
  {
    id: 'usd-exchange-rate',
    title: 'USD/KHR Daily Exchange Rate',
    description: 'Official exchange rates from the National Bank of Cambodia, updated every business day.',
    ministry: MINISTRIES.nbc,
    source: 'National Bank of Cambodia',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-28T08:00:00+07:00',
    hasGeospatial: false,
    category: 'Financial Markets',
    clusterId: 'finance',
    format: 'CSV',
    frequency: 'Daily',
    apiEndpoint: '/realtime-api/exchange-rate',
    isLive: true,
  },
  {
    id: 'rice-exports',
    title: 'Rice Export Volumes by Month',
    description: 'Monthly rice and paddy export statistics by province and destination country.',
    ministry: MINISTRIES.maff,
    source: 'Ministry of Agriculture, Forestry & Fisheries',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-21T08:00:00+07:00',
    hasGeospatial: true,
    category: 'Agricultural Trade',
    clusterId: 'agriculture',
    format: 'CSV',
    frequency: 'Monthly',
    isLive: false,
  },
  {
    id: 'angkor-visitors',
    title: 'Angkor Wat Visitor Statistics',
    description: 'Daily ticket sales and visitor counts for Angkor Archaeological Park.',
    ministry: MINISTRIES.mot,
    source: 'Ministry of Tourism',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-26T08:00:00+07:00',
    hasGeospatial: true,
    category: 'Tourism & Heritage',
    clusterId: 'tourism',
    format: 'JSON',
    frequency: 'Daily',
    isLive: false,
  },
  {
    id: 'mekong-water-levels',
    title: 'Mekong River Daily Water Levels',
    description: 'Daily water level readings from monitoring stations along the Mekong and Tonle Sap.',
    ministry: MINISTRIES.mowram,
    source: 'Ministry of Water Resources',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-28T08:00:00+07:00',
    hasGeospatial: true,
    category: 'Mekong River & Water',
    clusterId: 'mekong-water',
    format: 'CSV',
    frequency: 'Daily',
    isLive: true,
  },
  {
    id: 'garment-employment',
    title: 'Garment Factory Employment Statistics',
    description: 'Monthly employment data from garment and textile factories across Cambodia.',
    ministry: MINISTRIES.mih,
    source: 'Ministry of Industry & Handicraft',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-14T08:00:00+07:00',
    hasGeospatial: true,
    category: 'Garment & Manufacturing',
    clusterId: 'garment',
    format: 'XLSX',
    frequency: 'Monthly',
    isLive: false,
  },
  {
    id: 'traffic-incidents',
    title: 'Road Traffic Incidents (Phnom Penh)',
    description: 'Daily traffic accident reports, locations, and severity data for Phnom Penh.',
    ministry: MINISTRIES.mpwt,
    source: 'Ministry of Public Works & Transport',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-27T08:00:00+07:00',
    hasGeospatial: true,
    category: 'Urban Mobility',
    clusterId: 'urban-mobility',
    format: 'GeoJSON',
    frequency: 'Daily',
    isLive: false,
  },
  {
    id: 'rubber-production',
    title: 'Rubber Production by Province',
    description: 'Annual rubber latex production statistics by province and processing method.',
    ministry: MINISTRIES.maff,
    source: 'Ministry of Agriculture, Forestry & Fisheries',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-03-29T08:00:00+07:00',
    hasGeospatial: true,
    category: 'Agricultural Trade',
    clusterId: 'agriculture',
    format: 'CSV',
    frequency: 'Annual',
    isLive: false,
  },
  {
    id: 'csx-index',
    title: 'CSX Stock Market Index',
    description: 'Daily Cambodia Securities Exchange index and trading data for all listed companies.',
    ministry: MINISTRIES.nbc,
    source: 'National Bank of Cambodia',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-28T08:00:00+07:00',
    hasGeospatial: false,
    category: 'Financial Markets',
    clusterId: 'finance',
    format: 'JSON',
    frequency: 'Daily',
    apiEndpoint: '/realtime-api/csx-index',
    isLive: true,
  },
  {
    id: 'tonle-sap-levels',
    title: 'Tonle Sap Lake Water Levels',
    description: 'Daily water level measurements and seasonal flow patterns for Tonle Sap Lake.',
    ministry: MINISTRIES.mowram,
    source: 'Ministry of Water Resources',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-27T08:00:00+07:00',
    hasGeospatial: true,
    category: 'Mekong River & Water',
    clusterId: 'mekong-water',
    format: 'CSV',
    frequency: 'Daily',
    isLive: false,
  },
  {
    id: 'international-arrivals',
    title: 'International Arrivals by Nationality',
    description: 'Monthly international visitor arrivals to Cambodia broken down by nationality and entry point.',
    ministry: MINISTRIES.mot,
    source: 'Ministry of Tourism',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-18T08:00:00+07:00',
    hasGeospatial: false,
    category: 'Tourism & Heritage',
    clusterId: 'tourism',
    format: 'CSV',
    frequency: 'Monthly',
    isLive: false,
  },
  {
    id: 'garment-exports',
    title: 'Garment Export Values',
    description: 'Monthly garment and textile export values by destination country and product category.',
    ministry: MINISTRIES.moc,
    source: 'Ministry of Commerce',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-07T08:00:00+07:00',
    hasGeospatial: false,
    category: 'Garment & Manufacturing',
    clusterId: 'garment',
    format: 'XLSX',
    frequency: 'Monthly',
    isLive: false,
  },
  {
    id: 'microfinance',
    title: 'Microfinance Loan Disbursements',
    description: 'Monthly microfinance lending statistics by province, institution, and loan type.',
    ministry: MINISTRIES.nbc,
    source: 'National Bank of Cambodia',
    sourceUrl: 'https://data.mef.gov.kh',
    lastUpdated: '2026-04-13T08:00:00+07:00',
    hasGeospatial: true,
    category: 'Financial Markets',
    clusterId: 'finance',
    format: 'CSV',
    frequency: 'Monthly',
    isLive: false,
  },
];

const DATASET_BY_ID = new Map(DATASET_CATALOG.map((dataset) => [dataset.id, dataset]));
const CLUSTER_NAME_BY_ID = new Map(DATA_CLUSTERS.map((cluster) => [cluster.id, cluster.name]));

function inferMinistry(source, fallbackMinistry) {
  if (source && MINISTRY_SOURCE_MAP.has(source)) {
    return MINISTRY_SOURCE_MAP.get(source);
  }

  return fallbackMinistry || MINISTRIES.mef;
}

export function normalizeDatasetRow(row) {
  const fallback = DATASET_BY_ID.get(row.id) || {};
  const formats = Array.isArray(row.formats) && row.formats.length
    ? row.formats
    : fallback.format
      ? [fallback.format]
      : ['CSV'];

  return {
    id: row.id,
    title: row.title || fallback.title || row.id,
    description: row.description || fallback.description || '',
    ministry: inferMinistry(row.source, fallback.ministry),
    lastUpdated: row.last_updated
      ? `${row.last_updated}T00:00:00.000Z`
      : row.updated_at || row.created_at || fallback.lastUpdated,
    hasGeospatial: formats.includes('GeoJSON') || fallback.hasGeospatial || false,
    category: fallback.category || CLUSTER_NAME_BY_ID.get(row.cluster_id) || 'Official Dataset',
    clusterId: row.cluster_id || fallback.clusterId || 'all',
    sparklineData: null,
    downloadCount: 0,
    format: formats[0],
    formats,
    frequency: row.frequency || fallback.frequency || 'Unknown',
    source: row.source || fallback.source || 'Government of Cambodia',
    sourceUrl: row.source_url || fallback.sourceUrl || null,
    apiEndpoint: row.api_endpoint || fallback.apiEndpoint || null,
    isLive: typeof row.is_live === 'boolean' ? row.is_live : fallback.isLive || false,
  };
}

export function buildDatasetSeedRows() {
  return DATASET_CATALOG.map((dataset) => ({
    id: dataset.id,
    title: dataset.title,
    description: dataset.description,
    source: dataset.source,
    source_url: dataset.sourceUrl,
    cluster_id: dataset.clusterId,
    formats: [dataset.format],
    frequency: dataset.frequency,
    last_updated: dataset.lastUpdated.slice(0, 10),
    record_count: null,
    api_endpoint: dataset.apiEndpoint || null,
    is_live: dataset.isLive,
  }));
}

export const DATASET_FORMATS = ['all', 'CSV', 'JSON', 'XLSX', 'GeoJSON'];
