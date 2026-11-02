import { Cell, Pie, PieChart } from 'recharts';
import { CHART_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import type { positiveShares } from './data.js';
import { ChartPatterns } from './patterns.js';

export function donutChart({ data, prefix }: {
  readonly data: ReturnType<typeof positiveShares>;
  readonly prefix: string;
}) {
  const maximumRadius = CHART_POLICY.height / CHART_POLICY.midpoint;
  const startAngle = -CHART_POLICY.startAngle * 180 / Math.PI;
  const endAngle = -(CHART_POLICY.startAngle + CHART_POLICY.fullAngle) * 180 / Math.PI;
  return (
    <PieChart id={`${prefix}-plot`} accessibilityLayer={false}>
      <ChartPatterns prefix={prefix} count={data.length} />
      <Pie id={`${prefix}-sectors`} data={data} dataKey="value" nameKey="category"
        isAnimationActive={false}
        innerRadius={`${CHART_POLICY.donutInnerRadius / maximumRadius * 100}%`}
        outerRadius={`${CHART_POLICY.donutOuterRadius / maximumRadius * 100}%`}
        startAngle={startAngle} endAngle={endAngle}
        stroke="var(--foreground)" strokeWidth={CHART_POLICY.strokeWidth}>
        {data.map((_item, index) => (
          <Cell key={index} fill={`url(#${prefix}-${index})`} />
        ))}
      </Pie>
    </PieChart>
  );
}
