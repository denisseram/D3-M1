import { BarChart } from "./BarChart";
import { infections } from "./data";

export default function App() {
  return (
    <main>
      <BarChart data={infections} />
    </main>);
}
