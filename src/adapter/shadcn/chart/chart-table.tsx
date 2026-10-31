import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/index.js';
import { CHART_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
export function ChartTable({ label, categories, series }: ChartProps) {
  const caption = `${label} data`;
  return (
    <div className="reacd-table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className="reacd-table reacd-chart-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{CHART_DEFAULTS.categoryLabel}</th>
            {series.map((item) => (
              <th key={item.id} scope="col">
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <th scope="row">{category.label}</th>
              {series.map((item) => (
                <td key={item.id}>
                  {item.values.at(index) ?? CHART_DEFAULTS.missingValue}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
