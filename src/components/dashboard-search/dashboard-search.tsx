import type { ReactNode } from 'react';
import type { DashboardSearchProps } from './dashboard-search.props.js';
import { dashboardSearchSchema } from
  '../../schema/dashboard-search/dashboard-search.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardSearch(props: DashboardSearchProps): ReactNode {
  return useDeclaration('DashboardSearch', dashboardSearchSchema, props);
}
