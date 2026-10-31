import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-links/page-links.adapter.js';
import { SharedPageLinks } from '../../shared/page-links/page-links.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageLinksProps = ComponentProps<typeof SharedPageLinks>;
export const ShadcnPageLinks: ComponentType<ShadcnPageLinksProps> = bindPrimitives(
  SharedPageLinks,
  shadcnPrimitives,
  'ShadcnPageLinks',
);
