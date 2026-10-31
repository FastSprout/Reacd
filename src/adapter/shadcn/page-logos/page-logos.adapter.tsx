import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-logos/page-logos.adapter.js';
import { SharedPageLogos } from '../../shared/page-logos/page-logos.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageLogosProps = ComponentProps<typeof SharedPageLogos>;
export const ShadcnPageLogos: ComponentType<ShadcnPageLogosProps> = bindPrimitives(
  SharedPageLogos,
  shadcnPrimitives,
  'ShadcnPageLogos',
);
