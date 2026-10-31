import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/splitter/splitter.adapter.js';
import { SharedSplitter } from '../../shared/splitter/splitter.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSplitterProps = ComponentProps<typeof SharedSplitter>;
export const ShadcnSplitter: ComponentType<ShadcnSplitterProps> = bindPrimitives(
  SharedSplitter,
  shadcnPrimitives,
  'ShadcnSplitter',
);
