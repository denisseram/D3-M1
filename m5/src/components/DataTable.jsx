import { useState } from "react";

// Every chart's WCAG-clean twin: the same values the marks encode, reachable
// without hovering anything. Collapsed by default so it doesn't compete with
// the chart, but never gates access to a value. Rows mount lazily on first
// open so a dense table (e.g. the heatmap's country x year grid) doesn't add
// weight to charts nobody expands.
export const DataTable = ({ caption, columns, rows }) => {
  const [opened, setOpened] = useState(false);

  return (
    <details className="data-table" onToggle={(e) => setOpened(e.target.open)}>
      <summary>View as table</summary>
      {opened && (
        <div className="data-table-scroll">
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} scope="col">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.format ? col.format(row[col.key]) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </details>
  );
};
