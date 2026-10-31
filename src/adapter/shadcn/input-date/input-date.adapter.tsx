import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/input-date/input-date.adapter.js';
import { SharedInputDate } from '../../shared/input-date/input-date.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnInputDateProps = ComponentProps<typeof SharedInputDate>;
export const ShadcnInputDate: ComponentType<ShadcnInputDateProps> = bindPrimitives(
  SharedInputDate,
  shadcnPrimitives,
  'ShadcnInputDate',
);
