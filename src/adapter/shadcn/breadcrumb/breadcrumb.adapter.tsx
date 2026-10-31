import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/breadcrumb/breadcrumb.adapter.js';
import { SharedBreadcrumb } from '../../shared/breadcrumb/breadcrumb.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnBreadcrumbProps = ComponentProps<typeof SharedBreadcrumb>;
export const ShadcnBreadcrumb: ComponentType<ShadcnBreadcrumbProps> = bindPrimitives(
  SharedBreadcrumb,
  shadcnPrimitives,
  'ShadcnBreadcrumb',
);
