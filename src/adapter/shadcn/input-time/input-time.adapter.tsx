import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/input-time/input-time.adapter.js';
import { SharedInputTime } from '../../shared/input-time/input-time.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnInputTimeProps = ComponentProps<typeof SharedInputTime>;
export const ShadcnInputTime: ComponentType<ShadcnInputTimeProps> = bindPrimitives(
  SharedInputTime,
  shadcnPrimitives,
  'ShadcnInputTime',
);
