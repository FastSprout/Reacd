import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dashboard-panel/dashboard-panel.adapter.js';
import { SharedDashboardPanel } from
  '../../shared/dashboard-panel/dashboard-panel.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardPanelProps = ComponentProps<typeof SharedDashboardPanel>;
export const ShadcnDashboardPanel: ComponentType<ShadcnDashboardPanelProps> =
  bindPrimitives(SharedDashboardPanel, shadcnPrimitives, 'ShadcnDashboardPanel');
