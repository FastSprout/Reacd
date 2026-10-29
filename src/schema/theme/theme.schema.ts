import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { templateSchema } from '../design/templates.schema.js';
import { buttonComponentSchema } from '../button/button.schema.js';
import { textComponentSchema } from '../text/text.schema.js';
import { vStackSchema } from '../v-stack/v-stack.schema.js';
import { gridSchema } from '../grid/grid.schema.js';
import { separatorSchema } from '../separator/separator.schema.js';

export const themeDefaultsSchema = z.strictObject({
  Button: buttonComponentSchema.pick({ intent: true }).optional(),
  Text: textComponentSchema
    .pick({ role: true, weight: true, lineLimit: true })
    .optional(),
  VStack: vStackSchema.pick({ spacing: true }).optional(),
  HStack: vStackSchema.pick({ spacing: true }).optional(),
  Card: vStackSchema.pick({ spacing: true }).optional(),
  Grid: gridSchema.pick({ spacing: true }).optional(),
  Separator: separatorSchema.omit({ children: true, label: true }).optional(),
});

export const themeSchema = z.strictObject({
  children: childrenSchema,
  template: templateSchema.optional(),
  defaults: themeDefaultsSchema.optional(),
});
