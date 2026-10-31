import type { ComponentProps, ComponentType } from 'react';
import { SharedListbox } from '../../shared/listbox/listbox.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiListboxProps = ComponentProps<typeof SharedListbox>;
export const MuiListbox: ComponentType<MuiListboxProps> = bindPrimitives(
  SharedListbox,
  muiPrimitives,
  'MuiListbox',
);
