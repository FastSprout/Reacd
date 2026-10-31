import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/index.js';
import {
  CHART_DEFAULTS as D,
  CHART_POLICY as P,
} from '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import { ChartGraphic } from './chart-graphic.js';
import { ChartTable } from './chart-table.js';
import { ChartLegend } from './legend.js';
import { Button } from '../primitives/button.js';
export function SharedChart({
  kind = D.kind,
  state,
  emptyMessage = D.emptyMessage,
  loadingMessage = D.loadingMessage,
  errorMessage = D.errorMessage,
  retryLabel = D.retryLabel,
  onRetry,
  ...data
}: ChartProps) {
  if (state === 'loading') return <p role="status">{loadingMessage}</p>;
  if (state === 'error')
    return (
      <div className="reacd-vstack">
        <p role="alert">{errorMessage}</p>
        {onRetry === undefined ? null : (
          <Button className="reacd-button" type="button" onClick={() => onRetry()}>
            {retryLabel}
          </Button>
        )}
      </div>
    );
  if (data.categories.length === P.zero || data.series.length === P.zero)
    return <p role="status">{emptyMessage}</p>;
  const emptyDonut =
    kind === 'donut' &&
    !data.series.some((item) =>
      item.values.some((value) => value !== null && value > P.zero),
    );
  return (
    <figure className="reacd-node reacd-chart">
      <figcaption>{data.label}</figcaption>
      <p>{data.description}</p>
      {emptyDonut ? (
        <p role="status">{emptyMessage}</p>
      ) : (
        <ChartGraphic {...data} kind={kind} />
      )}
      <ChartLegend {...data} kind={kind} />
      <ChartTable {...data} />
    </figure>
  );
}
