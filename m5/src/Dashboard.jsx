import { useMemo, useState } from "react";
import { data } from "./data";
import { ENERGY_SOURCES, getYears } from "./energy";
import { ResponsiveStackedArea } from "./charts/StackedArea/ResponsiveStackedArea";
import { ResponsiveHeatmap } from "./charts/Heatmap/ResponsiveHeatmap";
import { ResponsiveScatter } from "./charts/Scatter/ResponsiveScatter";
import { ResponsiveBarplot } from "./charts/Barplot/ResponsiveBarplot";

export const Dashboard = () => {
  const years = useMemo(() => getYears(data), []);
  const latestYear = years[years.length - 1];

  const [year, setYear] = useState(latestYear);
  const [source, setSource] = useState("solar");

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>The World's Changing Energy Mix</h1>
        <p>
          Energy consumption by source for 28 countries, 1965-2024. Data:{" "}
          <a href="https://ourworldindata.org/energy" target="_blank" rel="noreferrer">
            Our World in Data
          </a>
          . Figures are primary energy consumption in terawatt-hours (TWh).
        </p>
      </header>

      <div className="filter-row">
        <label className="filter-control">
          <span>Snapshot year</span>
          <input
            type="range"
            min={years[0]}
            max={latestYear}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <span className="filter-value">{year}</span>
        </label>

        <label className="filter-control">
          <span>Heatmap source</span>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {ENERGY_SOURCES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="chart-grid">
        <section className="chart-card chart-card--wide">
          <h2>Global energy mix, 1965-2024</h2>
          <p className="chart-subtitle">
            Share of world primary energy consumption by source (World aggregate,
            excluded from the country charts below).
          </p>
          <div className="chart-body chart-body--area">
            <ResponsiveStackedArea data={data} />
          </div>
        </section>

        <section className="chart-card chart-card--wide">
          <h2>Where and when has each source grown?</h2>
          <p className="chart-subtitle">
            Share of each country's primary energy from the selected source, by year.
          </p>
          <div className="chart-body chart-body--auto">
            <ResponsiveHeatmap data={data} source={source} />
          </div>
        </section>

        <section className="chart-card">
          <h2>Energy vs. renewable share, {year}</h2>
          <p className="chart-subtitle">
            Do the biggest energy consumers also lead on renewables?
          </p>
          <div className="chart-body">
            <ResponsiveScatter data={data} year={year} />
          </div>
        </section>

        <section className="chart-card">
          <h2>Primary energy by country, {year}</h2>
          <p className="chart-subtitle">Countries ranked by total primary energy consumed.</p>
          <div className="chart-body chart-body--auto">
            <ResponsiveBarplot data={data} year={year} />
          </div>
        </section>
      </div>
    </main>
  );
};
