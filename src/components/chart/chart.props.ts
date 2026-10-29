import type { z } from 'zod';
import type { chartSchema } from '../../schema/chart/index.js';
export type ChartProps = z.infer<typeof chartSchema>;
export type ChartSeries = ChartProps['series'][number];
export type ChartCategory = ChartProps['categories'][number];
