import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dashboard-group/dashboard-group.adapter.js';
import { SharedDashboardGroup } from
  '../../shared/dashboard-group/dashboard-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardGroupProps = ComponentProps<typeof SharedDashboardGroup>;
export const ShadcnDashboardGroup: ComponentType<ShadcnDashboardGroupProps> =
  bindPrimitives(SharedDashboardGroup, shadcnPrimitives, 'ShadcnDashboardGroup');
