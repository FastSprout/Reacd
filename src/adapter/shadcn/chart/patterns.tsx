import { CHART_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';

export function ChartPatterns({ prefix, count }: {
  readonly prefix: string;
  readonly count: number;
}) {
  return (
    <defs>
      {Array.from({ length: count }, (_, index) => (
        <pattern key={index} id={`${prefix}-${index}`} patternUnits="userSpaceOnUse"
          width={CHART_POLICY.patternSize} height={CHART_POLICY.patternSize}
          patternTransform={`rotate(${index * CHART_POLICY.patternRotationStep})`}>
          <line x1={CHART_POLICY.zero} y1={CHART_POLICY.zero}
            x2={CHART_POLICY.zero} y2={CHART_POLICY.patternSize}
            stroke="var(--foreground)" strokeWidth={CHART_POLICY.strokeWidth} />
        </pattern>
      ))}
    </defs>
  );
}
