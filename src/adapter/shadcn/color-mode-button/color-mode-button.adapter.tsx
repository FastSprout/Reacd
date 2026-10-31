import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/color-mode-button/color-mode-button.adapter.js';
import { SharedColorModeButton } from
  '../../shared/color-mode-button/color-mode-button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnColorModeButtonProps = ComponentProps<typeof SharedColorModeButton>;
export const ShadcnColorModeButton: ComponentType<ShadcnColorModeButtonProps> =
  bindPrimitives(SharedColorModeButton, shadcnPrimitives, 'ShadcnColorModeButton');
