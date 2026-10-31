import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dashboard-resize-handle/dashboard-resize-handle.adapter.js';
import { SharedDashboardResizeHandle } from
  '../../shared/dashboard-resize-handle/dashboard-resize-handle.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardResizeHandleProps = ComponentProps<
  typeof SharedDashboardResizeHandle
>;
export const ShadcnDashboardResizeHandle:
  ComponentType<ShadcnDashboardResizeHandleProps> =
  bindPrimitives(
    SharedDashboardResizeHandle,
    shadcnPrimitives,
    'ShadcnDashboardResizeHandle',
  );
