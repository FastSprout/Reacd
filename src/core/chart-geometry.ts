import { CHART_POLICY as P } from './chart-policy.js';
export interface ChartDomain {
  minimum: number;
  maximum: number;
}
export interface ChartPoint {
  x: number;
  y: number;
  value: number;
  index: number;
}
export function chartDomain(series: readonly (readonly (number | null)[])[]) {
  let minimum: number = P.zero;
  let maximum: number = P.zero;
  for (const values of series) {
    for (const value of values) {
      if (value === null) continue;
      minimum = Math.min(minimum, value);
      maximum = Math.max(maximum, value);
    }
  }
  return { minimum, maximum: maximum === minimum ? P.unitDomain : maximum };
}
export function chartY(value: number, domain: ChartDomain): number {
  const span = P.height - P.padding * P.midpoint;
  return (
    P.height -
    P.padding -
    ((value - domain.minimum) / (domain.maximum - domain.minimum)) * span
  );
}
export function chartPoints(
  values: readonly (number | null)[],
  domain: ChartDomain,
  reverse: boolean,
): ChartPoint[][] {
  const segments: ChartPoint[][] = [];
  let segment: ChartPoint[] = [];
  const span = P.width - P.padding * P.midpoint;
  values.forEach((value, index) => {
    if (value === null) {
      if (segment.length > P.zero) segments.push(segment);
      segment = [];
      return;
    }
    const position =
      values.length === P.unitDomain
        ? span / P.midpoint
        : (index / (values.length - P.unitDomain)) * span;
    segment.push({
      x: P.padding + (reverse ? span - position : position),
      y: chartY(value, domain),
      value,
      index,
    });
  });
  if (segment.length > P.zero) segments.push(segment);
  return segments;
}
export function chartLinePath(points: readonly ChartPoint[]): string {
  return points
    .map((point, index) => `${index === P.zero ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}
export function chartAreaPath(points: readonly ChartPoint[], baseline: number): string {
  const first = points.at(P.zero);
  const last = points.at(-P.unitDomain);
  if (first === undefined || last === undefined) return '';
  return (
    `M ${first.x} ${baseline} ` +
    `${chartLinePath(points).replace(/^M /, 'L ')} L ${last.x} ${baseline} Z`
  );
}
function polar(radius: number, angle: number): string {
  return (
    `${P.width / P.midpoint + radius * Math.cos(angle)} ` +
    `${P.height / P.midpoint + radius * Math.sin(angle)}`
  );
}
function ringPath(start: number, end: number): string {
  const middle = (start + end) / P.midpoint;
  const outer = P.donutOuterRadius;
  const inner = P.donutInnerRadius;
  return (
    `M ${polar(outer, start)} ` +
    `A ${outer} ${outer} 0 0 1 ${polar(outer, middle)} ` +
    `A ${outer} ${outer} 0 0 1 ${polar(outer, end)} ` +
    `L ${polar(inner, end)} ` +
    `A ${inner} ${inner} 0 0 0 ${polar(inner, middle)} ` +
    `A ${inner} ${inner} 0 0 0 ${polar(inner, start)} Z`
  );
}
export function chartDonutSlices(values: readonly (number | null)[]) {
  const total = values.reduce<number>((sum, value) => sum + (value ?? P.zero), P.zero);
  if (total === P.zero) return [];
  let angle: number = P.startAngle;
  return values.flatMap((value, index) => {
    if (value === null || value === P.zero) return [];
    const next = angle + (value / total) * P.fullAngle;
    const path = ringPath(angle, next);
    angle = next;
    return [{ index, value, path }];
  });
}
