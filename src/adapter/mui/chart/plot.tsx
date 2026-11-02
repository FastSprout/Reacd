import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { getContrastRatio, useTheme } from '@mui/material/styles';
import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/chart.props.js';
import { CHART_DEFAULTS, CHART_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';

export function ChartPlot(props: ChartProps) {
  const { palette } = useTheme();
  const kind = props.kind ?? CHART_DEFAULTS.kind;
  const common = {
    title: props.label, desc: props.description, height: CHART_POLICY.height,
    colors: [
      palette.primary.main, palette.secondary.main,
      palette.primary.light, palette.secondary.light,
      palette.primary.dark, palette.secondary.dark,
    ].map(color => getContrastRatio(color, palette.background.paper) >=
      CHART_POLICY.minimumTraceContrast ? color : palette.text.primary),
  };
  const series = props.series.map((item) => ({
    id: item.id, label: item.label, data: [...item.values],
  }));
  const categories = props.categories.map((category) => category.label);
  if (kind === 'bar') return <BarChart {...common} series={series}
    xAxis={[{ scaleType: 'band', data: categories }]} />;
  if (kind === 'donut') return <PieChart {...common} series={[{
    innerRadius: `${CHART_POLICY.donutInnerRadius /
      CHART_POLICY.donutOuterRadius * 100}%`,
    data: props.categories.flatMap((category, index) => {
      const value = props.series[0]?.values[index];
      return value !== null && value !== undefined && value > CHART_POLICY.zero
        ? [{ id: category.id, label: category.label, value }] : [];
    }),
  }]} />;
  return <LineChart {...common}
    series={series.map((item) => ({ ...item, area: kind === 'area' }))}
    xAxis={[{ scaleType: 'point', data: categories }]} />;
}
