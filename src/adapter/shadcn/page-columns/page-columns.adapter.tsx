import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-columns/page-columns.adapter.js';
import { SharedPageColumns } from '../../shared/page-columns/page-columns.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageColumnsProps = ComponentProps<typeof SharedPageColumns>;
export const ShadcnPageColumns: ComponentType<ShadcnPageColumnsProps> = bindPrimitives(
  SharedPageColumns,
  shadcnPrimitives,
  'ShadcnPageColumns',
);
