import { useContext } from 'react';
import type { DashboardResizeHandleProps } from
  '../../../components/dashboard-resize-handle/index.js';
import { DASHBOARD_DEFAULTS } from '../../../core/dashboard-policy.js';
import { pairBounds } from '../../../core/splitter.js';
import { splitterKey } from '../../../renderer/splitter/splitter-key.js';
import {
  DashboardContext,
  DashboardRegionContext,
} from '../../../renderer/dashboard/dashboard-context.js';
import { Issues } from '../../../renderer/issues/issues.renderer.js';

export function ShadcnDashboardResizeHandle({
  label,
  disabled,
}: DashboardResizeHandleProps) {
  const group = useContext(DashboardContext);
  const position = useContext(DashboardRegionContext);
  if (group === null || position === null)
    return (
      <Issues
        issues={[
          {
            path: 'DashboardResizeHandle',
            message: DASHBOARD_DEFAULTS.missingGroup,
          },
        ]}
      />
    );
  const { index, region } = position;
  const current = group.value[index];
  const next = group.regions[index + 1];
  const bounds = pairBounds(group.regions, group.value, index);
  if (!current || !next || !bounds || group.narrow || !group.open) return null;
  const inert = Boolean(disabled || group.disabled);
  return (
    <div
      role="separator"
      className="reacd-splitter-handle"
      aria-label={label ?? group.resizeLabel ?? region.label}
      aria-controls={`${group.prefix}-${region.id} ${group.prefix}-${next.id}`}
      aria-orientation="vertical"
      aria-valuemin={bounds.min}
      aria-valuemax={bounds.max}
      aria-valuenow={current.share}
      aria-disabled={inert}
      tabIndex={inert ? -1 : 0}
      onKeyDown={(event) => {
        if (inert) return;
        const result = splitterKey({
          key: event.key,
          shift: event.shiftKey,
          index,
          panels: group.regions,
          value: group.value,
          orientation: 'horizontal',
          direction: group.direction,
          expanded: group.expanded.current,
        });
        if (result) {
          event.preventDefault();
          group.onValueChange(result);
        }
      }}
      onPointerDown={(event) => {
        if (!inert) group.drag.start(event, index);
      }}
      onPointerMove={group.drag.move}
      onPointerUp={group.drag.finish}
      onPointerCancel={group.drag.cancel}
      onLostPointerCapture={group.drag.cancel}
      onBlur={group.drag.cancel}
    />
  );
}
