import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-section/page-section.adapter.js';
import { SharedPageSection } from '../../shared/page-section/page-section.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageSectionProps = ComponentProps<typeof SharedPageSection>;
export const ShadcnPageSection: ComponentType<ShadcnPageSectionProps> = bindPrimitives(
  SharedPageSection,
  shadcnPrimitives,
  'ShadcnPageSection',
);
