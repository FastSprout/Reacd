import { useId } from 'react';
import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/chart.props.js';
import { CHART_DEFAULTS, CHART_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import { ChartContainer } from '../vendor/ui/chart.js';
import { CardContent } from '../vendor/ui/card.js';
import { FieldDescription } from '../vendor/ui/field.js';
import { Alert, AlertDescription } from '../vendor/ui/alert.js';
import { ShadcnButton } from '../button/button.adapter.js';
import { cartesianChart } from './cartesian.js';
import { chartConfiguration, positiveShares } from './data.js';
import { donutChart } from './donut.js';
import { ChartDataTable } from './table.js';

export function ShadcnChart({
  label,
  description,
  categories,
  series,
  kind = CHART_DEFAULTS.kind,
  state,
  emptyMessage = CHART_DEFAULTS.emptyMessage,
  loadingMessage = CHART_DEFAULTS.loadingMessage,
  errorMessage = CHART_DEFAULTS.errorMessage,
  retryLabel = CHART_DEFAULTS.retryLabel,
  onRetry,
}: ChartProps) {
  const id = useId().replaceAll(':', '');
  if (state === 'loading') {
    return <FieldDescription role="status">{loadingMessage}</FieldDescription>;
  }
  if (state === 'error') {
    return (
      <Alert variant="destructive">
        <AlertDescription>{errorMessage}</AlertDescription>
        {onRetry && <ShadcnButton label={retryLabel} onPress={() => onRetry()} />}
      </Alert>
    );
  }
  const shares = positiveShares(categories, series);
  const empty = categories.length === 0 || series.length === 0;
  const emptyDonut = kind === 'donut' && shares.length === 0;
  return (
    <CardContent className="grid min-w-0 gap-4 p-0">
      <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      {empty ? <FieldDescription role="status">{emptyMessage}</FieldDescription> :
        emptyDonut ? (
          <CardContent role="img" aria-label={label}
            aria-describedby={`${id}-description`} className="min-w-0 p-0">
            <FieldDescription>{emptyMessage}</FieldDescription>
          </CardContent>
        ) : (
          <ChartContainer
            role="img" aria-label={label} aria-describedby={`${id}-description`}
            config={chartConfiguration(series)} className="min-w-0 w-full"
            initialDimension={{
              width: CHART_POLICY.width, height: CHART_POLICY.height,
            }}
            style={{ aspectRatio: CHART_POLICY.width / CHART_POLICY.height,
              minBlockSize: CHART_POLICY.minimumHeight,
              maxInlineSize: CHART_POLICY.width, color: 'var(--foreground)' }}>
            {kind === 'donut'
              ? donutChart({ data: shares, prefix: id })
              : cartesianChart({ kind, categories, series, prefix: id })}
          </ChartContainer>
        )}
      <ChartDataTable label={label} categories={categories} series={series} />
    </CardContent>
  );
}
