import { Fragment, useCallback, useContext, useId, useRef } from 'react';
import type { z } from 'zod';
import { useDirection } from '@base-ui/react/direction-provider';
import type { dashboardGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-group/dashboard-group.schema.js';
import {
  DASHBOARD_DEFAULTS,
  DASHBOARD_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { dashboardDisplayLayout } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-layout.js';
import { useSplitterReflow } from
  '@fastsprout/reacd/adapter-runtime/renderer/splitter/use-splitter-reflow.js';
import { useSplitterDrag } from
  '@fastsprout/reacd/adapter-runtime/renderer/splitter/use-splitter-drag.js';
import {
  DashboardContext,
  DashboardRegionContext,
  DashboardMainContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/dashboard/dashboard-context.js';
import { MainScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/main/main-scope.js';
import { ShadcnDashboardResizeHandle } from
  '../dashboard-resize-handle/dashboard-resize-handle.adapter.js';

export function ShadcnDashboardGroup({
  label,
  regions,
  value,
  onValueChange,
  open,
  onOpenChange,
  mobileOpen,
  onMobileOpenChange,
  disabled = DASHBOARD_DEFAULTS.disabled,
  collapseMode = DASHBOARD_DEFAULTS.collapseMode,
  resizeLabel,
  children,
}: z.output<typeof dashboardGroupSchema>) {
  const reference = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const rememberTrigger = useCallback((element: HTMLButtonElement) => {
    mobileTrigger.current = element;
  }, []);
  const expanded = useRef(new Map<string, number>());
  const prefix = useId();
  const direction = useDirection();
  const parentMain = useContext(MainScopeContext);
  const primary = regions.findIndex((region) => region.kind === 'panel');
  const narrow = useSplitterReflow(reference, track, regions.length);
  const presentation = dashboardDisplayLayout(
    regions,
    value,
    open,
    narrow,
    collapseMode,
  );
  const drag = useSplitterDrag({
    reference,
    panels: regions,
    value,
    onValueChange,
    orientation: 'horizontal',
    direction,
    disabled: disabled || narrow || !open,
  });
  const context = {
    regions,
    value,
    onValueChange,
    open,
    onOpenChange,
    mobileOpen,
    onMobileOpenChange,
    disabled,
    narrow,
    collapseMode,
    prefix,
    resizeLabel,
    direction,
    drag,
    expanded,
    mobileTrigger,
    rememberTrigger,
  };
  return (
    <DashboardContext.Provider value={context}>
      <DashboardMainContext.Provider value={false}>
        <DashboardRegionContext.Provider value={null}>
          <div
            ref={reference}
            role="group"
            aria-label={label}
            className="reacd-node reacd-dashboard-group reacd-splitter"
            data-orientation="horizontal"
            data-narrow={narrow}
            data-dragging={drag.dragging}
          >
            <span ref={track} aria-hidden="true" className="reacd-splitter-track" />
            {regions.map((region, index) => (
              <Fragment key={region.id}>
                <DashboardRegionContext.Provider
                  value={{ index, region, primary: index === primary }}
                >
                  <MainScopeContext.Provider value={parentMain || index !== primary}>
                    <div
                      id={`${prefix}-${region.id}`}
                      className="reacd-dashboard-region"
                      data-sidebar={region.kind === 'sidebar'}
                      data-empty={
                        presentation[index]?.share === DASHBOARD_POLICY.zeroShare
                      }
                      style={{ flexGrow: presentation[index]?.share }}
                    >
                      {region.content}
                    </div>
                    <ShadcnDashboardResizeHandle />
                  </MainScopeContext.Provider>
                </DashboardRegionContext.Provider>
              </Fragment>
            ))}
          </div>
          <MainScopeContext.Provider value={true}>{children}</MainScopeContext.Provider>
        </DashboardRegionContext.Provider>
      </DashboardMainContext.Provider>
    </DashboardContext.Provider>
  );
}
