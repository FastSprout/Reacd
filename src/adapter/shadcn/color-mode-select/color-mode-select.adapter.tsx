import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/color-mode-select/color-mode-select.adapter.js';
import { SharedColorModeSelect } from
  '../../shared/color-mode-select/color-mode-select.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnColorModeSelectProps = ComponentProps<typeof SharedColorModeSelect>;
export const ShadcnColorModeSelect: ComponentType<ShadcnColorModeSelectProps> =
  bindPrimitives(SharedColorModeSelect, shadcnPrimitives, 'ShadcnColorModeSelect');
