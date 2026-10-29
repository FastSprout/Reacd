import { z } from 'zod';
import { PANEL_PLACEMENTS } from '../../core/panel-policy.js';
import { modalSchema } from '../modal/modal.schema.js';
export const slideoverSchema = z.strictObject({
  ...modalSchema.shape,
  placement: z.enum(PANEL_PLACEMENTS).optional(),
});
