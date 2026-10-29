import { useContext } from 'react';
import type { DashboardPanelProps } from '../../../components/dashboard-panel/index.js';
import { DASHBOARD_DEFAULTS } from '../../../core/dashboard-policy.js';
import {
  DashboardRegionContext,
  DashboardMainContext,
} from '../../../renderer/dashboard/dashboard-context.js';
import { MainScopeContext } from '../../../renderer/main/main-scope.js';
import { Issues } from '../../../renderer/issues/issues.renderer.js';

export function ShadcnDashboardPanel({
  label,
  children,
  header,
  footer,
}: DashboardPanelProps) {
  const position = useContext(DashboardRegionContext);
  const parentMain = useContext(MainScopeContext);
  const nested = parentMain || (position !== null && !position.primary);
  const name = label ?? position?.region.label;
  if (name === undefined)
    return (
      <Issues
        issues={[
          { path: 'DashboardPanel', message: DASHBOARD_DEFAULTS.missingPanelLabel },
        ]}
      />
    );
  const Container = nested ? 'section' : 'main';
  return (
    <Container className="reacd-node reacd-dashboard-panel" aria-label={name}>
      <MainScopeContext.Provider value={true}>
        <DashboardMainContext.Provider value={!nested}>
          {header !== undefined && (
            <div className="reacd-dashboard-panel-header">{header}</div>
          )}
          <div className="reacd-dashboard-panel-body">{children}</div>
          {footer !== undefined && <footer>{footer}</footer>}
        </DashboardMainContext.Provider>
      </MainScopeContext.Provider>
    </Container>
  );
}
