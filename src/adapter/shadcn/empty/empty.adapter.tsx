import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/empty/empty.adapter.js';
import { SharedEmpty } from '../../shared/empty/empty.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnEmptyProps = ComponentProps<typeof SharedEmpty>;
export const ShadcnEmpty: ComponentType<ShadcnEmptyProps> = bindPrimitives(
  SharedEmpty,
  shadcnPrimitives,
  'ShadcnEmpty',
);
