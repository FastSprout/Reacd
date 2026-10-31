import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dashboard-toolbar/dashboard-toolbar.adapter.js';
import { SharedDashboardToolbar } from
  '../../shared/dashboard-toolbar/dashboard-toolbar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardToolbarProps = ComponentProps<typeof SharedDashboardToolbar>;
export const ShadcnDashboardToolbar: ComponentType<ShadcnDashboardToolbarProps> =
  bindPrimitives(SharedDashboardToolbar, shadcnPrimitives, 'ShadcnDashboardToolbar');
