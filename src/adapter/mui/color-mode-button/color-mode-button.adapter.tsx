import type { ComponentProps, ComponentType } from 'react';
import { SharedColorModeButton } from
  '../../shared/color-mode-button/color-mode-button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiColorModeButtonProps = ComponentProps<typeof SharedColorModeButton>;
export const MuiColorModeButton: ComponentType<MuiColorModeButtonProps> =
  bindPrimitives(SharedColorModeButton, muiPrimitives, 'MuiColorModeButton');
