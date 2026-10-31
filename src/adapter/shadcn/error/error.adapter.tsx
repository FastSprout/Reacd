import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/error/error.adapter.js';
import { SharedError } from '../../shared/error/error.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnErrorProps = ComponentProps<typeof SharedError>;
export const ShadcnError: ComponentType<ShadcnErrorProps> = bindPrimitives(
  SharedError,
  shadcnPrimitives,
  'ShadcnError',
);
