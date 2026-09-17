import { useMemo, useState } from "react";
import * as d3 from "d3";
import { AxisBottom } from "../../components/AxisBottom";
import { AxisLeft } from "../../components/AxisLeft";
import { ChartTooltip } from "../../components/ChartTooltip";
import { DataTable } from "../../components/DataTable";
import { getYearSnapshot, getRenewableShare, formatTWh, formatPercent } from "../../energy";

const MARGIN = { top: 16, right: 24, bottom: 44, left: 56 };
const RADIUS = 6;
const HIT_RADIUS = 14;

export const Scatter = ({ width, height, data, year }) => {
  const [hovered, setHovered] = useState(null);

  const points = useMemo(() => {
    return getYearSnapshot(data, year).map((d) => ({
      country: d.country,
      x: d.primary_energy,
      y: getRenewableShare(d),
    }));
  }, [data, year]);

  const boundsWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const boundsHeight = Math.max(height - MARGIN.top - MARGIN.bottom, 0);

  const xScale = useMemo(() => {
    const [min, max] = d3.extent(points, (d) => d.x);
    return d3
      .scaleLog()
      .domain([min || 1, max || 10])
      .range([0, boundsWidth]);
  }, [points, boundsWidth]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, d3.max(points, (d) => d.y) || 10])
      .nice()
      .range([boundsHeight, 0]);
  }, [points, boundsHeight]);

  if (!points.length || boundsWidth <= 0 || boundsHeight <= 0) return null;

  const maxByEnergy = points.reduce((a, b) => (b.x > a.x ? b : a));
  const maxByRenewable = points.reduce((a, b) => (b.y > a.y ? b : a));
  const labeled = new Set([maxByEnergy.country, maxByRenewable.country]);

  return (
    <div className="chart-surface">
      <svg width={width} height={height}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          <AxisLeft
            scale={yScale}
            boundsWidth={boundsWidth}
            label="Renewable share of primary energy (%)"
            tickFormat={(d) => `${d}%`}
          />
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              scale={xScale}
              boundsHeight={boundsHeight}
              label="Primary energy consumption (TWh, log scale)"
              ticks={xScale.ticks(5)}
              tickFormat={d3.format("~s")}
            />
          </g>
          {points.map((d) => {
            const isHovered = hovered?.country === d.country;
            return (
              <g key={d.country}>
                <circle
                  cx={xScale(d.x)}
                  cy={yScale(d.y)}
                  r={HIT_RADIUS}
                  fill="transparent"
                  onPointerEnter={() => setHovered(d)}
                  onPointerLeave={() => setHovered(null)}
                />
                <circle
                  cx={xScale(d.x)}
                  cy={yScale(d.y)}
                  r={isHovered ? RADIUS + 2 : RADIUS}
                  fill="var(--series-oil)"
                  fillOpacity={0.75}
                  stroke="var(--surface-1)"
                  strokeWidth={2}
                  pointerEvents="none"
                />
                {labeled.has(d.country) &&
                  (() => {
                    const nearRightEdge = xScale(d.x) > boundsWidth - 70;
                    return (
                      <text
                        className="axis-tick"
                        x={xScale(d.x) + (nearRightEdge ? -(RADIUS + 6) : RADIUS + 6)}
                        y={yScale(d.y)}
                        dominantBaseline="middle"
                        textAnchor={nearRightEdge ? "end" : "start"}
                      >
                        {d.country}
                      </text>
                    );
                  })()}
              </g>
            );
          })}
        </g>
      </svg>

      {hovered && (
        <ChartTooltip
          x={MARGIN.left + xScale(hovered.x)}
          y={MARGIN.top + yScale(hovered.y)}
          width={width}
        >
          <div className="tooltip-title">{hovered.country}</div>
          <div className="tooltip-row">
            <span className="tooltip-value">{formatTWh(hovered.x)} TWh</span>
            <span className="tooltip-label">Primary energy</span>
          </div>
          <div className="tooltip-row">
            <span className="tooltip-value">{formatPercent(hovered.y)}</span>
            <span className="tooltip-label">Renewable share</span>
          </div>
        </ChartTooltip>
      )}

      <DataTable
        caption={`Primary energy vs. renewable share by country, ${year}`}
        columns={[
          { key: "country", label: "Country" },
          { key: "x", label: "Primary energy (TWh)", format: formatTWh },
          { key: "y", label: "Renewable share", format: formatPercent },
        ]}
        rows={points}
      />
    </div>
  );
};
