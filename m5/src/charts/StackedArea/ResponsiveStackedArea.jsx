import { useRef } from "react";
import { useDimensions } from "../../use-dimension";
import { StackedArea } from "./StackedArea";

export const ResponsiveStackedArea = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <StackedArea
        height={chartSize.height}
        width={chartSize.width}
        {...props}
      />
    </div>
  );
};
