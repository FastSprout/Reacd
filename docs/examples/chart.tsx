import { Chart } from '@fastsprout/reacd';

export function ChartExample() {
  return (
    <Chart
      label="Monthly sales"
      description="Completed orders during the first quarter."
      kind="bar"
      categories={[
        { id: 'jan', label: 'January' },
        { id: 'feb', label: 'February' },
        { id: 'mar', label: 'March' },
      ]}
      series={[{ id: 'orders', label: 'Orders', values: [24, 31, 28] }]}
    />
  );
}
