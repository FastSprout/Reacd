import { useContext } from 'react';
import type { DashboardGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-group/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { SPLITTER_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/splitter-policy.js';
import { dashboardDisplayLayout } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-layout.js';
import { MainScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/main/main-scope.js';
import { CardContent } from '../vendor/ui/card.js';
import { usePageWidth } from '../page/use-page-width.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ShadcnSplitter } from '../splitter/splitter.adapter.js';
import { DashboardContext, DashboardRegionContext } from './dashboard-context.js';
import { BoundaryContext, useBoundaryDefinitions } from './handle-context.js';

export type ShadcnDashboardGroupProps = DashboardGroupProps;
export function ShadcnDashboardGroup(properties: DashboardGroupProps) {
  const {
    label,
    regions,
    value,
    open,
    children,
    onValueChange,
    collapseMode = DASHBOARD_DEFAULTS.collapseMode,
    disabled,
  } = properties;
  const { setElement, measured, widthRem } = usePageWidth();
  const narrow =
    measured && widthRem < regions.length * SPLITTER_POLICY.panelTrackRem;
  const metadata = useNativeField({ disabled });
  const insideMain = useContext(MainScopeContext);
  const boundaries = useBoundaryDefinitions();
  const firstPanel = regions.find((region) => region.kind === 'panel');
  const normalized = regions.map((region) => ({
    ...region,
    minShare: region.minShare ?? SPLITTER_POLICY.minShare,
    maxShare: region.maxShare ?? SPLITTER_POLICY.maxShare,
  }));
  const displayed = dashboardDisplayLayout(
    normalized,
    value,
    open,
    narrow,
    collapseMode,
  );
  const resizable = open && !narrow;
  return (
    <DashboardContext value={{ properties, narrow, blocked: metadata.blocked }}>
      <BoundaryContext value={boundaries}>
        <CardContent ref={setElement} className="min-w-0 p-0">
          <ShadcnSplitter
            label={label}
            value={displayed}
            narrow={narrow}
            disabled={metadata.blocked || !resizable}
            boundaryDefinitions={boundaries.definitions}
            resizeLabel={properties.resizeLabel}
            onValueChange={onValueChange}
            panels={normalized.map((region) => ({
              ...region,
              ...(resizable
                ? {}
                : {
                    minShare: SPLITTER_POLICY.zero,
                    maxShare: SPLITTER_POLICY.total,
                    collapsedShare: SPLITTER_POLICY.zero,
                  }),
              content: (
                <DashboardRegionContext value={region}>
                  <MainScopeContext
                    value={
                      insideMain ||
                      (region.kind === 'panel' && region.id !== firstPanel?.id)
                    }
                  >
                    {region.content}
                  </MainScopeContext>
                </DashboardRegionContext>
              ),
            }))}
          />
          {children}
        </CardContent>
      </BoundaryContext>
    </DashboardContext>
  );
}
