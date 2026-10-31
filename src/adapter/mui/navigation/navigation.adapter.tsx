import type { ComponentProps, ComponentType } from 'react';
import { SharedNavigation } from '../../shared/navigation/navigation.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiNavigationProps = ComponentProps<typeof SharedNavigation>;
export const MuiNavigation: ComponentType<MuiNavigationProps> = bindPrimitives(
  SharedNavigation,
  muiPrimitives,
  'MuiNavigation',
);
