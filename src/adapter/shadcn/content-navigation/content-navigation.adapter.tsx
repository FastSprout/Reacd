import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/content-navigation/content-navigation.adapter.js';
import { SharedContentNavigation } from
  '../../shared/content-navigation/content-navigation.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnContentNavigationProps = ComponentProps<
  typeof SharedContentNavigation
>;
export const ShadcnContentNavigation: ComponentType<ShadcnContentNavigationProps> =
  bindPrimitives(SharedContentNavigation, shadcnPrimitives, 'ShadcnContentNavigation');
