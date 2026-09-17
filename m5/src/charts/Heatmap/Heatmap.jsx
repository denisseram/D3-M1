import { useMemo, useState } from "react";
import * as d3 from "d3";
import { AxisBottom } from "../../components/AxisBottom";
import { ChartTooltip } from "../../components/ChartTooltip";
import { DataTable } from "../../components/DataTable";
import { SEQUENTIAL_RAMP, usePrefersDark } from "../../colors";
import { ENERGY_SOURCES, WORLD, getCountries, getSourceShare } from "../../energy";

const MARGIN = { top: 10, right: 16, bottom: 40, left: 132 };
const ROW_HEIGHT = 18;

// Row count (not the wrapper's measured height) drives this chart's height,
// so every country gets a legible row instead of being squeezed to fit.
export const Heatmap = ({ width, data, source }) => {
  const [hovered, setHovered] = useState(null);
  const isDark = usePrefersDark();
  const sourceLabel = ENERGY_SOURCES.find((s) => s.key === source)?.label ?? source;

  const countries = useMemo(() => getCountries(data), [data]);

  const cells = useMemo(
    () =>
      data
        .filter((d) => d.country !== WORLD)
        .map((d) => ({
          country: d.country,
          year: d.year,
          value: getSourceShare(d, source),
        })),
    [data, source]
  );

  const years = useMemo(
    () => [...new Set(cells.map((d) => d.year))].sort((a, b) => a - b),
    [cells]
  );

  const boundsWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const boundsHeight = countries.length * ROW_HEIGHT;

  const xScale = useMemo(
    () => d3.scaleBand().domain(years).range([0, boundsWidth]).padding(0.06),
    [years, boundsWidth]
  );
  const yScale = useMemo(
    () => d3.scaleBand().domain(countries).range([0, boundsHeight]).padding(0.06),
    [countries, boundsHeight]
  );

  const maxValue = useMemo(() => d3.max(cells, (d) => d.value) || 1, [cells]);
  const ramp = isDark ? SEQUENTIAL_RAMP.dark : SEQUENTIAL_RAMP.light;
  const colorScale = useMemo(
    () => d3.scaleSequential().domain([0, maxValue]).interpolator(d3.interpolateRgbBasis(ramp)),
    [maxValue, ramp]
  );

  if (!boundsWidth || !boundsHeight) return null;

  const svgHeight = MARGIN.top + boundsHeight + MARGIN.bottom;
  const tickYears = years.filter((y) => y % 5 === 0);

  return (
    <div className="chart-surface">
      <div className="chart-config-row">
        <span className="chart-config-label">Showing: {sourceLabel} share of primary energy</span>
        <div className="sequential-legend">
          <span>0%</span>
          <span
            className="sequential-legend-swatch"
            style={{ background: `linear-gradient(to right, ${ramp.join(",")})` }}
          />
          <span>{maxValue.toFixed(0)}%</span>
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg width={Math.max(width, MARGIN.left + 60)} height={svgHeight}>
          <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            {countries.map((country) => (
              <text
                key={country}
                className="axis-tick"
                x={-8}
                y={yScale(country) + yScale.bandwidth() / 2}
                dominantBaseline="middle"
                textAnchor="end"
              >
                {country}
              </text>
            ))}
            {cells.map((d) => (
              <rect
                key={`${d.country}-${d.year}`}
                x={xScale(d.year)}
                y={yScale(d.country)}
                width={xScale.bandwidth()}
                height={yScale.bandwidth()}
                fill={colorScale(d.value)}
                stroke={
                  hovered?.country === d.country && hovered?.year === d.year
                    ? "var(--text-primary)"
                    : "none"
                }
                strokeWidth={1.5}
                onPointerEnter={() =>
                  setHovered({
                    ...d,
                    x: xScale(d.year) + xScale.bandwidth() / 2,
                    y: yScale(d.country) + yScale.bandwidth() / 2,
                  })
                }
                onPointerLeave={() => setHovered(null)}
              />
            ))}
            <g transform={`translate(0, ${boundsHeight})`}>
              <AxisBottom
                scale={xScale}
                boundsHeight={boundsHeight}
                label="Year"
                ticks={tickYears}
                tickFormat={(d) => d}
                showGrid={false}
              />
            </g>
          </g>
        </svg>
      </div>

      {hovered && (
        <ChartTooltip x={MARGIN.left + hovered.x} y={MARGIN.top + hovered.y} width={width}>
          <div className="tooltip-title">
            {hovered.country} &middot; {hovered.year}
          </div>
          <div className="tooltip-row">
            <span className="tooltip-value">{hovered.value.toFixed(1)}%</span>
            <span className="tooltip-label">{sourceLabel}</span>
          </div>
        </ChartTooltip>
      )}

      <DataTable
        caption={`${sourceLabel} share of primary energy, by country and year`}
        columns={[
          { key: "country", label: "Country" },
          { key: "year", label: "Year" },
          { key: "value", label: "Share", format: (v) => `${v.toFixed(1)}%` },
        ]}
        rows={cells}
      />
    </div>
  );
};
