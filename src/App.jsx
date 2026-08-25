import { BarChart } from "./BarChart";
import { infections } from "./data";

export default function App() {
  return (
    <main>
      <section className="visualization" aria-label="Visualización principal">
        <BarChart data={infections} />
      </section>

      <aside className="learning-note">
        <p className="eyebrow">Mapa mental</p>
        <h2>Qué está haciendo D3 aquí</h2>
        <div className="concepts">
          <div>
            <strong>scaleLinear</strong>
            <span>convierte casos en píxeles de ancho y posiciones x.</span>
          </div>
          <div>
            <strong>scaleBand</strong>
            <span>reserva una fila para cada enfermedad.</span>
          </div>
          <div>
            <strong>React + SVG</strong>
            <span>recorren los datos y dibujan barras, líneas y textos.</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
