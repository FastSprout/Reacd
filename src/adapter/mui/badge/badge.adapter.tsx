import type { ComponentProps, ComponentType } from 'react';
import { SharedBadge } from '../../shared/badge/badge.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiBadgeProps = ComponentProps<typeof SharedBadge>;
export const MuiBadge: ComponentType<MuiBadgeProps> = bindPrimitives(
  SharedBadge,
  muiPrimitives,
  'MuiBadge',
);
