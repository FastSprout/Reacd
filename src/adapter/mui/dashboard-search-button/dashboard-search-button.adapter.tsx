import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardSearchButton } from
  '../../shared/dashboard-search-button/dashboard-search-button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardSearchButtonProps = ComponentProps<
  typeof SharedDashboardSearchButton
>;
export const MuiDashboardSearchButton: ComponentType<MuiDashboardSearchButtonProps> =
  bindPrimitives(
    SharedDashboardSearchButton,
    muiPrimitives,
    'MuiDashboardSearchButton',
  );
