import type { ComponentProps, ComponentType } from 'react';
import { SharedPageFeature } from '../../shared/page-feature/page-feature.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageFeatureProps = ComponentProps<typeof SharedPageFeature>;
export const MuiPageFeature: ComponentType<MuiPageFeatureProps> = bindPrimitives(
  SharedPageFeature,
  muiPrimitives,
  'MuiPageFeature',
);
