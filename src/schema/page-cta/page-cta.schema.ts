import { z } from 'zod';
import { PAGE_CTA_VARIANTS } from '../../core/page-navigation-policy.js';
import { pageHeroSchema } from '../page-hero/page-hero.schema.js';

export const pageCTASchema = z.strictObject({
  ...pageHeroSchema.shape,
  variant: z.enum(PAGE_CTA_VARIANTS).optional(),
});
