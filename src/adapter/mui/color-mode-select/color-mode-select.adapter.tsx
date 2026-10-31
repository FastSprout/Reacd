import type { ComponentProps, ComponentType } from 'react';
import { SharedColorModeSelect } from
  '../../shared/color-mode-select/color-mode-select.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiColorModeSelectProps = ComponentProps<typeof SharedColorModeSelect>;
export const MuiColorModeSelect: ComponentType<MuiColorModeSelectProps> =
  bindPrimitives(SharedColorModeSelect, muiPrimitives, 'MuiColorModeSelect');
