import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dashboard-search/dashboard-search.adapter.js';
import { SharedDashboardSearch } from
  '../../shared/dashboard-search/dashboard-search.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardSearchProps = ComponentProps<typeof SharedDashboardSearch>;
export const ShadcnDashboardSearch: ComponentType<ShadcnDashboardSearchProps> =
  bindPrimitives(SharedDashboardSearch, shadcnPrimitives, 'ShadcnDashboardSearch');
