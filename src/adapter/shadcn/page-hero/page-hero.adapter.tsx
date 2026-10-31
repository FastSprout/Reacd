import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-hero/page-hero.adapter.js';
import { SharedPageHero } from '../../shared/page-hero/page-hero.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageHeroProps = ComponentProps<typeof SharedPageHero>;
export const ShadcnPageHero: ComponentType<ShadcnPageHeroProps> = bindPrimitives(
  SharedPageHero,
  shadcnPrimitives,
  'ShadcnPageHero',
);
