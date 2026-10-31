import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/collapsible/collapsible.adapter.js';
import { SharedCollapsible } from '../../shared/collapsible/collapsible.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnCollapsibleProps = ComponentProps<typeof SharedCollapsible>;
export const ShadcnCollapsible: ComponentType<ShadcnCollapsibleProps> = bindPrimitives(
  SharedCollapsible,
  shadcnPrimitives,
  'ShadcnCollapsible',
);
