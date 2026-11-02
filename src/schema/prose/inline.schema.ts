import { z } from 'zod';
import type { ProseInline } from '../../core/prose.js';
import { PROSE_POLICY } from '../../core/prose-policy.js';
import { proseTextSchema, proseUrlSchema } from './values.js';

export const proseInlineSchema: z.ZodType<ProseInline> = z.lazy(() =>
  z.union([
    z.strictObject({ type: z.enum(['text', 'code']), text: proseTextSchema }),
    z.strictObject({
      type: z.enum(['strong', 'emphasis', 'delete']),
      children: proseInlineNodesSchema,
    }),
    z.strictObject({
      type: z.literal('link'),
      href: proseUrlSchema,
      children: proseInlineNodesSchema,
    }),
    z.strictObject({ type: z.literal('break') }),
  ]),
);
export const proseInlineNodesSchema = z
  .array(proseInlineSchema)
  .max(PROSE_POLICY.maxInlineNodes)
  .readonly();
