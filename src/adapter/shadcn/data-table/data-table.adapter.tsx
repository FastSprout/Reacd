import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/data-table/data-table.adapter.js';
import { SharedDataTable } from '../../shared/data-table/data-table.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDataTableProps = ComponentProps<typeof SharedDataTable>;
export const ShadcnDataTable: ComponentType<ShadcnDataTableProps> = bindPrimitives(
  SharedDataTable,
  shadcnPrimitives,
  'ShadcnDataTable',
);
