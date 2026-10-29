import type { ReactNode } from 'react';
import type { DashboardSidebarToggleProps } from './dashboard-sidebar-toggle.props.js';
import { dashboardSidebarToggleSchema } from
  '../../schema/dashboard-sidebar-toggle/dashboard-sidebar-toggle.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardSidebarToggle(props: DashboardSidebarToggleProps): ReactNode {
  return useDeclaration('DashboardSidebarToggle', dashboardSidebarToggleSchema, props);
}
