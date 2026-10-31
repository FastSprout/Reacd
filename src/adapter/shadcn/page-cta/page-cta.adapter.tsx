import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-cta/page-cta.adapter.js';
import { SharedPageCTA } from '../../shared/page-cta/page-cta.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageCTAProps = ComponentProps<typeof SharedPageCTA>;
export const ShadcnPageCTA: ComponentType<ShadcnPageCTAProps> = bindPrimitives(
  SharedPageCTA,
  shadcnPrimitives,
  'ShadcnPageCTA',
);
