import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/command-palette/command-palette.adapter.js';
import { SharedCommandPalette } from
  '../../shared/command-palette/command-palette.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnCommandPaletteProps = ComponentProps<typeof SharedCommandPalette>;
export const ShadcnCommandPalette: ComponentType<ShadcnCommandPaletteProps> =
  bindPrimitives(SharedCommandPalette, shadcnPrimitives, 'ShadcnCommandPalette');
