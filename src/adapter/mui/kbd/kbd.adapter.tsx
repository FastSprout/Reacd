import type { ComponentProps, ComponentType } from 'react';
import { SharedKbd } from '../../shared/kbd/kbd.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiKbdProps = ComponentProps<typeof SharedKbd>;
export const MuiKbd: ComponentType<MuiKbdProps> = bindPrimitives(
  SharedKbd,
  muiPrimitives,
  'MuiKbd',
);
