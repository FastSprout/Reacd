import { z } from 'zod';
import { childrenSchema } from '../../schema/shared/children.js';
import { labelSchema } from '../../schema/shared/values.js';
import { templateSchema } from '../../schema/design/templates.schema.js';
import { isThemeAdapter } from '../../renderer/contracts/validate-adapter.js';
import type { ThemeAdapter } from '../../renderer/contracts/theme-adapter.js';
import { isReacdStore } from '../store.js';
import type { ReacdStore } from '../store.js';

export const providerSchema = z.strictObject({
  children: childrenSchema,
  templateId: labelSchema.optional(),
  templates: z.record(z.string(), templateSchema).optional(),
  adapter: z.custom<ThemeAdapter>(isThemeAdapter, 'Invalid theme adapter.').optional(),
  store: z.custom<ReacdStore>(isReacdStore, 'Invalid Jotai store.').optional(),
});
