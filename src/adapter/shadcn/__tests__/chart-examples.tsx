import { Chart } from '../../../components/chart/index.js';
export const CHART_EXAMPLES = {
  Chart: (
    <Chart
      label="Example chart"
      description="Count by category."
      categories={[{ id: 'one', label: 'One' }]}
      series={[{ id: 'count', label: 'Count', values: [1] }]}
    />
  ),
};
