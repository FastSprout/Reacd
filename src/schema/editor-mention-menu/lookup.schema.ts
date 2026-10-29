import { z } from 'zod';
import { EDITOR_LOOKUP_POLICY } from '../../core/editor-lookup-policy.js';
import { editorMentionItemsSchema } from './item.schema.js';

export const editorMentionLookupScopeSchema = z
  .string()
  .min(1)
  .max(EDITOR_LOOKUP_POLICY.maxScopeLength);
export const editorMentionLookupQuerySchema = z
  .string()
  .max(EDITOR_LOOKUP_POLICY.maxQueryLength);
const correlation = {
  key: z.string().min(1).max(EDITOR_LOOKUP_POLICY.maxKeyLength),
  query: editorMentionLookupQuerySchema,
};
export const editorMentionLookupRequestSchema = z.strictObject(correlation).readonly();
export const editorMentionLookupResultSchema = z.discriminatedUnion('status', [
  z.strictObject({ ...correlation, status: z.literal('loading') }).readonly(),
  z
    .strictObject({
      ...correlation,
      status: z.literal('ready'),
      items: editorMentionItemsSchema,
    })
    .readonly(),
  z
    .strictObject({
      ...correlation,
      status: z.literal('error'),
      error: z.string().trim().min(1).max(EDITOR_LOOKUP_POLICY.maxErrorLength),
    })
    .readonly(),
]);
export type EditorMentionLookupRequest = z.infer<
  typeof editorMentionLookupRequestSchema
>;
export type EditorMentionLookupResult = z.infer<typeof editorMentionLookupResultSchema>;
