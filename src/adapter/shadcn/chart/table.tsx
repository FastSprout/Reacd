import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/chart.props.js';
import { CHART_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import { TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from '../vendor/ui/table.js';

export function ChartDataTable({ label, categories, series }: Pick<
  ChartProps, 'label' | 'categories' | 'series'
>) {
  const caption = `${label} data`;
  return (
    <Table containerProps={{ role: 'region', 'aria-label': caption,
      tabIndex: TABLE_POLICY.scrollTabIndex }}>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">{CHART_DEFAULTS.categoryLabel}</TableHead>
          {series.map(item => (
            <TableHead key={item.id} scope="col"
              className="whitespace-normal [overflow-wrap:anywhere]">
              {item.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category, index) => (
          <TableRow key={category.id}>
            <TableHead scope="row"
              className="whitespace-normal [overflow-wrap:anywhere]">
              {category.label}
            </TableHead>
            {series.map(item => (
              <TableCell key={item.id}>
                {item.values[index] ?? CHART_DEFAULTS.missingValue}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
