import { CHART_POLICY as P } from '../../../core/chart-policy.js';
export function ChartPattern({ id, index }: { id: string; index: number }) {
  return (
    <pattern
      id={`${id}-${index}`}
      patternUnits="userSpaceOnUse"
      width={P.patternSize}
      height={P.patternSize}
      patternTransform={`rotate(${index * P.patternRotationStep})`}
    >
      <path
        d={`M ${P.zero} ${P.zero} L ${P.zero} ${P.patternSize}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={P.strokeWidth}
      />
    </pattern>
  );
}
export function ChartMarker({ x, y, index }: { x: number; y: number; index: number }) {
  return index % P.midpoint === P.zero ? (
    <circle cx={x} cy={y} r={P.markerRadius} fill="currentColor" />
  ) : (
    <rect
      x={x - P.markerRadius}
      y={y - P.markerRadius}
      width={P.markerRadius * P.midpoint}
      height={P.markerRadius * P.midpoint}
      fill="currentColor"
    />
  );
}
