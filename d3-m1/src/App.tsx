import { Barplot } from "./barplot.tsx";

function App() {
  return (
    <div>
      <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "44px", fontWeight: "600", color: "#333333d5" }}>Students by country</h1>
      <Barplot />
    </div>
  );
}

export default App;