// Legend for >=2 series - the dependable identity channel so the reader
// never has to color-match a stacked band or a line unaided.
export const CategoricalLegend = ({ items }) => (
  <ul className="legend">
    {items.map((item) => (
      <li key={item.key} className="legend-item">
        <span
          className="legend-swatch"
          style={{ background: `var(--series-${item.key})` }}
        />
        {item.label}
      </li>
    ))}
  </ul>
);
