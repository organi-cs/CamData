# CamData 🇰🇭

I built this because Cambodia's government data exists but is scattered across a dozen ministry websites with no central place to explore it. CamData pulls it together.

**Live site:** [camdata-gamma.vercel.app](https://camdata-gamma.vercel.app)

## What's in it

- **Exchange Rates** — Daily KHR rates from the National Bank of Cambodia. Includes a currency converter and CSV export.
- **Air Quality** — AQI readings across Cambodian provinces, color-coded so you know at a glance whether the air is good or bad.
- **Stock Market** — Trading data from the Cambodia Securities Exchange (CSX).
- **Provinces** — All 25 provinces with Khmer names, population figures, and an interactive map.
- **Topic Dashboards** — World Bank indicators for Cambodia (GDP growth, agriculture, tourism, and more) with real time series charts.

## Tech

React 18 · Recharts · Leaflet · Lucide Icons · Supabase (caching) · Vercel

## Data sources

- [data.mef.gov.kh](https://data.mef.gov.kh) — Ministry of Economy and Finance
- [National Bank of Cambodia](https://www.nbc.gov.kh)
- [Cambodia Securities Exchange](https://csx.com.kh)
- [World Bank Open Data](https://data.worldbank.org) — Cambodia (KHM)
- [WAQI](https://waqi.info) — Air quality

## Run it locally

```bash
cp .env.local.example .env.local  # add your API keys
npm install
npm start
```

## Author

Samputhy Khim · [github.com/organi-cs](https://github.com/organi-cs)
