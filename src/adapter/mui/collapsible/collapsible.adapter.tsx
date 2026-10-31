import type { ComponentProps, ComponentType } from 'react';
import { SharedCollapsible } from '../../shared/collapsible/collapsible.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiCollapsibleProps = ComponentProps<typeof SharedCollapsible>;
export const MuiCollapsible: ComponentType<MuiCollapsibleProps> = bindPrimitives(
  SharedCollapsible,
  muiPrimitives,
  'MuiCollapsible',
);
