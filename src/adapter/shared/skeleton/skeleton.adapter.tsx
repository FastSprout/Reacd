import type { SkeletonProps } from
  '@fastsprout/reacd/adapter-runtime/components/skeleton/skeleton.js';
import { SKELETON_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/skeleton-policy.js';

export function SharedSkeleton({
  shape = SKELETON_DEFAULTS.shape,
  size = SKELETON_DEFAULTS.size,
  lines = SKELETON_DEFAULTS.lines,
  animated = SKELETON_DEFAULTS.animated,
  show = SKELETON_DEFAULTS.show,
  label,
}: SkeletonProps) {
  if (!show) return null;
  const announced = label !== undefined;
  return (
    <div
      className="reacd-node reacd-skeleton"
      data-slot="skeleton"
      data-shape={shape}
      data-size={size}
      data-animated={animated}
      role={announced ? 'status' : undefined}
      aria-label={label}
      aria-hidden={announced ? undefined : true}
    >
      {announced && <span className="reacd-skeleton-label">{label}</span>}
      <div className="reacd-skeleton-visual" aria-hidden="true">
        {Array.from({ length: shape === 'text' ? lines : 1 }, (_, index) => (
          <span
            key={index}
            className="reacd-skeleton-shape"
            data-short={shape === 'text' && lines > 1 && index === lines - 1}
          />
        ))}
      </div>
    </div>
  );
}
