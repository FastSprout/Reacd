import type { ComponentProps, ComponentType } from 'react';
import { SharedPageHero } from '../../shared/page-hero/page-hero.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageHeroProps = ComponentProps<typeof SharedPageHero>;
export const MuiPageHero: ComponentType<MuiPageHeroProps> = bindPrimitives(
  SharedPageHero,
  muiPrimitives,
  'MuiPageHero',
);
