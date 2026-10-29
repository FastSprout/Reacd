import { z } from 'zod';
import { CHART_KINDS, CHART_POLICY } from '../../core/chart-policy.js';
import { DATA_STATES } from '../../core/policy.js';
import { labelSchema, textSchema, pressSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
const numeric = z
  .number()
  .finite()
  .min(-CHART_POLICY.maximumMagnitude)
  .max(CHART_POLICY.maximumMagnitude);
export const chartContentSchema = z.strictObject({
  label: labelSchema,
  description: labelSchema,
  kind: z.enum(CHART_KINDS).optional(),
  categories: z
    .array(z.strictObject({ id: stateKeySchema, label: labelSchema }))
    .max(CHART_POLICY.maxCategories)
    .readonly(),
  series: z
    .array(
      z.strictObject({
        id: stateKeySchema,
        label: labelSchema,
        values: z.array(numeric.nullable()).max(CHART_POLICY.maxCategories).readonly(),
      }),
    )
    .max(CHART_POLICY.maxSeries)
    .readonly(),
  state: z.enum(DATA_STATES).optional(),
  emptyMessage: textSchema.optional(),
  loadingMessage: textSchema.optional(),
  errorMessage: textSchema.optional(),
  retryLabel: labelSchema.optional(),
});
export function validChartData(data: z.infer<typeof chartContentSchema>): boolean {
  return (
    new Set(data.categories.map((item) => item.id)).size === data.categories.length &&
    new Set(data.series.map((item) => item.id)).size === data.series.length &&
    data.series.every((series) => series.values.length === data.categories.length) &&
    (data.kind !== 'donut' ||
      (data.series.length <= CHART_POLICY.unitDomain &&
        data.series.every((series) =>
          series.values.every((value) => value === null || value >= CHART_POLICY.zero),
        )))
  );
}
export const chartSchema = chartContentSchema
  .extend({
    onRetry: pressSchema.optional(),
  })
  .refine(validChartData, 'Chart values must match unique categories and chart kind.');
