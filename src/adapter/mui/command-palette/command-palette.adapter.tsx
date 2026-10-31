import type { ComponentProps, ComponentType } from 'react';
import { SharedCommandPalette } from
  '../../shared/command-palette/command-palette.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiCommandPaletteProps = ComponentProps<typeof SharedCommandPalette>;
export const MuiCommandPalette: ComponentType<MuiCommandPaletteProps> = bindPrimitives(
  SharedCommandPalette,
  muiPrimitives,
  'MuiCommandPalette',
);
