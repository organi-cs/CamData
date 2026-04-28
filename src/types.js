/**
 * @file types.js
 * @description JSDoc type definitions for CamData Open Data Portal
 * Using JSDoc instead of TypeScript for zero-migration cost
 */

/**
 * @typedef {Object} Ministry
 * @property {string} id - UUID
 * @property {string} name - Full name (e.g., "Ministry of Commerce")
 * @property {string} abbreviation - Short code (e.g., "MOC")
 * @property {string} [logoUrl] - Optional ministry logo URL
 * @property {string} [website] - Official website
 */

/**
 * @typedef {'CSV' | 'JSON' | 'GeoJSON' | 'XLSX'} ResourceFormat
 */

/**
 * @typedef {Object} Resource
 * @property {string} id - UUID
 * @property {string} name - File name
 * @property {ResourceFormat} format - Download format
 * @property {string} url - Download URL
 * @property {number} sizeBytes - File size in bytes
 * @property {string} lastModified - ISO 8601 date string
 */

/**
 * @typedef {'bar' | 'line' | 'pie' | 'area'} ChartType
 */

/**
 * @typedef {'map' | 'chart' | 'table'} DefaultView
 */

/**
 * @typedef {Object} MapConfig
 * @property {[number, number]} center - [lat, lng] center point
 * @property {number} zoom - Initial zoom level
 * @property {string} [geoJsonUrl] - URL to GeoJSON boundaries
 */

/**
 * @typedef {Object} VisualizationConfig
 * @property {DefaultView} defaultView - Initial view mode
 * @property {ChartType} [chartType] - Type of chart if applicable
 * @property {string} [xField] - Field name for x-axis
 * @property {string} [yField] - Field name for y-axis
 * @property {MapConfig} [mapConfig] - Map configuration if geospatial
 */

/**
 * @typedef {'country' | 'province' | 'district' | 'commune'} CoverageLevel
 */

/**
 * @typedef {Object} GeospatialCoverage
 * @property {CoverageLevel} level - Geographic coverage level
 * @property {string[]} [regionCodes] - Specific region codes if not whole country
 * @property {boolean} hasCoordinates - Whether data includes lat/lng
 */

/**
 * @typedef {'CC-BY' | 'CC-BY-SA' | 'CC-BY-NC' | 'ODbL' | 'Public Domain'} License
 */

/**
 * @typedef {'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'realtime'} UpdateFrequency
 */

/**
 * @typedef {Object} Dataset
 * @property {string} id - UUID
 * @property {string} title - Dataset title
 * @property {string} description - Full description
 * @property {Ministry} ministry - Source ministry
 * @property {string} category - Data cluster category
 * @property {string[]} tags - Searchable tags
 * @property {License} license - Data license
 * @property {UpdateFrequency} updateFrequency - How often data updates
 * @property {string} lastUpdated - ISO 8601 date string
 * @property {string} createdAt - ISO 8601 date string
 * @property {Resource[]} resources - Available download formats
 * @property {VisualizationConfig} visualization - How to render this data
 * @property {GeospatialCoverage} [geospatial] - Geographic coverage if applicable
 * @property {number} downloadCount - Total downloads
 * @property {boolean} featured - Show on homepage
 */

/**
 * @typedef {Object} DataCluster
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} description - Short description
 * @property {string} icon - Lucide icon name
 * @property {string} color - Hex color for styling
 * @property {string} ministryId - Primary ministry source
 */

// Data Clusters for Cambodia
export const DATA_CLUSTERS = [
  {
    id: 'mekong-water',
    name: 'Mekong River & Water',
    description: 'Water levels, flood alerts, and Tonle Sap monitoring',
    icon: 'Waves',
    color: '#0EA5E9',
    ministryId: 'mowram'
  },
  {
    id: 'agriculture',
    name: 'Agricultural Trade',
    description: 'Rice exports, rubber production, and crop yields',
    icon: 'Wheat',
    color: '#84CC16',
    ministryId: 'maff'
  },
  {
    id: 'garment',
    name: 'Garment & Manufacturing',
    description: 'Factory employment, exports, and SEZ activity',
    icon: 'Factory',
    color: '#F97316',
    ministryId: 'mih'
  },
  {
    id: 'tourism',
    name: 'Tourism & Heritage',
    description: 'Angkor ticket sales, arrivals, and hotel data',
    icon: 'Landmark',
    color: '#A855F7',
    ministryId: 'mot'
  },
  {
    id: 'urban-mobility',
    name: 'Urban Mobility',
    description: 'Traffic incidents, public transport, and parking',
    icon: 'Car',
    color: '#EC4899',
    ministryId: 'mpwt'
  },
  {
    id: 'finance',
    name: 'Financial Markets',
    description: 'Exchange rates, CSX index, and microfinance',
    icon: 'TrendingUp',
    color: '#FFCC33',
    ministryId: 'nbc'
  }
];

// Ministry reference data
export const MINISTRIES = {
  mowram: { id: 'mowram', name: 'Ministry of Water Resources', abbreviation: 'MOWRAM' },
  maff: { id: 'maff', name: 'Ministry of Agriculture, Forestry & Fisheries', abbreviation: 'MAFF' },
  mih: { id: 'mih', name: 'Ministry of Industry & Handicraft', abbreviation: 'MIH' },
  mot: { id: 'mot', name: 'Ministry of Tourism', abbreviation: 'MOT' },
  mpwt: { id: 'mpwt', name: 'Ministry of Public Works & Transport', abbreviation: 'MPWT' },
  nbc: { id: 'nbc', name: 'National Bank of Cambodia', abbreviation: 'NBC' },
  mef: { id: 'mef', name: 'Ministry of Economy & Finance', abbreviation: 'MEF' },
  moc: { id: 'moc', name: 'Ministry of Commerce', abbreviation: 'MOC' }
};
