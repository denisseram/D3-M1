export function Legend({ colorScale, sizeScale, width, height }) {
  const continents = colorScale.domain();
  const [minPop, maxPop] = sizeScale.domain(); // ~200K y ~1.3B
    const sizeLegendValues = [0, 1, 2, 3].map(
    (i) => minPop + (i * (maxPop - minPop)) / 3
    );

const sortedValues = sizeLegendValues.sort((a, b) => b - a);
const colorSectionHeight = 60 + continents.length * 18;
const maxRadius = sizeScale(maxPop);
const sizeBaselineY = colorSectionHeight + 30 + maxRadius;


    function formatPop(value) {
        if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `${Math.round(value / 1e3)}K`;
        return `${value}`;
}
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

      {/* sección tamaño */}
      

        <text x={10} y={colorSectionHeight + 20} fontSize={11} fontWeight="bold">Population</text>
        {sizeLegendValues.map((val, i) => (
        <g transform={`translate(${width/2}, ${sizeBaselineY})`}>
            {sortedValues.map((val) => {
                const r = sizeScale(val);
                return (
                <g key={val}>
                    <circle cx={0} cy={-r} r={r} fill="none" stroke="currentColor" />
                    <text x={r + 8} y={-2 * r} fontSize={10} dominantBaseline="middle">
                    {formatPop(val)}
                    </text>
                </g>
                );
            })}
        </g>
        ))}

    </g>
  );
}
