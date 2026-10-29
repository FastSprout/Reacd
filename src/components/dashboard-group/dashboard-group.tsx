import type { ReactNode } from 'react';
import type { DashboardGroupProps } from './dashboard-group.props.js';
import { dashboardGroupSchema } from
  '../../schema/dashboard-group/dashboard-group.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardGroup(props: DashboardGroupProps): ReactNode {
  return useDeclaration('DashboardGroup', dashboardGroupSchema, props);
}
