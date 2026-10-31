import type { ComponentProps, ComponentType } from 'react';
import { SharedContentNavigation } from
  '../../shared/content-navigation/content-navigation.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiContentNavigationProps = ComponentProps<typeof SharedContentNavigation>;
export const MuiContentNavigation: ComponentType<MuiContentNavigationProps> =
  bindPrimitives(SharedContentNavigation, muiPrimitives, 'MuiContentNavigation');
