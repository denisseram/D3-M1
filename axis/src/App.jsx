import { BubblePlot } from "./BubblePlot";
import { data } from "./data";

export default function App() {
  return (
    <main>
      <BubblePlot data={data} />
    </main>);
}
