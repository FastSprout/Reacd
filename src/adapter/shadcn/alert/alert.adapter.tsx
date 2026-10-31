import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/alert/alert.adapter.js';
import { SharedAlert } from '../../shared/alert/alert.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnAlertProps = ComponentProps<typeof SharedAlert>;
export const ShadcnAlert: ComponentType<ShadcnAlertProps> = bindPrimitives(
  SharedAlert,
  shadcnPrimitives,
  'ShadcnAlert',
);
