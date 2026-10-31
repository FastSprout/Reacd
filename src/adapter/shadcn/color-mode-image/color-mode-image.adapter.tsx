import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/color-mode-image/color-mode-image.adapter.js';
import { SharedColorModeImage } from
  '../../shared/color-mode-image/color-mode-image.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnColorModeImageProps = ComponentProps<typeof SharedColorModeImage>;
export const ShadcnColorModeImage: ComponentType<ShadcnColorModeImageProps> =
  bindPrimitives(SharedColorModeImage, shadcnPrimitives, 'ShadcnColorModeImage');
