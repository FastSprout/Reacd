import type { ComponentProps, ComponentType } from 'react';
import { SharedMain } from '../../shared/main/main.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiMainProps = ComponentProps<typeof SharedMain>;
export const MuiMain: ComponentType<MuiMainProps> = bindPrimitives(
  SharedMain,
  muiPrimitives,
  'MuiMain',
);
