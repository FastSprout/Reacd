import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-card/page-card.adapter.js';
import { SharedPageCard } from '../../shared/page-card/page-card.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageCardProps = ComponentProps<typeof SharedPageCard>;
export const ShadcnPageCard: ComponentType<ShadcnPageCardProps> = bindPrimitives(
  SharedPageCard,
  shadcnPrimitives,
  'ShadcnPageCard',
);
