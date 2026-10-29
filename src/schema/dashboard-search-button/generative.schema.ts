import { z } from 'zod';
import { dashboardSearchButtonSchema } from './dashboard-search-button.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';

const { onPress: _press, ...shape } = dashboardSearchButtonSchema.shape;
export const dashboardSearchButtonNodeSchema = z.strictObject({
  ...shape,
  type: z.literal('DashboardSearchButton'),
  action: stateKeySchema,
});
