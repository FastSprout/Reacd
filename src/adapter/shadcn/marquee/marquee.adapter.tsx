import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/marquee/marquee.adapter.js';
import { SharedMarquee } from '../../shared/marquee/marquee.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnMarqueeProps = ComponentProps<typeof SharedMarquee>;
export const ShadcnMarquee: ComponentType<ShadcnMarqueeProps> = bindPrimitives(
  SharedMarquee,
  shadcnPrimitives,
  'ShadcnMarquee',
);
