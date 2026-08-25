import { scaleBand, scaleLinear } from "d3";

const WIDTH = 760;
const HEIGHT = 470;
const MARGIN = { top: 112, right: 42, bottom: 56, left: 24 };

export function BarChart({ data }) {
  const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

  // Escala cuantitativa: casos -> posición/longitud horizontal.
  const xScale = scaleLinear().domain([0, 55]).range([0, innerWidth]);

  // Escala categórica: nombre -> franja vertical.
  const yScale = scaleBand()
    .domain(data.map((d) => d.disease))
    .range([0, innerHeight])
    .paddingInner(0.08);

  const ticks = xScale.ticks(11);

  return (
    <figure className="chart-shell" aria-labelledby="chart-title chart-desc">
      <svg
        className="chart"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-labelledby="chart-title chart-desc"
      >
        <title id="chart-title">Escape artists</title>
        <desc id="chart-desc">
          Número de infecciones adquiridas en laboratorio entre 1970 y 2021.
          Brucella tiene el valor más alto, con 54 casos.
        </desc>

        <rect x="24" y="24" width="610" height="8" fill="#e3120b" />
        <text x="24" y="62" className="title">
          Escape artists
        </text>
        <text x="24" y="90" className="subtitle">
          Number of laboratory-acquired infections, 1970–2021
        </text>

        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {ticks.map((tick) => {
            const x = xScale(tick);
            return (
              <g key={tick} transform={`translate(${x}, 0)`}>
                <line y1="0" y2={innerHeight} className="grid-line" />
                <text y="-10" textAnchor="middle" className="tick-label">
                  {tick}
                </text>
              </g>
            );
          })}

          {data.map((datum) => {
            const y = yScale(datum.disease);
            const width = xScale(datum.cases);
            const labelOutside = datum.cases <= 7;
            const labelX = labelOutside ? width + 7 : 8;

            return (
              <g key={datum.disease} transform={`translate(0, ${y})`}>
                <rect
                  width={width}
                  height={yScale.bandwidth()}
                  className="bar"
                />
                <text
                  x={labelX}
                  y={yScale.bandwidth() / 2}
                  dominantBaseline="middle"
                  className={labelOutside ? "bar-label outside" : "bar-label"}
                >
                  {datum.disease}
                </text>
              </g>
            );
          })}
        </g>

        <text x="24" y="432" className="source">
          Sources: Laboratory-Acquired Infection Database; American Biological Safety Association
        </text>
        <text x="24" y="452" className="source">
          The Economist
        </text>
      </svg>
    </figure>
  );
}
