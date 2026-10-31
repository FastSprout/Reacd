import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/tree/tree.adapter.js';
import { SharedTree } from '../../shared/tree/tree.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnTreeProps = ComponentProps<typeof SharedTree>;
export const ShadcnTree: ComponentType<ShadcnTreeProps> = bindPrimitives(
  SharedTree,
  shadcnPrimitives,
  'ShadcnTree',
);
