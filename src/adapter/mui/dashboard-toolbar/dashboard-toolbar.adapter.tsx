import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardToolbar } from
  '../../shared/dashboard-toolbar/dashboard-toolbar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardToolbarProps = ComponentProps<typeof SharedDashboardToolbar>;
export const MuiDashboardToolbar: ComponentType<MuiDashboardToolbarProps> =
  bindPrimitives(SharedDashboardToolbar, muiPrimitives, 'MuiDashboardToolbar');
