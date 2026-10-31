import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/badge/badge.adapter.js';
import { SharedBadge } from '../../shared/badge/badge.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnBadgeProps = ComponentProps<typeof SharedBadge>;
export const ShadcnBadge: ComponentType<ShadcnBadgeProps> = bindPrimitives(
  SharedBadge,
  shadcnPrimitives,
  'ShadcnBadge',
);
