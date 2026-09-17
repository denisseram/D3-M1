import { useRef } from "react";
import { useDimensions } from "../../use-dimension";
import { Heatmap } from "./Heatmap";

export const ResponsiveHeatmap = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <Heatmap height={chartSize.height} width={chartSize.width} {...props} />
    </div>
  );
};
