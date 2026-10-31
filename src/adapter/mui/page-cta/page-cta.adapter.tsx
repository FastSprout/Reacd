import type { ComponentProps, ComponentType } from 'react';
import { SharedPageCTA } from '../../shared/page-cta/page-cta.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageCTAProps = ComponentProps<typeof SharedPageCTA>;
export const MuiPageCTA: ComponentType<MuiPageCTAProps> = bindPrimitives(
  SharedPageCTA,
  muiPrimitives,
  'MuiPageCTA',
);
