import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardPanel } from
  '../../shared/dashboard-panel/dashboard-panel.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardPanelProps = ComponentProps<typeof SharedDashboardPanel>;
export const MuiDashboardPanel: ComponentType<MuiDashboardPanelProps> = bindPrimitives(
  SharedDashboardPanel,
  muiPrimitives,
  'MuiDashboardPanel',
);
