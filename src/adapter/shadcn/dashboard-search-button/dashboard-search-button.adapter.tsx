import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dashboard-search-button/dashboard-search-button.adapter.js';
import { SharedDashboardSearchButton } from
  '../../shared/dashboard-search-button/dashboard-search-button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardSearchButtonProps = ComponentProps<
  typeof SharedDashboardSearchButton
>;
export const ShadcnDashboardSearchButton:
  ComponentType<ShadcnDashboardSearchButtonProps> =
  bindPrimitives(
    SharedDashboardSearchButton,
    shadcnPrimitives,
    'ShadcnDashboardSearchButton',
  );
