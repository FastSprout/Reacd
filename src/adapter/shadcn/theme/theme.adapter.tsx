import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/theme/theme.adapter.js';
import { SharedTheme } from '../../shared/theme/theme.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnThemeProps = ComponentProps<typeof SharedTheme>;
export const ShadcnTheme: ComponentType<ShadcnThemeProps> = bindPrimitives(
  SharedTheme,
  shadcnPrimitives,
  'ShadcnTheme',
);
