const TICK_LENGTH = 6;

export const AxisLeft = ({
  scale,
  boundsWidth,
  label,
  ticks,
  tickFormat,
  showGrid = true,
}) => {
  const range = scale.range();
  const tickValues = ticks ?? scale.ticks?.(6) ?? scale.domain();
  const format = tickFormat ?? ((d) => d);
  const height = range[0] - range[1];

  return (
    <g className="axis axis-left">
      <line
        x1={0}
        y1={range[0]}
        x2={0}
        y2={range[1]}
        stroke="var(--axis-line)"
      />
      {tickValues.map((value) => (
        <g key={value} transform={`translate(0, ${scale(value)})`}>
          {showGrid && (
            <line x1={0} x2={boundsWidth} stroke="var(--grid-line)" />
          )}
          <line x2={-TICK_LENGTH} stroke="var(--axis-line)" />
          <text
            className="axis-tick"
            x={-TICK_LENGTH - 4}
            dominantBaseline="middle"
            textAnchor="end"
          >
            {format(value)}
          </text>
        </g>
      ))}
      {label && (
        <text
          className="axis-label"
          x={-height / 2}
          y={-48}
          textAnchor="middle"
          transform="rotate(-90)"
        >
          {label}
        </text>
      )}
    </g>
  );
};
