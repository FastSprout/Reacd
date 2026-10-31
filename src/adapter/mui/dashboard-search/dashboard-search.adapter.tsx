import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardSearch } from
  '../../shared/dashboard-search/dashboard-search.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardSearchProps = ComponentProps<typeof SharedDashboardSearch>;
export const MuiDashboardSearch: ComponentType<MuiDashboardSearchProps> =
  bindPrimitives(SharedDashboardSearch, muiPrimitives, 'MuiDashboardSearch');
