import type { ComponentProps, ComponentType } from 'react';
import { SharedPageCard } from '../../shared/page-card/page-card.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageCardProps = ComponentProps<typeof SharedPageCard>;
export const MuiPageCard: ComponentType<MuiPageCardProps> = bindPrimitives(
  SharedPageCard,
  muiPrimitives,
  'MuiPageCard',
);
