import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/tooltip/tooltip.adapter.js';
import { SharedTooltip } from '../../shared/tooltip/tooltip.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnTooltipProps = ComponentProps<typeof SharedTooltip>;
export const ShadcnTooltip: ComponentType<ShadcnTooltipProps> = bindPrimitives(
  SharedTooltip,
  shadcnPrimitives,
  'ShadcnTooltip',
);
