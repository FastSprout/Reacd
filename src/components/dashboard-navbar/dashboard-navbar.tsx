import type { ReactNode } from 'react';
import type { DashboardNavbarProps } from './dashboard-navbar.props.js';
import { dashboardNavbarSchema } from
  '../../schema/dashboard-navbar/dashboard-navbar.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardNavbar(props: DashboardNavbarProps): ReactNode {
  return useDeclaration('DashboardNavbar', dashboardNavbarSchema, props);
}
