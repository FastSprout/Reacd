import { useContext } from 'react';
import type { DashboardPanelProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-panel/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { MainScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/main/main-scope.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { CardContent, CardHeader, CardFooter } from '../vendor/ui/card.js';
import { DashboardRegionContext } from '../dashboard-group/dashboard-context.js';
import { DashboardDiagnostic } from '../dashboard-group/diagnostic.js';

export type ShadcnDashboardPanelProps = DashboardPanelProps;
export function ShadcnDashboardPanel({
  label,
  children,
  header,
  footer,
}: DashboardPanelProps) {
  const region = useContext(DashboardRegionContext);
  const insideMain = useContext(MainScopeContext);
  const level = useContext(HeadingLevelContext);
  const name = label ?? region?.label;
  if (name === undefined)
    return <DashboardDiagnostic message={DASHBOARD_DEFAULTS.missingPanelLabel} />;
  return (
    <CardContent
      role={insideMain ? 'region' : 'main'}
      aria-label={name}
      className="flex min-w-0 flex-col gap-4 p-0"
      style={{ overflowWrap: 'anywhere' }}
    >
      <MainScopeContext value={true}>
        <HeadingLevelContext value={insideMain ? nextHeadingLevel(level) : level}>
          {header && <CardHeader>{header}</CardHeader>}
          {children}
          {footer && <CardFooter className="flex-wrap">{footer}</CardFooter>}
        </HeadingLevelContext>
      </MainScopeContext>
    </CardContent>
  );
}
