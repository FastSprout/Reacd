import type { ReactNode } from 'react';
import type { DashboardToolbarProps } from './dashboard-toolbar.props.js';
import { dashboardToolbarSchema } from
  '../../schema/dashboard-toolbar/dashboard-toolbar.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardToolbar(props: DashboardToolbarProps): ReactNode {
  return useDeclaration('DashboardToolbar', dashboardToolbarSchema, props);
}
