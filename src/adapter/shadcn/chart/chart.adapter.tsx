import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chart/chart.adapter.js';
import { SharedChart } from '../../shared/chart/chart.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChartProps = ComponentProps<typeof SharedChart>;
export const ShadcnChart: ComponentType<ShadcnChartProps> = bindPrimitives(
  SharedChart,
  shadcnPrimitives,
  'ShadcnChart',
);
