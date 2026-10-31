import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/separator/separator.adapter.js';
import { SharedSeparator } from '../../shared/separator/separator.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSeparatorProps = ComponentProps<typeof SharedSeparator>;
export const ShadcnSeparator: ComponentType<ShadcnSeparatorProps> = bindPrimitives(
  SharedSeparator,
  shadcnPrimitives,
  'ShadcnSeparator',
);
