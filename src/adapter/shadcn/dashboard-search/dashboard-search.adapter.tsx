import type { DashboardSearchProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-search/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { ShadcnContentSearch } from '../content-search/content-search.adapter.js';

export type ShadcnDashboardSearchProps = DashboardSearchProps;
export function ShadcnDashboardSearch({
  title = DASHBOARD_DEFAULTS.searchLabel,
  description = DASHBOARD_DEFAULTS.searchDescription,
  ...properties
}: DashboardSearchProps) {
  return (
    <ShadcnContentSearch {...properties} title={title} description={description} />
  );
}
