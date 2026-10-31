import type { ComponentProps, ComponentType } from 'react';
import { SharedFormField } from '../../shared/form-field/form-field.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiFormFieldProps = ComponentProps<typeof SharedFormField>;
export const MuiFormField: ComponentType<MuiFormFieldProps> = bindPrimitives(
  SharedFormField,
  muiPrimitives,
  'MuiFormField',
);
