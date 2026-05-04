// NASA POWER (Prediction of Worldwide Energy Resources)
// Free, no API key, CORS-enabled. Uses 30-year climatological averages.
// https://power.larc.nasa.gov/docs/services/api/

const NASA_POWER_BASE = 'https://power.larc.nasa.gov/api/temporal/climatology/point';

// Phnom Penh centroid — representative of lowland Cambodia
const CAMBODIA_LAT = 11.5564;
const CAMBODIA_LON = 104.9282;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_KEYS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export async function fetchCambodiaClimate() {
  const params = new URLSearchParams({
    parameters: 'T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M',
    community: 'RE',
    longitude: String(CAMBODIA_LON),
    latitude: String(CAMBODIA_LAT),
    format: 'JSON',
    header: 'true',
    'start': '2001',
    'end': '2020',
  });

  const res = await fetch(`${NASA_POWER_BASE}?${params}`);
  if (!res.ok) throw new Error(`NASA POWER returned ${res.status}`);
  const json = await res.json();

  const param = json?.properties?.parameter;
  if (!param) throw new Error('Unexpected NASA POWER response shape');

  const temperature = MONTH_KEYS.map((key, i) => ({
    label: MONTHS[i],
    value: param.T2M?.[key] ?? null,
  }));

  const precipitation = MONTH_KEYS.map((key, i) => ({
    label: MONTHS[i],
    value: param.PRECTOTCORR?.[key] ?? null,
  }));

  const solar = MONTH_KEYS.map((key, i) => ({
    label: MONTHS[i],
    value: param.ALLSKY_SFC_SW_DWN?.[key] ?? null,
  }));

  const humidity = MONTH_KEYS.map((key, i) => ({
    label: MONTHS[i],
    value: param.RH2M?.[key] ?? null,
  }));

  return {
    annualTemp: param.T2M?.ANN ?? null,
    annualRain: param.PRECTOTCORR?.ANN ?? null,
    annualSolar: param.ALLSKY_SFC_SW_DWN?.ANN ?? null,
    temperature,
    precipitation,
    solar,
    humidity,
    source: 'NASA POWER (2001–2020 climatology)',
    attribution: 'These data were obtained from the NASA Langley Research Center (LaRC) POWER Project funded through the NASA Earth Science/Applied Science Program.',
  };
}
