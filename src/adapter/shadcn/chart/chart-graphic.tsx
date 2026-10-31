import { useId } from 'react';
import { useDirection } from '@base-ui/react/direction-provider';
import type { ChartProps } from
  '@fastsprout/reacd/adapter-runtime/components/chart/index.js';
import {
  CHART_POLICY as P,
  CHART_DEFAULTS as D,
} from '@fastsprout/reacd/adapter-runtime/core/chart-policy.js';
import { chartDonutSlices } from
  '@fastsprout/reacd/adapter-runtime/core/chart-geometry.js';
import { ChartCartesian } from './cartesian.js';
import { ChartPattern } from './patterns.js';
export function ChartGraphic({ kind = D.kind, ...props }: ChartProps) {
  const id = useId();
  const direction = useDirection();
  return (
    <svg
      className="reacd-chart-graphic"
      role="img"
      viewBox={`${P.zero} ${P.zero} ${P.width} ${P.height}`}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <title id={`${id}-title`}>{props.label}</title>
      <desc id={`${id}-description`}>{props.description}</desc>
      {kind === 'donut' ? (
        <>
          <defs>
            {props.categories.map((item, index) => (
              <ChartPattern key={item.id} id={id} index={index} />
            ))}
          </defs>
          {props.series
            .flatMap((item) => chartDonutSlices(item.values))
            .map((slice) => (
              <path
                key={slice.index}
                data-slice={slice.index}
                d={slice.path}
                fill={`url(#${id}-${slice.index})`}
                stroke="currentColor"
                strokeWidth={P.strokeWidth}
              />
            ))}
        </>
      ) : (
        <ChartCartesian {...props} kind={kind} reverse={direction === 'rtl'} id={id} />
      )}
    </svg>
  );
}
