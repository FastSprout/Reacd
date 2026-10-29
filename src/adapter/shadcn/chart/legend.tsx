import { useId } from 'react';
import type { ChartProps } from '../../../components/chart/index.js';
import { CHART_POLICY as P, CHART_DEFAULTS as D } from '../../../core/chart-policy.js';
import { ChartMarker, ChartPattern } from './patterns.js';
export function chartDash(index: number): string {
  return index === P.zero
    ? 'none'
    : `${(index + P.unitDomain) * P.dashUnit} ${P.dashGap}`;
}
export function ChartLegend({ kind, categories, series }: ChartProps) {
  const id = useId();
  const items = kind === 'donut' ? categories : series;
  return (
    <ul className="reacd-chart-legend" aria-label={D.seriesLabel}>
      {items.map((item, index) => (
        <li key={item.id}>
          <svg
            aria-hidden="true"
            viewBox={`${P.zero} ${P.zero} ${P.padding} ${P.padding}`}
          >
            <defs>
              <ChartPattern id={id} index={index} />
            </defs>
            {kind === 'line' ? (
              <>
                <line
                  x1={P.zero}
                  x2={P.padding}
                  y1={P.padding / P.midpoint}
                  y2={P.padding / P.midpoint}
                  stroke="currentColor"
                  strokeWidth={P.strokeWidth}
                  strokeDasharray={chartDash(index)}
                />
                <ChartMarker
                  x={P.padding / P.midpoint}
                  y={P.padding / P.midpoint}
                  index={index}
                />
              </>
            ) : (
              <rect
                x={P.markerRadius}
                y={P.markerRadius}
                width={P.padding - P.markerRadius * P.midpoint}
                height={P.padding - P.markerRadius * P.midpoint}
                fill={`url(#${id}-${index})`}
                stroke="currentColor"
                strokeWidth={P.strokeWidth}
              />
            )}
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
