import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-header/page-header.adapter.js';
import { SharedPageHeader } from '../../shared/page-header/page-header.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageHeaderProps = ComponentProps<typeof SharedPageHeader>;
export const ShadcnPageHeader: ComponentType<ShadcnPageHeaderProps> = bindPrimitives(
  SharedPageHeader,
  shadcnPrimitives,
  'ShadcnPageHeader',
);
