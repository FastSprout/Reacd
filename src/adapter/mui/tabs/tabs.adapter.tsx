import type { ComponentProps, ComponentType } from 'react';
import { SharedTabs } from '../../shared/tabs/tabs.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiTabsProps = ComponentProps<typeof SharedTabs>;
export const MuiTabs: ComponentType<MuiTabsProps> = bindPrimitives(
  SharedTabs,
  muiPrimitives,
  'MuiTabs',
);
