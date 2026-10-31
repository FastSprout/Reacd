import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/auth-form/auth-form.adapter.js';
import { SharedAuthForm } from '../../shared/auth-form/auth-form.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnAuthFormProps = ComponentProps<typeof SharedAuthForm>;
export const ShadcnAuthForm: ComponentType<ShadcnAuthFormProps> = bindPrimitives(
  SharedAuthForm,
  shadcnPrimitives,
  'ShadcnAuthForm',
);
