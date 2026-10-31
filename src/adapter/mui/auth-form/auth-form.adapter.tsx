import type { ComponentProps, ComponentType } from 'react';
import { SharedAuthForm } from '../../shared/auth-form/auth-form.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiAuthFormProps = ComponentProps<typeof SharedAuthForm>;
export const MuiAuthForm: ComponentType<MuiAuthFormProps> = bindPrimitives(
  SharedAuthForm,
  muiPrimitives,
  'MuiAuthForm',
);
