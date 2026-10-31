import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/navigation/navigation.adapter.js';
import { SharedNavigation } from '../../shared/navigation/navigation.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnNavigationProps = ComponentProps<typeof SharedNavigation>;
export const ShadcnNavigation: ComponentType<ShadcnNavigationProps> = bindPrimitives(
  SharedNavigation,
  shadcnPrimitives,
  'ShadcnNavigation',
);
