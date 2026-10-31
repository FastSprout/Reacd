import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/banner/banner.adapter.js';
import { SharedBanner } from '../../shared/banner/banner.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnBannerProps = ComponentProps<typeof SharedBanner>;
export const ShadcnBanner: ComponentType<ShadcnBannerProps> = bindPrimitives(
  SharedBanner,
  shadcnPrimitives,
  'ShadcnBanner',
);
