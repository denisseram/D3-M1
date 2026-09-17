import { useRef } from "react";
import { useDimensions } from "../../use-dimension";
import { Barplot } from "./Barplot";

export const ResponsiveBarplot = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <Barplot height={chartSize.height} width={chartSize.width} {...props} />
    </div>
  );
};
