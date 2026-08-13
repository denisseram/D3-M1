import * as d3 from "d3";

const data = [
  { country: "United States", students: 68 },
  { country: "France", students: 21 },
  { country: "United Kingdom", students: 21 },
  { country: "Germany", students: 20 },
  { country: "Switzerland", students: 13 },
  { country: "Spain", students: 10 },
  { country: "Netherlands", students: 9 },
  { country: "India", students: 9 },
  { country: "Singapore", students: 8 },
  { country: "Ireland", students: 8 },
  { country: "Sweden", students: 7 },
  { country: "Australia", students: 7 },
  { country: "Canada", students: 6 },
  { country: "Finland", students: 5 },
  { country: "Mexico", students: 4 },
  { country: "Brazil", students: 4 },
  { country: "Saudi Arabia", students: 3 },
  { country: "Romania", students: 3 },
  { country: "Philippines", students: 3 },
  { country: "New Zealand", students: 3 },
];

const width = 600;
const height = 400;

export const Barplot = () => {
  const maxStudents = d3.max(data, (d) => d.students) ?? 0;

  const xScale = d3
    .scaleLinear()
    .domain([0, maxStudents])
    .range([0, width]);

  const barHeight = (height-4) / data.length;

  const barColor = "#2543cbcf";

  return (
    <div>
      {data.map((d) => (
        <div
          key={d.country}
          style={{
            display: "flex",
            alignItems: "center",
            height: barHeight,
          }}
        >
          <div style={{ width: 150 }}>
            {d.country}
          </div>

          <div
            style={{
              width: xScale(d.students),
              height: barHeight - 4,
              backgroundColor: barColor,
              borderRadius: 5,
            }}
          />

          <div style={{ 
            marginLeft: 8, 
            fontSize: 12,
            color: "#ababab",
            fontFamily: "Poppins, sans-serif",
            }}>
            {d.students}
          </div>
        </div>
      ))}
    </div>
  );
};