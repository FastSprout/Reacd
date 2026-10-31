import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-feature/page-feature.adapter.js';
import { SharedPageFeature } from '../../shared/page-feature/page-feature.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageFeatureProps = ComponentProps<typeof SharedPageFeature>;
export const ShadcnPageFeature: ComponentType<ShadcnPageFeatureProps> = bindPrimitives(
  SharedPageFeature,
  shadcnPrimitives,
  'ShadcnPageFeature',
);
