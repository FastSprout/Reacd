import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardResizeHandle } from
  '../../shared/dashboard-resize-handle/dashboard-resize-handle.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardResizeHandleProps = ComponentProps<
  typeof SharedDashboardResizeHandle
>;
export const MuiDashboardResizeHandle: ComponentType<MuiDashboardResizeHandleProps> =
  bindPrimitives(
    SharedDashboardResizeHandle,
    muiPrimitives,
    'MuiDashboardResizeHandle',
  );
