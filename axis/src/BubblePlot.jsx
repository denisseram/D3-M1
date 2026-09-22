import { scaleLinear, scaleSqrt, extent, scaleOrdinal } from "d3";
import { AxisBottom } from "./AxisBottom.jsx";
import { AxisLeft } from "./AxisLeft.jsx";
import { Legend, computeLegendLayout } from "./Legend.jsx";
import { useState } from "react";



const MARGIN = { top: 20, right: 180, bottom: 60, left: 70 };
const width = 900;
const height = 700;

export function BubblePlot({ data }) {
  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = scaleLinear().domain(extent(data, d => d.gdpPercap)).range([0, boundsWidth]);
  const yScale = scaleLinear().domain(extent(data, d => d.lifeExp)).range([boundsHeight, 0]);
  
  const BUBBLE_MIN_SIZE = 4;
  const BUBBLE_MAX_SIZE = 35;

  const sizeScale = scaleSqrt() .domain(extent(data, d => d.pop)) .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE])
  const continents = Array.from(new Set(data.map(d => d.continent)));
  const colorScale = scaleOrdinal().domain(continents).range(["#540b0e", "#9e2a2b", "#e09f3e", "#335c67", "#0c0c0b"]);

  const legendLayout = computeLegendLayout(colorScale, sizeScale);
  const legendY = MARGIN.top + (boundsHeight - legendLayout.height) / 2;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null;

  const tooltipX = hoveredData ? MARGIN.left + xScale(hoveredData.gdpPercap) : 0;
  const tooltipY = hoveredData ? MARGIN.top + yScale(hoveredData.lifeExp) : 0;


  return (
    <figure style={{ margin: 0, position: "relative" }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>
        Wealth, Health, and Population Across Nations
      </h2>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#555" }}>
        GDP per capita vs. life expectancy, bubble size representing population (2007)
      </p>
      <svg width={width} height={height}>
        {/* SVG background */}
        <rect/>

        {/* Bounds Area */}
        <g transform={`translate(${width - MARGIN.right + 20}, ${legendY})`}>
            <Legend colorScale={colorScale} sizeScale={sizeScale} />
        </g>

        
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            {/* Loop for bubbles */}
            {data.map((d, i) => {
            const isHovered = hoveredIndex === i;
            const opacity = isHovered ? 1 : 0.3;


            return (
                <circle 
                    key={i}
                    cx= {xScale(d.gdpPercap)}
                    cy= {yScale(d.lifeExp)}
                    r= {sizeScale(d.pop)}
                    fill={colorScale(d.continent)}
                    fillOpacity={opacity}
                    stroke={colorScale(d.continent)}
                    strokeWidth={1}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
            <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
                xScale={xScale}
                pixelsPerTick={60}
                label="Gdp per capita ($USD)"
                boundsHeight={boundsHeight}
            />
            </g>
            <AxisLeft
                yScale={yScale}
                pixelsPerTick={70}
                label="Life expectancy (years)"
                boundsWidth={boundsWidth}
                
            />
        </g>
      </svg>
      {hoveredData && (
        <div
          style={{
            position: "absolute",
            left: tooltipX + 10,
            top: tooltipY - 10,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: "6px 10px",
            fontSize: 11,
            pointerEvents: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        >
          <strong>{hoveredData.country}</strong>
          <div>GDP per capita: ${hoveredData.gdpPercap.toFixed(0)}</div>
          <div>Life expectancy: {hoveredData.lifeExp.toFixed(1)} years</div>
        </div>
      )}

      <figcaption style={{ fontSize: 11, color: "#888", marginTop: 8 }}>
        Source: Gapminder Foundation — 2007 dataset
      </figcaption>
    </figure>
  );
}