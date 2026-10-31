import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/form-field/form-field.adapter.js';
import { SharedFormField } from '../../shared/form-field/form-field.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnFormFieldProps = ComponentProps<typeof SharedFormField>;
export const ShadcnFormField: ComponentType<ShadcnFormFieldProps> = bindPrimitives(
  SharedFormField,
  shadcnPrimitives,
  'ShadcnFormField',
);
