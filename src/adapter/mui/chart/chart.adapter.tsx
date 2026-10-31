import type { ComponentProps, ComponentType } from 'react';
import { SharedChart } from '../../shared/chart/chart.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChartProps = ComponentProps<typeof SharedChart>;
export const MuiChart: ComponentType<MuiChartProps> = bindPrimitives(
  SharedChart,
  muiPrimitives,
  'MuiChart',
);
