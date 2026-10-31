import type { ComponentProps, ComponentType } from 'react';
import { SharedCard } from '../../shared/card/card.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiCardProps = ComponentProps<typeof SharedCard>;
export const MuiCard: ComponentType<MuiCardProps> = bindPrimitives(
  SharedCard,
  muiPrimitives,
  'MuiCard',
);
