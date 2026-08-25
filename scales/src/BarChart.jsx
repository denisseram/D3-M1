import { scaleBand, scaleLinear, range } from "d3";
import { Fragment } from "react";

const width = 650;
const height = 360;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };

export function BarChart({ data = [] }) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain([0, 55])
    .range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(data.map((d) => d.disease))
    .range([0, innerHeight])
    .paddingInner(0.4)
    .paddingOuter(0.1);

  return (
  <div
    style={{
      width: `${width}px`,
      padding: "0 20px",
      boxSizing: "content-box",
      fontFamily: "Arial, Helvetica, sans-serif",
      textAlign: "left",
    }}
  >
    {/* Encabezado: ocupa su propio espacio */}
    <div
      style={{
        position: "relative",
        display: "block",
        width: `${width}px`,
        height: "100px",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      <div
        style={{
          marginTop: "14px",
          width: "100%",
          height: "1px",
          backgroundColor: "#e5011c",
        }}
      />

      <div
        style={{
          width: "36px",
          height: "9px",
          backgroundColor: "#e5011c",
        }}
      />

      <div
        style={{
          marginTop: "4px",
          fontSize: "20px",
          lineHeight: 1.2,
        }}
      >
        <strong>Escape artists</strong>
      </div>

      <div
        style={{
          fontSize: "16px",
          lineHeight: 1.4,
        }}
      >
        Number of laboratory-acquired infections, 1970–2021
      </div>
    </div>

    {/* Contenedor exclusivo del SVG */}
    <div
      style={{
        position: "relative",
        display: "block",
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "relative",
          display: "block",
          width: `${width}px`,
          height: `${height}px`,
          overflow: "visible",
        }}
        role="img"
        aria-label="Number of laboratory-acquired infections from 1970 to 2021"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Cuadrícula gris */}
          {range(5, 56, 5).map((value) => (
            <Fragment key={value}>
              <line
                x1={xScale(value)}
                x2={xScale(value)}
                y1={0}
                y2={innerHeight}
                stroke="#808080"
                opacity={0.2}
              />

              <text
                x={xScale(value)}
                y={-10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fill="#808080"
              >
                {value}
              </text>
            </Fragment>
          ))}

          {/* Barras */}
          {data.map((d) => {
            const barWidth = xScale(d.cases);
            const labelOutside = d.cases <= 7;
            const y = yScale(d.disease);

            return (
              <g key={d.disease}>
                <rect
                  x={0}
                  y={y}
                  width={barWidth}
                  height={yScale.bandwidth()}
                  fill="#076fa2"
                  stroke="#076fa2"
                />

                <text
                  x={labelOutside ? barWidth + 7 : 7}
                  y={y + yScale.bandwidth() / 2}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize={14}
                  fill={labelOutside ? "#076fa2" : "#fff"}
                  fillOpacity={labelOutside ? 1 : 0.9}
                >
                  {d.disease}
                </text>
              </g>
            );
          })}

          {/* Eje del cero */}
          <g>
            <line
              x1={xScale(0)}
              x2={xScale(0)}
              y1={0}
              y2={innerHeight}
              stroke="#000"
              opacity={0.8}
            />

            <text
              x={xScale(0)}
              y={-10}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fill="#808080"
            >
              0
            </text>
          </g>
        </g>
      </svg>
    </div>

    {/* Fuentes: también ocupan su propio espacio */}
    <div
      style={{
        display: "block",
        width: `${width}px`,
        height: "90px",
        paddingTop: "12px",
        boxSizing: "border-box",
        fontSize: "12px",
        lineHeight: 1.4,
        color: "#808080",
        textAlign: "left",
      }}
    >
      <div>
        Sources: Laboratory-Acquired Infection Database; American Biological
        Safety Association
      </div>

      <div>The Economist</div>
    </div>
  </div>
);
}