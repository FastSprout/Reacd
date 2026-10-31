import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/card/card.adapter.js';
import { SharedCard } from '../../shared/card/card.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnCardProps = ComponentProps<typeof SharedCard>;
export const ShadcnCard: ComponentType<ShadcnCardProps> = bindPrimitives(
  SharedCard,
  shadcnPrimitives,
  'ShadcnCard',
);
