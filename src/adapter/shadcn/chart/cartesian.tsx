import { Area, Bar, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/chart.props.js';
import { CHART_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import { chartRows, numericDomain, seriesKey } from './data.js';
import { ChartPatterns } from './patterns.js';

interface Properties {
  readonly kind: Exclude<NonNullable<ChartProps['kind']>, 'donut'>;
  readonly categories: ChartProps['categories'];
  readonly series: ChartProps['series'];
  readonly prefix: string;
}

export function cartesianChart(
  { kind, categories, series, prefix }: Properties,
) {
  return (
    <ComposedChart id={`${prefix}-plot`} data={chartRows(categories, series)}
      accessibilityLayer={false}
      margin={{ top: CHART_POLICY.padding, right: CHART_POLICY.padding,
        bottom: CHART_POLICY.padding, left: CHART_POLICY.padding }}>
      <ChartPatterns prefix={prefix} count={series.length} />
      <XAxis dataKey="category" />
      <YAxis domain={numericDomain(series)} width="auto" />
      {series.map((item, index) => {
        const common = {
          id: `${prefix}-trace-${index}`,
          dataKey: seriesKey(index),
          name: item.label,
          stroke: 'var(--foreground)',
          strokeWidth: CHART_POLICY.strokeWidth,
          fill: `url(#${prefix}-${index})`,
          isAnimationActive: false,
        };
        if (kind === 'bar') return <Bar key={item.id} {...common} />;
        const trace = {
          ...common,
          connectNulls: false,
          activeDot: false,
          dot: { r: CHART_POLICY.markerRadius, fill: 'var(--foreground)' },
          strokeDasharray: `${(index + 1) * CHART_POLICY.dashUnit} ` +
            `${CHART_POLICY.dashGap}`,
        };
        return kind === 'area'
          ? <Area key={item.id} {...trace} />
          : <Line key={item.id} {...trace} fill="none" />;
      })}
    </ComposedChart>
  );
}
