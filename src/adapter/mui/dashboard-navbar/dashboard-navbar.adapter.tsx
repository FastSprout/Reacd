import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardNavbar } from
  '../../shared/dashboard-navbar/dashboard-navbar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardNavbarProps = ComponentProps<typeof SharedDashboardNavbar>;
export const MuiDashboardNavbar: ComponentType<MuiDashboardNavbarProps> =
  bindPrimitives(SharedDashboardNavbar, muiPrimitives, 'MuiDashboardNavbar');
