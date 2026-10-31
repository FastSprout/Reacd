import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/tabs/tabs.adapter.js';
import { SharedTabs } from '../../shared/tabs/tabs.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnTabsProps = ComponentProps<typeof SharedTabs>;
export const ShadcnTabs: ComponentType<ShadcnTabsProps> = bindPrimitives(
  SharedTabs,
  shadcnPrimitives,
  'ShadcnTabs',
);
