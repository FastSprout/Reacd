import type { ComponentProps, ComponentType } from 'react';
import { SharedTable } from '../../shared/table/table.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiTableProps = ComponentProps<typeof SharedTable>;
export const MuiTable: ComponentType<MuiTableProps> = bindPrimitives(
  SharedTable,
  muiPrimitives,
  'MuiTable',
);
