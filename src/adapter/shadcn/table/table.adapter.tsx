import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/table/table.adapter.js';
import { SharedTable } from '../../shared/table/table.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnTableProps = ComponentProps<typeof SharedTable>;
export const ShadcnTable: ComponentType<ShadcnTableProps> = bindPrimitives(
  SharedTable,
  shadcnPrimitives,
  'ShadcnTable',
);
