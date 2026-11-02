import type { SkeletonProps } from
  '@fastsprout/reacd/adapter-runtime/components/skeleton/skeleton.props.js';
import { SKELETON_DEFAULTS, SKELETON_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/skeleton-policy.js';
import { AVATAR_DIMENSIONS } from
  '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';
import { Skeleton } from '../vendor/ui/skeleton.js';
import { CardContent } from '../vendor/ui/card.js';
import { cn } from '../vendor/lib/utils.js';

export type ShadcnSkeletonProps = SkeletonProps;
export function ShadcnSkeleton({ shape = SKELETON_DEFAULTS.shape,
  size = SKELETON_DEFAULTS.size, lines = SKELETON_DEFAULTS.lines,
  animated = SKELETON_DEFAULTS.animated, show = SKELETON_DEFAULTS.show, label }:
  SkeletonProps) {
  if (!show) return null;
  const dimension = shape === 'avatar' ? AVATAR_DIMENSIONS[size].rem
    : SKELETON_POLICY.rectangleRem[size];
  return <CardContent role={label ? 'status' : undefined} aria-label={label}
    className="grid gap-2 p-0">
    {shape === 'text' ? Array.from({ length: lines }, (_, index) => (
      <Skeleton key={index} aria-hidden="true"
        className={cn('motion-reduce:animate-none', !animated && 'animate-none')}
        style={{ height: `${SKELETON_POLICY.lineEm[size]}em`,
          width: index === lines - 1
            ? `${SKELETON_POLICY.lastLinePercent}%` : '100%' }} />
    )) : <Skeleton aria-hidden="true"
      className={cn('motion-reduce:animate-none', !animated && 'animate-none',
        shape === 'avatar' && 'rounded-full')}
      style={{ width: `${dimension}rem`, height: `${dimension}rem` }} />}
  </CardContent>;
}
