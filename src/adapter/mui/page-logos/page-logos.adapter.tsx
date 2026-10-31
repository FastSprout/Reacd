import type { ComponentProps, ComponentType } from 'react';
import { SharedPageLogos } from '../../shared/page-logos/page-logos.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageLogosProps = ComponentProps<typeof SharedPageLogos>;
export const MuiPageLogos: ComponentType<MuiPageLogosProps> = bindPrimitives(
  SharedPageLogos,
  muiPrimitives,
  'MuiPageLogos',
);
