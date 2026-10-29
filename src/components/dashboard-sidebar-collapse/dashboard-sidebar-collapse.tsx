import type { ReactNode } from 'react';
import type { DashboardSidebarCollapseProps } from
  './dashboard-sidebar-collapse.props.js';
import { dashboardSidebarCollapseSchema } from
  '../../schema/dashboard-sidebar-collapse/dashboard-sidebar-collapse.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardSidebarCollapse(
  props: DashboardSidebarCollapseProps,
): ReactNode {
  return useDeclaration(
    'DashboardSidebarCollapse',
    dashboardSidebarCollapseSchema,
    props,
  );
}
