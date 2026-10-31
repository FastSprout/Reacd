import type { ComponentProps, ComponentType } from 'react';
import { SharedPagination } from '../../shared/pagination/pagination.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPaginationProps = ComponentProps<typeof SharedPagination>;
export const MuiPagination: ComponentType<MuiPaginationProps> = bindPrimitives(
  SharedPagination,
  muiPrimitives,
  'MuiPagination',
);
