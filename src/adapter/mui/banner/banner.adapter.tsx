import type { ComponentProps, ComponentType } from 'react';
import { SharedBanner } from '../../shared/banner/banner.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiBannerProps = ComponentProps<typeof SharedBanner>;
export const MuiBanner: ComponentType<MuiBannerProps> = bindPrimitives(
  SharedBanner,
  muiPrimitives,
  'MuiBanner',
);
