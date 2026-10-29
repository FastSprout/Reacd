import { CAROUSEL_POLICY } from './carousel-policy.js';
import type { CarouselOrientation } from './carousel-policy.js';
export function carouselSlideLabel(
  label: string,
  index: number,
  count: number,
): string {
  return `${label}, ${index + CAROUSEL_POLICY.step} of ${count}`;
}
export function carouselTarget(
  value: number,
  count: number,
  key: string,
  orientation: CarouselOrientation,
  direction: 'ltr' | 'rtl',
  loop: boolean,
) {
  if (count === 0) return undefined;
  if (key === 'Home') return 0;
  if (key === 'End') return count - CAROUSEL_POLICY.step;
  const forward =
    orientation === 'vertical'
      ? 'ArrowDown'
      : direction === 'rtl'
        ? 'ArrowLeft'
        : 'ArrowRight';
  const backward =
    orientation === 'vertical'
      ? 'ArrowUp'
      : direction === 'rtl'
        ? 'ArrowRight'
        : 'ArrowLeft';
  const next =
    key === forward
      ? value + CAROUSEL_POLICY.step
      : key === backward
        ? value - CAROUSEL_POLICY.step
        : undefined;
  if (next === undefined) return undefined;
  return loop
    ? (next + count) % count
    : Math.max(0, Math.min(count - CAROUSEL_POLICY.step, next));
}
