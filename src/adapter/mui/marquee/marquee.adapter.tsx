import type { ComponentProps, ComponentType } from 'react';
import { SharedMarquee } from '../../shared/marquee/marquee.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiMarqueeProps = ComponentProps<typeof SharedMarquee>;
export const MuiMarquee: ComponentType<MuiMarqueeProps> = bindPrimitives(
  SharedMarquee,
  muiPrimitives,
  'MuiMarquee',
);
