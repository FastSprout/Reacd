import { useContext, useEffect, useId } from 'react';
import type { DashboardResizeHandleProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-resize-handle/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import {
  DashboardContext,
  DashboardRegionContext,
} from '../dashboard-group/dashboard-context.js';
import { BoundaryContext } from '../dashboard-group/handle-context.js';
import { DashboardDiagnostic } from '../dashboard-group/diagnostic.js';

export type ShadcnDashboardResizeHandleProps = DashboardResizeHandleProps;
export function ShadcnDashboardResizeHandle({
  label,
  disabled,
}: DashboardResizeHandleProps) {
  const group = useContext(DashboardContext);
  const region = useContext(DashboardRegionContext);
  const boundaries = useContext(BoundaryContext);
  const key = useId();
  const register = boundaries?.register;
  const regionId = region?.id;
  const final = group?.properties.regions.at(-1)?.id === region?.id;
  useEffect(() => {
    if (register !== undefined && regionId !== undefined && !final)
      return register(regionId, { key, label, disabled });
    return undefined;
  }, [register, regionId, final, key, label, disabled]);
  if (group === null || region === null || boundaries === null)
    return <DashboardDiagnostic message={DASHBOARD_DEFAULTS.missingGroup} />;
  if (final)
    return <DashboardDiagnostic message={DASHBOARD_DEFAULTS.missingHandleBoundary} />;
  if ((boundaries.definitions.get(region.id)?.length ?? 0) > 1)
    return <DashboardDiagnostic message={DASHBOARD_DEFAULTS.duplicateHandle} />;
  return null;
}
