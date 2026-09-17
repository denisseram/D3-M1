// Data helpers for the OWID energy-mix dataset.
// Units: primary_energy and each source are in TWh (terawatt-hours), using
// OWID's substitution method - confirmed by checking that Argentina's
// primary_energy in the most recent year (~1000) is in the plausible TWh
// range for a country its size, and that summing the eight source columns
// for "World" lands within ~1% of the reported primary_energy total.

// Fixed source order = fixed color-slot order (never re-cycled). Biofuel and
// other_renewable are folded into "other" so the mix stays at 8 categories,
// the max the categorical palette validates for a stacked chart.
export const ENERGY_SOURCES = [
  { key: "oil", label: "Oil" },
  { key: "coal", label: "Coal" },
  { key: "gas", label: "Gas" },
  { key: "hydro", label: "Hydro" },
  { key: "nuclear", label: "Nuclear" },
  { key: "wind", label: "Wind" },
  { key: "solar", label: "Solar" },
  { key: "other", label: "Other renewables" },
];

const sourceValue = (row, key) =>
  key === "other" ? row.biofuel + row.other_renewable : row[key];

// Share of a single source relative to that row's reported primary_energy total.
export const getSourceShare = (row, key) => {
  if (!row.primary_energy) return 0;
  return (sourceValue(row, key) / row.primary_energy) * 100;
};

// Renewables = hydro + solar + wind + biofuel + other_renewable (nuclear is
// low-carbon but not renewable, so it is intentionally excluded here).
export const getRenewableShare = (row) => {
  if (!row.primary_energy) return 0;
  const renewable =
    row.hydro + row.solar + row.wind + row.biofuel + row.other_renewable;
  return (renewable / row.primary_energy) * 100;
};

// Normalized composition across the 8 fixed categories, summing to exactly
// 100 (used by the stacked-area chart so bands always fill the band fully,
// instead of leaving the ~1% gap between the sources and primary_energy).
export const getComposition = (row) => {
  const raw = ENERGY_SOURCES.map((s) => sourceValue(row, s.key));
  const total = raw.reduce((a, b) => a + b, 0) || 1;
  const composition = { year: row.year };
  ENERGY_SOURCES.forEach((s, i) => {
    composition[s.key] = (raw[i] / total) * 100;
  });
  return composition;
};

export const WORLD = "World";

export const getCountries = (data) =>
  [...new Set(data.filter((d) => d.country !== WORLD).map((d) => d.country))].sort();

export const getYears = (data) =>
  [...new Set(data.map((d) => d.year))].sort((a, b) => a - b);

export const getWorldSeries = (data) =>
  data.filter((d) => d.country === WORLD).sort((a, b) => a.year - b.year);

export const getYearSnapshot = (data, year) =>
  data.filter((d) => d.country !== WORLD && d.year === year);

export const formatTWh = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

export const formatPercent = (value) => `${value.toFixed(1)}%`;
