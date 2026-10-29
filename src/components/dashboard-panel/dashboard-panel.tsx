import type { ReactNode } from 'react';
import type { DashboardPanelProps } from './dashboard-panel.props.js';
import { dashboardPanelSchema } from
  '../../schema/dashboard-panel/dashboard-panel.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardPanel(props: DashboardPanelProps): ReactNode {
  return useDeclaration('DashboardPanel', dashboardPanelSchema, props);
}
