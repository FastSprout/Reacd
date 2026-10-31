import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/footer-columns/footer-columns.adapter.js';
import { SharedFooterColumns } from
  '../../shared/footer-columns/footer-columns.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnFooterColumnsProps = ComponentProps<typeof SharedFooterColumns>;
export const ShadcnFooterColumns: ComponentType<ShadcnFooterColumnsProps> =
  bindPrimitives(SharedFooterColumns, shadcnPrimitives, 'ShadcnFooterColumns');
