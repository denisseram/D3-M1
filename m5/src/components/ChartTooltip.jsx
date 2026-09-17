// Floating HTML tooltip, positioned in the pixel space of the chart's own
// wrapper (which must be `position: relative`). Tooltips only ever enhance -
// every value they show also lives in the chart's table view.
export const ChartTooltip = ({ x, y, width, children }) => {
  if (x == null || y == null) return null;

  const flip = width != null && x > width - 160;

  return (
    <div
      className="chart-tooltip"
      style={{
        left: x,
        top: y,
        transform: `translate(${flip ? "-100%" : "12px"}, -50%)`,
      }}
    >
      {children}
    </div>
  );
};
