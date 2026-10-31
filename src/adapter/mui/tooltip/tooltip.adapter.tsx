import type { ComponentProps, ComponentType } from 'react';
import { SharedTooltip } from '../../shared/tooltip/tooltip.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiTooltipProps = ComponentProps<typeof SharedTooltip>;
export const MuiTooltip: ComponentType<MuiTooltipProps> = bindPrimitives(
  SharedTooltip,
  muiPrimitives,
  'MuiTooltip',
);
