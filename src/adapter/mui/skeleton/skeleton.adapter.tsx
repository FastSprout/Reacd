import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import type { SkeletonProps } from
  '@fastsprout/reacd/adapter-runtime/components/skeleton/skeleton.props.js';
import {
  SKELETON_DEFAULTS,
  SKELETON_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/skeleton-policy.js';

import { AVATAR_DIMENSIONS } from
  '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';

export type MuiSkeletonProps = SkeletonProps;

export function MuiSkeleton(props: MuiSkeletonProps) {
  if (!(props.show ?? SKELETON_DEFAULTS.show)) return null;
  const shape = props.shape ?? SKELETON_DEFAULTS.shape;
  const size = props.size ?? SKELETON_DEFAULTS.size;
  const animated = props.animated ?? SKELETON_DEFAULTS.animated;
  const lines = shape === 'text' ? (props.lines ?? SKELETON_DEFAULTS.lines) : 1;
  return (
    <Stack role="status" aria-label={props.label}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant={
            shape === 'text' ? 'text' : shape === 'avatar' ? 'circular' : 'rounded'
          }
          animation={animated ? 'pulse' : false}
          width={shape === 'avatar' ? `${AVATAR_DIMENSIONS[size].rem}rem` : '100%'}
          height={
            shape === 'text'
              ? `${SKELETON_POLICY.lineEm[size]}em`
              : `${
                  shape === 'avatar'
                    ? AVATAR_DIMENSIONS[size].rem
                    : SKELETON_POLICY.rectangleRem[size]
                }rem`
          }
        />
      ))}
    </Stack>
  );
}
