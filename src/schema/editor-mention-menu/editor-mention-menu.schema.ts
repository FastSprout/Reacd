import { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { labelSchema } from '../shared/values.js';
import { editorMentionItemsSchema } from './item.schema.js';
import { editorMentionLookupResultSchema } from './lookup.schema.js';
import type { EditorMentionLookupRequest } from './lookup.schema.js';

export { editorMentionItemSchema } from './item.schema.js';
const options = { label: labelSchema, disabled: z.boolean().optional() };
export const editorMentionMenuLocalPropertiesSchema = z.strictObject({
  ...options, items: editorMentionItemsSchema,
});
const remote = z.strictObject({
  ...options,
  results: editorMentionLookupResultSchema.nullable(),
  onQueryChange: z.custom<(request: EditorMentionLookupRequest) => void>(
    (value) => typeof value === 'function', FRAMEWORK_ERRORS.invalidCallback),
});
export const editorMentionMenuSchema = z.union([
  editorMentionMenuLocalPropertiesSchema, remote,
]).readonly();
