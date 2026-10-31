import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/progress-group/progress-group.adapter.js';
import { SharedProgressGroup } from
  '../../shared/progress-group/progress-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnProgressGroupProps = ComponentProps<typeof SharedProgressGroup>;
export const ShadcnProgressGroup: ComponentType<ShadcnProgressGroupProps> =
  bindPrimitives(SharedProgressGroup, shadcnPrimitives, 'ShadcnProgressGroup');
