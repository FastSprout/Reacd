import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/locale-select/locale-select.adapter.js';
import { SharedLocaleSelect } from
  '../../shared/locale-select/locale-select.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnLocaleSelectProps = ComponentProps<typeof SharedLocaleSelect>;
export const ShadcnLocaleSelect: ComponentType<ShadcnLocaleSelectProps> =
  bindPrimitives(SharedLocaleSelect, shadcnPrimitives, 'ShadcnLocaleSelect');
