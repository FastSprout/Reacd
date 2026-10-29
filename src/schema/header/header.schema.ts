import { z } from 'zod';
import { HEADER_MENU_MODES } from '../../core/shell-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, booleanChangeSchema } from '../shared/values.js';
import { linkSchema } from '../link/link.schema.js';
import { footerSchema } from '../footer/footer.schema.js';

export const headerMenuSchema = z.strictObject({
  content: childrenSchema,
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  mode: z.enum(HEADER_MENU_MODES).optional(),
  toggleLabel: labelSchema.optional(),
  closeLabel: labelSchema.optional(),
});

export const headerSchema = z.strictObject({
  ...footerSchema.shape,
  title: labelSchema,
  href: linkSchema.shape.href.optional(),
  menu: headerMenuSchema.optional(),
});
