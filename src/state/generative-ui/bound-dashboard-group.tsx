import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { DashboardGroup } from '../../components/dashboard-group/index.js';
import type { DashboardGroupProps } from '../../components/dashboard-group/index.js';
import type { DashboardGroupNode } from
  '../../schema/dashboard-group/generative.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { panelLayoutSchemaFor } from '../../schema/splitter/splitter.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const LAYOUT_TARGET = { kinds: ['panelLayout'], mode: 'readWrite' } as const;
const BOOLEAN_TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;

export function BoundDashboardGroup({
  node,
  regions,
  registry,
  children,
}: {
  node: DashboardGroupNode<GenerativeNode>;
  regions: DashboardGroupProps['regions'];
  registry: StateRegistry;
  children: ReactNode;
}) {
  const schema = useMemo(() => panelLayoutSchemaFor(node.regions), [node.regions]);
  const layout = useBoundValue(registry, node.value, LAYOUT_TARGET, schema);
  const open = useBoundValue(registry, node.open, BOOLEAN_TARGET, booleanValueSchema);
  const mobile = useBoundValue(
    registry,
    node.mobileOpen,
    BOOLEAN_TARGET,
    booleanValueSchema,
  );
  if (!layout.success) return <Issues issues={layout.issues} />;
  if (!open.success) return <Issues issues={open.issues} />;
  if (!mobile.success) return <Issues issues={mobile.issues} />;
  return (
    <DashboardGroup
      label={node.label}
      regions={regions}
      value={layout.data.value}
      onValueChange={layout.data.write}
      open={open.data.value}
      onOpenChange={open.data.write}
      mobileOpen={mobile.data.value}
      onMobileOpenChange={mobile.data.write}
      collapseMode={node.collapseMode}
      disabled={node.disabled}
      resizeLabel={node.resizeLabel}
    >
      {children}
    </DashboardGroup>
  );
}
