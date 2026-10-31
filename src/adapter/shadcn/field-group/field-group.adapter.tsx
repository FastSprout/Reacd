import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/field-group/field-group.adapter.js';
import { SharedFieldGroup } from '../../shared/field-group/field-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnFieldGroupProps = ComponentProps<typeof SharedFieldGroup>;
export const ShadcnFieldGroup: ComponentType<ShadcnFieldGroupProps> = bindPrimitives(
  SharedFieldGroup,
  shadcnPrimitives,
  'ShadcnFieldGroup',
);
