import type { ComponentProps, ComponentType } from 'react';
import { SharedSeparator } from '../../shared/separator/separator.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSeparatorProps = ComponentProps<typeof SharedSeparator>;
export const MuiSeparator: ComponentType<MuiSeparatorProps> = bindPrimitives(
  SharedSeparator,
  muiPrimitives,
  'MuiSeparator',
);
