import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/checkbox/checkbox.adapter.js';
import { SharedCheckbox } from '../../shared/checkbox/checkbox.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnCheckboxProps = ComponentProps<typeof SharedCheckbox>;
export const ShadcnCheckbox: ComponentType<ShadcnCheckboxProps> = bindPrimitives(
  SharedCheckbox,
  shadcnPrimitives,
  'ShadcnCheckbox',
);
