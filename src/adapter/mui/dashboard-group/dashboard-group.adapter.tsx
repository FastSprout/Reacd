import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardGroup } from
  '../../shared/dashboard-group/dashboard-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardGroupProps = ComponentProps<typeof SharedDashboardGroup>;
export const MuiDashboardGroup: ComponentType<MuiDashboardGroupProps> = bindPrimitives(
  SharedDashboardGroup,
  muiPrimitives,
  'MuiDashboardGroup',
);
