import type { ComponentProps, ComponentType } from 'react';
import { SharedBreadcrumb } from '../../shared/breadcrumb/breadcrumb.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiBreadcrumbProps = ComponentProps<typeof SharedBreadcrumb>;
export const MuiBreadcrumb: ComponentType<MuiBreadcrumbProps> = bindPrimitives(
  SharedBreadcrumb,
  muiPrimitives,
  'MuiBreadcrumb',
);
