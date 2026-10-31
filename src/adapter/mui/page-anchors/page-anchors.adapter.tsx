import type { ComponentProps, ComponentType } from 'react';
import { SharedPageAnchors } from '../../shared/page-anchors/page-anchors.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageAnchorsProps = ComponentProps<typeof SharedPageAnchors>;
export const MuiPageAnchors: ComponentType<MuiPageAnchorsProps> = bindPrimitives(
  SharedPageAnchors,
  muiPrimitives,
  'MuiPageAnchors',
);
