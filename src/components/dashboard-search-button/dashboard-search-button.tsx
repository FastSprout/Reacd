import type { ReactNode } from 'react';
import type { DashboardSearchButtonProps } from './dashboard-search-button.props.js';
import { dashboardSearchButtonSchema } from
  '../../schema/dashboard-search-button/dashboard-search-button.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardSearchButton(props: DashboardSearchButtonProps): ReactNode {
  return useDeclaration('DashboardSearchButton', dashboardSearchButtonSchema, props);
}
