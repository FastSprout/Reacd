import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/toast/toast.adapter.js';
import { SharedToast } from '../../shared/toast/toast.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnToastProps = ComponentProps<typeof SharedToast>;
export const ShadcnToast: ComponentType<ShadcnToastProps> = bindPrimitives(
  SharedToast,
  shadcnPrimitives,
  'ShadcnToast',
);
