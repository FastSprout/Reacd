import type { ComponentProps, ComponentType } from 'react';
import { SharedEmpty } from '../../shared/empty/empty.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiEmptyProps = ComponentProps<typeof SharedEmpty>;
export const MuiEmpty: ComponentType<MuiEmptyProps> = bindPrimitives(
  SharedEmpty,
  muiPrimitives,
  'MuiEmpty',
);
