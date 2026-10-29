import type { ReactNode } from 'react';
import type { DashboardResizeHandleProps } from './dashboard-resize-handle.props.js';
import { dashboardResizeHandleSchema } from
  '../../schema/dashboard-resize-handle/dashboard-resize-handle.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function DashboardResizeHandle(props: DashboardResizeHandleProps): ReactNode {
  return useDeclaration('DashboardResizeHandle', dashboardResizeHandleSchema, props);
}
