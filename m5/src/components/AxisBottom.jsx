const TICK_LENGTH = 6;

// Numeric/linear/log bottom axis with recessive gridlines, matching the
// hairline-grid convention used across the other charts in this project.
export const AxisBottom = ({
  scale,
  boundsHeight,
  label,
  ticks,
  tickFormat,
  showGrid = true,
}) => {
  const range = scale.range();
  const tickValues = ticks ?? scale.ticks?.(6) ?? scale.domain();
  const format = tickFormat ?? ((d) => d);

  return (
    <g className="axis axis-bottom">
      <line
        x1={range[0]}
        y1={0}
        x2={range[1]}
        y2={0}
        stroke="var(--axis-line)"
      />
      {tickValues.map((value) => (
        <g key={value} transform={`translate(${scale(value)}, 0)`}>
          {showGrid && (
            <line y1={0} y2={-boundsHeight} stroke="var(--grid-line)" />
          )}
          <line y2={TICK_LENGTH} stroke="var(--axis-line)" />
          <text className="axis-tick" y={20} textAnchor="middle">
            {format(value)}
          </text>
        </g>
      ))}
      {label && (
        <text
          className="axis-label"
          x={(range[0] + range[1]) / 2}
          y={40}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
};
