import type { ComponentProps, ComponentType } from 'react';
import { SharedDataTable } from '../../shared/data-table/data-table.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDataTableProps = ComponentProps<typeof SharedDataTable>;
export const MuiDataTable: ComponentType<MuiDataTableProps> = bindPrimitives(
  SharedDataTable,
  muiPrimitives,
  'MuiDataTable',
);
