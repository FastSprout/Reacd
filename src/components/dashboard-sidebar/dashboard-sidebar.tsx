import type { ReactNode } from 'react';
import type { DashboardSidebarProps } from './dashboard-sidebar.props.js';
import { dashboardSidebarSchema } from
  '../../schema/dashboard-sidebar/dashboard-sidebar.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardSidebar(props: DashboardSidebarProps): ReactNode {
  return useDeclaration('DashboardSidebar', dashboardSidebarSchema, props);
}
