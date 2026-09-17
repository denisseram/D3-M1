import { useRef } from "react";
import { useDimensions } from "../../use-dimension";
import { Scatter } from "./Scatter";

export const ResponsiveScatter = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <Scatter height={chartSize.height} width={chartSize.width} {...props} />
    </div>
  );
};
