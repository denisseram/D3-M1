import { useMemo, useState } from "react";
import * as d3 from "d3";
import { AxisBottom } from "../../components/AxisBottom";
import { AxisLeft } from "../../components/AxisLeft";
import { ChartTooltip } from "../../components/ChartTooltip";
import { CategoricalLegend } from "../../components/CategoricalLegend";
import { DataTable } from "../../components/DataTable";
import {
  ENERGY_SOURCES,
  getComposition,
  getWorldSeries,
  formatPercent,
} from "../../energy";

const MARGIN = { top: 16, right: 20, bottom: 40, left: 44 };

export const StackedArea = ({ width, height, data }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  const composition = useMemo(() => {
    const world = getWorldSeries(data);
    return world.map(getComposition);
  }, [data]);

  const boundsWidth = Math.max(width - MARGIN.left - MARGIN.right, 0);
  const boundsHeight = Math.max(height - MARGIN.top - MARGIN.bottom, 0);

  const xScale = useMemo(() => {
    const years = composition.map((d) => d.year);
    return d3
      .scaleLinear()
      .domain([d3.min(years), d3.max(years)])
      .range([0, boundsWidth]);
  }, [composition, boundsWidth]);

  const yScale = useMemo(
    () => d3.scaleLinear().domain([0, 100]).range([boundsHeight, 0]),
    [boundsHeight]
  );

  const stackedSeries = useMemo(() => {
    return d3
      .stack()
      .keys(ENERGY_SOURCES.map((s) => s.key))
      .value((d, key) => d[key])(composition);
  }, [composition]);

  const areaGenerator = useMemo(
    () =>
      d3
        .area()
        .x((d) => xScale(d.data.year))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]))
        .curve(d3.curveLinear),
    [xScale, yScale]
  );

  if (!composition.length || boundsWidth <= 0 || boundsHeight <= 0) return null;

  const hovered = hoverIndex != null ? composition[hoverIndex] : null;

  const handlePointerMove = (event) => {
    const [pointerX] = d3.pointer(event);
    const year = Math.round(xScale.invert(pointerX - MARGIN.left));
    const bisect = d3.bisector((d) => d.year).left;
    let index = bisect(composition, year);
    index = Math.min(Math.max(index, 0), composition.length - 1);
    setHoverIndex(index);
  };

  const tooltipRows = hovered
    ? ENERGY_SOURCES.map((s) => ({ ...s, value: hovered[s.key] })).sort(
        (a, b) => b.value - a.value
      )
    : [];

  return (
    <div className="chart-surface">
      <svg
        width={width}
        height={height}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          <AxisLeft
            scale={yScale}
            boundsWidth={boundsWidth}
            label="Share of energy mix (%)"
            tickFormat={(d) => `${d}%`}
          />
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              scale={xScale}
              boundsHeight={boundsHeight}
              label="Year"
              tickFormat={d3.format("d")}
            />
          </g>
          {stackedSeries.map((layer, i) => (
            <path
              key={ENERGY_SOURCES[i].key}
              d={areaGenerator(layer)}
              fill={`var(--series-${ENERGY_SOURCES[i].key})`}
              fillOpacity={0.88}
              stroke="var(--surface-1)"
              strokeWidth={1.5}
            />
          ))}
          {hovered && (
            <line
              x1={xScale(hovered.year)}
              x2={xScale(hovered.year)}
              y1={0}
              y2={boundsHeight}
              stroke="var(--text-primary)"
              strokeWidth={1}
              strokeDasharray="0"
              opacity={0.35}
            />
          )}
          <rect
            width={boundsWidth}
            height={boundsHeight}
            fill="transparent"
          />
        </g>
      </svg>

      {hovered && (
        <ChartTooltip
          x={MARGIN.left + xScale(hovered.year)}
          y={height / 2}
          width={width}
        >
          <div className="tooltip-title">{hovered.year}</div>
          {tooltipRows.map((row) => (
            <div className="tooltip-row" key={row.key}>
              <span
                className="tooltip-key"
                style={{ background: `var(--series-${row.key})` }}
              />
              <span className="tooltip-value">{formatPercent(row.value)}</span>
              <span className="tooltip-label">{row.label}</span>
            </div>
          ))}
        </ChartTooltip>
      )}

      <CategoricalLegend items={ENERGY_SOURCES} />

      <DataTable
        caption="World energy mix by year (% of total)"
        columns={[
          { key: "year", label: "Year" },
          ...ENERGY_SOURCES.map((s) => ({
            key: s.key,
            label: s.label,
            format: formatPercent,
          })),
        ]}
        rows={composition}
      />
    </div>
  );
};
