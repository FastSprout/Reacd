import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/checkbox-group/checkbox-group.adapter.js';
import { SharedCheckboxGroup } from
  '../../shared/checkbox-group/checkbox-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnCheckboxGroupProps = ComponentProps<typeof SharedCheckboxGroup>;
export const ShadcnCheckboxGroup: ComponentType<ShadcnCheckboxGroupProps> =
  bindPrimitives(SharedCheckboxGroup, shadcnPrimitives, 'ShadcnCheckboxGroup');
