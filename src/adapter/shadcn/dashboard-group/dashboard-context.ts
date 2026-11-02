import { createContext } from 'react';
import type { DashboardGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-group/index.js';

export interface DashboardContextValue {
  readonly properties: DashboardGroupProps;
  readonly narrow: boolean;
  readonly blocked: boolean;
}
export const DashboardContext = createContext<DashboardContextValue | null>(null);
export const DashboardRegionContext = createContext<
  DashboardGroupProps['regions'][number] | null
>(null);
