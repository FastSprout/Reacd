import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dashboard-navbar/dashboard-navbar.adapter.js';
import { SharedDashboardNavbar } from
  '../../shared/dashboard-navbar/dashboard-navbar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardNavbarProps = ComponentProps<typeof SharedDashboardNavbar>;
export const ShadcnDashboardNavbar: ComponentType<ShadcnDashboardNavbarProps> =
  bindPrimitives(SharedDashboardNavbar, shadcnPrimitives, 'ShadcnDashboardNavbar');
