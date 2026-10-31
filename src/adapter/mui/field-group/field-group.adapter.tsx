import type { ComponentProps, ComponentType } from 'react';
import { SharedFieldGroup } from '../../shared/field-group/field-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiFieldGroupProps = ComponentProps<typeof SharedFieldGroup>;
export const MuiFieldGroup: ComponentType<MuiFieldGroupProps> = bindPrimitives(
  SharedFieldGroup,
  muiPrimitives,
  'MuiFieldGroup',
);
