import { ControlSurface } from '../primitives/control-surface.js';
import { useContext } from 'react';
import type { ReactNode } from 'react';
import { Select } from '@base-ui/react/select';
import { useDirection } from '@radix-ui/react-direction';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { SELECT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/select-policy.js';

export function SharedBaseSelectContent({
  children,
  label,
  empty,
}: {
  readonly children: ReactNode;
  readonly label: string;
  readonly empty: boolean;
}) {
  const host = useContext(PortalHostContext);
  const variables = useContext(ThemeVariablesContext);
  const active = useContext(PortalActiveContext);
  const direction = useDirection();
  if (!active) return null;
  return (
    <Select.Portal container={host ?? undefined}>
      <Select.Positioner
        alignItemWithTrigger={false}
        align="start"
        dir={direction}
        sideOffset={SELECT_POLICY.popupSideOffsetPx}
        collisionPadding={SELECT_POLICY.popupCollisionPaddingPx}
        className="reacd-portal-root reacd-select-positioner"
        style={variables}
      >
        <Select.Popup render={<ControlSurface />} className="reacd-base-select-popup">
          {empty && <p role="status">{SELECT_POLICY.emptyMessage}</p>}
          <Select.List className="reacd-select-list" aria-label={label}>
            {children}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  );
}
