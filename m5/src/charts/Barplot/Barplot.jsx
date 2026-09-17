import { useMemo, useState } from "react";
import * as d3 from "d3";
import { AxisBottom } from "../../components/AxisBottom";
import { ChartTooltip } from "../../components/ChartTooltip";
import { DataTable } from "../../components/DataTable";
import { getYearSnapshot, formatTWh } from "../../energy";

const MARGIN = { top: 10, right: 56, bottom: 44, left: 132 };
const ROW_HEIGHT = 26;
const BAR_THICKNESS = 18;

// Bar count (not the wrapper's measured height) drives this chart's height,
// so every country gets a legible row instead of being squeezed to fit.
export const Barplot = ({ width, data, year }) => {
  const [hovered, setHovered] = useState(null);

  const bars = useMemo(() => {
    return getYearSnapshot(data, year)
      .map((d) => ({ country: d.country, value: d.primary_energy }))
      .sort((a, b) => b.value - a.value);
  }, [data, year]);

  const boundsWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const boundsHeight = bars.length * ROW_HEIGHT;

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(bars.map((d) => d.country))
        .range([0, boundsHeight])
        .padding(0.25),
    [bars, boundsHeight]
  );

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(bars, (d) => d.value) || 10])
        .nice()
        .range([0, boundsWidth]),
    [bars, boundsWidth]
  );

  if (!bars.length || boundsWidth <= 0) return null;

  const svgHeight = MARGIN.top + boundsHeight + MARGIN.bottom;

  return (
    <div className="chart-surface">
      <svg width={width} height={svgHeight}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              scale={xScale}
              boundsHeight={boundsHeight}
              label="Primary energy consumption (TWh)"
              tickFormat={d3.format("~s")}
            />
          </g>
          {bars.map((d) => {
            const bandY = yScale(d.country);
            const barY = bandY + (yScale.bandwidth() - BAR_THICKNESS) / 2;
            const barWidth = xScale(d.value);
            const tipLabelFits = barWidth > 60;
            const isHovered = hovered?.country === d.country;

            return (
              <g key={d.country}>
                <rect
                  x={0}
                  y={barY}
                  width={barWidth}
                  height={BAR_THICKNESS}
                  rx={3}
                  fill="var(--series-oil)"
                  fillOpacity={isHovered ? 0.95 : 0.8}
                  onPointerEnter={() =>
                    setHovered({ ...d, y: bandY + yScale.bandwidth() / 2, x: barWidth })
                  }
                  onPointerLeave={() => setHovered(null)}
                />
                <text
                  className="axis-tick"
                  x={-8}
                  y={bandY + yScale.bandwidth() / 2}
                  dominantBaseline="middle"
                  textAnchor="end"
                >
                  {d.country}
                </text>
                <text
                  className="axis-tick"
                  x={tipLabelFits ? barWidth - 8 : barWidth + 8}
                  y={bandY + yScale.bandwidth() / 2}
                  dominantBaseline="middle"
                  textAnchor={tipLabelFits ? "end" : "start"}
                  style={{
                    fill: tipLabelFits ? "var(--surface-1)" : "var(--text-secondary)",
                  }}
                >
                  {formatTWh(d.value)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {hovered && (
        <ChartTooltip x={MARGIN.left + hovered.x} y={MARGIN.top + hovered.y} width={width}>
          <div className="tooltip-title">{hovered.country}</div>
          <div className="tooltip-row">
            <span className="tooltip-value">{formatTWh(hovered.value)} TWh</span>
            <span className="tooltip-label">Primary energy</span>
          </div>
        </ChartTooltip>
      )}

      <DataTable
        caption={`Primary energy consumption by country, ${year}`}
        columns={[
          { key: "country", label: "Country" },
          { key: "value", label: "Primary energy (TWh)", format: formatTWh },
        ]}
        rows={bars}
      />
    </div>
  );
};
