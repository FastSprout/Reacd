import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/index.js';
import { CHART_POLICY as P } from
  '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import {
  chartPoints,
  chartDomain,
  chartY,
  chartLinePath,
  chartAreaPath,
} from '@fastsprout/reacd/adapter-runtime/core/chart-geometry.js';
import { ChartMarker, ChartPattern } from './patterns.js';
import { chartDash } from './legend.js';
export function ChartCartesian({
  series,
  categories,
  kind,
  reverse,
  id,
}: Pick<ChartProps, 'series' | 'categories' | 'kind'> & {
  reverse: boolean;
  id: string;
}) {
  const domain = chartDomain(series.map((item) => item.values));
  const baseline = chartY(P.zero, domain);
  const barWidth =
    (((P.width - P.padding * P.midpoint) / (categories.length + P.unitDomain)) *
      P.barGroupRatio) /
    series.length;
  return (
    <>
      <defs>
        {series.map((item, index) => (
          <ChartPattern key={item.id} id={id} index={index} />
        ))}
      </defs>
      <line
        x1={P.padding}
        x2={P.width - P.padding}
        y1={baseline}
        y2={baseline}
        stroke="currentColor"
        strokeWidth={P.strokeWidth}
      />
      {series.map((item, index) => (
        <g key={item.id} data-series={item.id}>
          {chartPoints(item.values, domain, reverse).map((points, segment) => (
            <g key={segment}>
              {kind === 'bar' ? (
                points.map((point) => (
                  <rect
                    key={point.index}
                    x={point.x + (index - series.length / P.midpoint) * barWidth}
                    y={Math.min(baseline, point.y)}
                    width={barWidth}
                    height={Math.abs(baseline - point.y)}
                    fill={`url(#${id}-${index})`}
                    stroke="currentColor"
                    strokeWidth={P.strokeWidth}
                  />
                ))
              ) : (
                <>
                  <path
                    d={
                      kind === 'area'
                        ? chartAreaPath(points, baseline)
                        : chartLinePath(points)
                    }
                    fill={kind === 'area' ? `url(#${id}-${index})` : 'none'}
                    stroke="currentColor"
                    strokeWidth={P.strokeWidth}
                    strokeDasharray={chartDash(index)}
                  />
                  {points.map((point) => (
                    <ChartMarker
                      key={point.index}
                      x={point.x}
                      y={point.y}
                      index={index}
                    />
                  ))}
                </>
              )}
            </g>
          ))}
        </g>
      ))}
    </>
  );
}
