export const WORLD_BANK_INDICATORS = [
  // Population / general
  { code: 'SP.POP.TOTL',       name: 'Population, total',                                    clusterId: 'finance',     unit: 'people' },
  { code: 'SP.DYN.LE00.IN',    name: 'Life expectancy at birth (years)',                      clusterId: 'health',      unit: 'years' },
  { code: 'SE.ADT.LITR.ZS',    name: 'Literacy rate, adult total (%)',                        clusterId: 'labour',      unit: '%' },
  { code: 'IT.NET.USER.ZS',    name: 'Individuals using the Internet (% of population)',      clusterId: 'environment', unit: '%' },

  // Finance
  { code: 'NY.GDP.MKTP.KD.ZG', name: 'GDP growth (annual %)',                              clusterId: 'finance',     unit: '%' },
  { code: 'NY.GDP.PCAP.CD',    name: 'GDP per capita (current US$)',                       clusterId: 'finance',     unit: 'USD' },
  { code: 'FP.CPI.TOTL.ZG',   name: 'Inflation, consumer prices (annual %)',               clusterId: 'finance',     unit: '%' },
  { code: 'SI.POV.NAHC',      name: 'Poverty headcount ratio at national poverty line (%)', clusterId: 'finance',     unit: '%' },

  // Agriculture
  { code: 'NV.AGR.TOTL.ZS',   name: 'Agriculture, forestry & fishing, value added (% of GDP)', clusterId: 'agriculture', unit: '%' },
  { code: 'AG.LND.FRST.ZS',   name: 'Forest area (% of land area)',                       clusterId: 'agriculture', unit: '%' },

  // Tourism
  { code: 'ST.INT.ARVL',      name: 'International tourism, number of arrivals',           clusterId: 'tourism',     unit: 'arrivals' },

  // Garment / Trade
  { code: 'NE.EXP.GNFS.ZS',   name: 'Exports of goods and services (% of GDP)',           clusterId: 'garment',     unit: '%' },

  // Environment
  { code: 'EN.ATM.CO2E.PC',   name: 'CO2 emissions (metric tons per capita)',             clusterId: 'environment', unit: 'tCO2/capita' },
  { code: 'EG.ELC.ACCS.ZS',   name: 'Access to electricity (% of population)',            clusterId: 'environment', unit: '%' },
  { code: 'ER.H2O.FWTL.ZS',   name: 'Annual freshwater withdrawals (% of internal resources)', clusterId: 'environment', unit: '%' },

  // Labour
  { code: 'SL.UEM.TOTL.ZS',   name: 'Unemployment, total (% of labour force)',            clusterId: 'labour',      unit: '%' },
  { code: 'SL.TLF.CACT.ZS',   name: 'Labour force participation rate (% ages 15+)',       clusterId: 'labour',      unit: '%' },
  { code: 'SL.AGR.EMPL.ZS',   name: 'Employment in agriculture (% of total employment)',  clusterId: 'labour',      unit: '%' },
  { code: 'SL.IND.EMPL.ZS',   name: 'Employment in industry (% of total employment)',     clusterId: 'labour',      unit: '%' },
  { code: 'SL.SRV.EMPL.ZS',   name: 'Employment in services (% of total employment)',     clusterId: 'labour',      unit: '%' },
  { code: 'SL.EMP.TOTL.SP.ZS', name: 'Employment to population ratio, 15+ (%)',           clusterId: 'labour',      unit: '%' },
];
