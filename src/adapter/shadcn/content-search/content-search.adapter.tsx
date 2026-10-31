import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/content-search/content-search.adapter.js';
import { SharedContentSearch } from
  '../../shared/content-search/content-search.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnContentSearchProps = ComponentProps<typeof SharedContentSearch>;
export const ShadcnContentSearch: ComponentType<ShadcnContentSearchProps> =
  bindPrimitives(SharedContentSearch, shadcnPrimitives, 'ShadcnContentSearch');
