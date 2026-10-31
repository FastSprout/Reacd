import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/pagination/pagination.adapter.js';
import { SharedPagination } from '../../shared/pagination/pagination.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPaginationProps = ComponentProps<typeof SharedPagination>;
export const ShadcnPagination: ComponentType<ShadcnPaginationProps> = bindPrimitives(
  SharedPagination,
  shadcnPrimitives,
  'ShadcnPagination',
);
