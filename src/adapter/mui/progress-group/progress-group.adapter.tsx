import type { ComponentProps, ComponentType } from 'react';
import { SharedProgressGroup } from
  '../../shared/progress-group/progress-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiProgressGroupProps = ComponentProps<typeof SharedProgressGroup>;
export const MuiProgressGroup: ComponentType<MuiProgressGroupProps> = bindPrimitives(
  SharedProgressGroup,
  muiPrimitives,
  'MuiProgressGroup',
);
