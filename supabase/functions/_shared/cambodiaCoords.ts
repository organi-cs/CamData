export interface CityCoords {
  id: string;
  name: string;
  provinceSlug: string;
  latitude: number;
  longitude: number;
}

export const CAMBODIA_CITIES: CityCoords[] = [
  { id: 'phnom-penh',    name: 'Phnom Penh',    provinceSlug: 'phnom-penh',     latitude: 11.5564, longitude: 104.9282 },
  { id: 'siem-reap',     name: 'Siem Reap',     provinceSlug: 'siem-reap',      latitude: 13.3671, longitude: 103.8448 },
  { id: 'battambang',    name: 'Battambang',    provinceSlug: 'battambang',     latitude: 13.0957, longitude: 103.2022 },
  { id: 'sihanoukville', name: 'Sihanoukville', provinceSlug: 'preah-sihanouk', latitude: 10.6099, longitude: 103.5261 },
  { id: 'kampot',        name: 'Kampot',        provinceSlug: 'kampot',         latitude: 10.6099, longitude: 104.1814 },
  { id: 'kampong-cham',  name: 'Kampong Cham',  provinceSlug: 'kampong-cham',   latitude: 11.9935, longitude: 105.4638 },
  { id: 'kampong-thom',  name: 'Kampong Thom',  provinceSlug: 'kampong-thom',   latitude: 12.7113, longitude: 104.9041 },
  { id: 'kratie',        name: 'Kratie',        provinceSlug: 'kratie',         latitude: 12.4878, longitude: 106.0188 },
  { id: 'sen-monorom',   name: 'Sen Monorom',   provinceSlug: 'mondulkiri',     latitude: 12.4626, longitude: 107.1880 },
  { id: 'banlung',       name: 'Banlung',       provinceSlug: 'ratanakiri',     latitude: 13.7390, longitude: 106.9855 },
];
