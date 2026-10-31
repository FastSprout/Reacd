import type { ComponentProps, ComponentType } from 'react';
import { SharedContentSearch } from
  '../../shared/content-search/content-search.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiContentSearchProps = ComponentProps<typeof SharedContentSearch>;
export const MuiContentSearch: ComponentType<MuiContentSearchProps> = bindPrimitives(
  SharedContentSearch,
  muiPrimitives,
  'MuiContentSearch',
);
