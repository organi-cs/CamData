// ReliefWeb API — free, no key, run by UN OCHA
// https://apidoc.rwlabs.org/

const RELIEFWEB_BASE = 'https://api.reliefweb.int/v1';
const APP_NAME = 'camdata-open-data-portal';

export async function fetchCambodiaReports({ limit = 8, type = 'all' } = {}) {
  const body = {
    appname: APP_NAME,
    limit,
    sort: ['date.created:desc'],
    fields: {
      include: ['title', 'date.created', 'primary_type.name', 'source.name', 'url_alias', 'body-html'],
    },
    filter: {
      operator: 'AND',
      conditions: [
        { field: 'country.iso3', value: 'KHM' },
        ...(type !== 'all' ? [{ field: 'primary_type.name', value: type }] : []),
      ],
    },
  };

  const res = await fetch(`${RELIEFWEB_BASE}/reports?appname=${APP_NAME}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`ReliefWeb returned ${res.status}`);
  const json = await res.json();

  return (json.data ?? []).map((item) => ({
    id: item.id,
    title: item.fields?.title ?? 'Untitled',
    date: item.fields?.date?.created ?? null,
    type: item.fields?.primary_type?.[0]?.name ?? 'Report',
    source: item.fields?.source?.[0]?.name ?? 'ReliefWeb',
    url: `https://reliefweb.int/report/cambodia/${item.fields?.url_alias ?? item.id}`,
  }));
}

export async function fetchCambodiaAlerts({ limit = 5 } = {}) {
  return fetchCambodiaReports({ limit, type: 'Situation Report' });
}
