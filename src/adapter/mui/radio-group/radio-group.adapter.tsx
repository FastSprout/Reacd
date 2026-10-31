import type { ComponentProps, ComponentType } from 'react';
import { SharedRadioGroup } from '../../shared/radio-group/radio-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiRadioGroupProps = ComponentProps<typeof SharedRadioGroup>;
export const MuiRadioGroup: ComponentType<MuiRadioGroupProps> = bindPrimitives(
  SharedRadioGroup,
  muiPrimitives,
  'MuiRadioGroup',
);
