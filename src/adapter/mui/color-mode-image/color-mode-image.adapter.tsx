import type { ComponentProps, ComponentType } from 'react';
import { SharedColorModeImage } from
  '../../shared/color-mode-image/color-mode-image.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiColorModeImageProps = ComponentProps<typeof SharedColorModeImage>;
export const MuiColorModeImage: ComponentType<MuiColorModeImageProps> = bindPrimitives(
  SharedColorModeImage,
  muiPrimitives,
  'MuiColorModeImage',
);
