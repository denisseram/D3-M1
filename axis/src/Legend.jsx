const LEGEND_PADDING = 10;
const ESTIMATED_LABEL_WIDTH = 28;

export function computeLegendLayout(colorScale, sizeScale) {
  const continents = colorScale.domain();
  const [minPop, maxPop] = sizeScale.domain();
  const maxRadius = sizeScale(maxPop);

  const colorSectionHeight = 60 + continents.length * 18;
  const populationTitleY = colorSectionHeight + 20;
  const gapBelowTitle = 15;
  const sizeBaselineY = populationTitleY + gapBelowTitle + 2 * maxRadius;

  const labelX = maxRadius + 20;
  const sizeGroupCenterX = LEGEND_PADDING + maxRadius;

  const width = sizeGroupCenterX + labelX + ESTIMATED_LABEL_WIDTH + LEGEND_PADDING;
  const height = sizeBaselineY + LEGEND_PADDING;

  return {
    continents,
    minPop,
    maxPop,
    populationTitleY,
    sizeBaselineY,
    labelX,
    sizeGroupCenterX,
    width,
    height,
  };
}

function formatPop(value) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${Math.round(value / 1e3)}K`;
  return `${value}`;
}

export function Legend({ colorScale, sizeScale }) {
  const {
    continents,
    minPop,
    maxPop,
    populationTitleY,
    sizeBaselineY,
    labelX,
    sizeGroupCenterX,
    width,
    height,
  } = computeLegendLayout(colorScale, sizeScale);

  const sizeLegendValues = [0, 1, 2, 3].map(
    (i) => minPop + (i * (maxPop - minPop)) / 3
  );
  const sortedValues = sizeLegendValues.sort((a, b) => b - a);

  return (
    <g>
      <rect width={width} height={height} fill="none" stroke="currentColor" />
      <text x={10} y={20} fontSize={13} fontWeight="bold">Legend</text>

      <text x={10} y={45} fontSize={11} fontWeight="bold">Continent</text>
      {continents.map((cont, i) => (
        <g key={cont} transform={`translate(10, ${60 + i * 18})`}>
          <circle r={5} cx={5} cy={0} fill={colorScale(cont)} />
          <text x={16} y={4} fontSize={10}>{cont}</text>
        </g>
      ))}

      <text x={10} y={populationTitleY} fontSize={11} fontWeight="bold">Population</text>
      <g transform={`translate(${sizeGroupCenterX}, ${sizeBaselineY})`}>
        {sortedValues.map((val) => {
          const r = sizeScale(val);
          const topY = -2 * r;
          return (
            <g key={val}>
              <circle cx={0} cy={-r} r={r} fill="none" stroke="currentColor" strokeOpacity={0.4} />
              <line x1={0} y1={topY} x2={labelX} y2={topY} stroke="currentColor" strokeDasharray="2,2" />
              <text x={labelX + 4} y={topY} fontSize={10} dominantBaseline="middle">
                {formatPop(val)}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
