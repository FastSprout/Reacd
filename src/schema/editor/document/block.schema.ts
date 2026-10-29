import { z } from 'zod';
import type { EditorBlock, EditorListItem } from '../../../core/editor-document.js';
import {
  EDITOR_CODE_LANGUAGES,
  EDITOR_HEADING_LEVELS,
  EDITOR_POLICY,
} from '../../../core/editor-policy.js';
import { stateKeySchema } from '../../state/shared/definition.js';
import { editorInlineSchema } from './inline.schema.js';

const id = stateKeySchema;
const content = z.array(editorInlineSchema).max(EDITOR_POLICY.maxInlines).readonly();
export const editorListItemSchema: z.ZodType<EditorListItem> = z.lazy(() =>
  z
    .strictObject({
      type: z.literal('listItem'),
      id,
      children: z
        .array(editorBlockSchema)
        .min(1)
        .max(EDITOR_POLICY.maxChildren)
        .refine(
          (blocks) => blocks[0]?.type === 'paragraph',
          'An editor list item must begin with a paragraph.',
        )
        .readonly(),
    })
    .readonly(),
);
export const editorBlockSchema: z.ZodType<EditorBlock> = z.lazy(() => {
  const items = z
    .array(editorListItemSchema)
    .min(1)
    .max(EDITOR_POLICY.maxChildren)
    .readonly();
  return z
    .discriminatedUnion('type', [
      z.strictObject({ type: z.literal('paragraph'), id, content }),
      z.strictObject({
        type: z.literal('heading'),
        id,
        content,
        level: z.literal(EDITOR_HEADING_LEVELS),
      }),
      z.strictObject({
        type: z.literal('codeBlock'),
        id,
        text: z.string().max(EDITOR_POLICY.maxTextLength),
        language: z.enum(EDITOR_CODE_LANGUAGES).optional(),
      }),
      z.strictObject({
        type: z.literal('quote'),
        id,
        children: z
          .array(editorBlockSchema)
          .min(1)
          .max(EDITOR_POLICY.maxChildren)
          .readonly(),
      }),
      z.strictObject({ type: z.literal('bulletList'), id, items }),
      z.strictObject({
        type: z.literal('orderedList'),
        id,
        items,
        start: z.number().int().min(1).max(EDITOR_POLICY.maxOrderedStart),
      }),
      z.strictObject({ type: z.literal('separator'), id }),
    ])
    .readonly();
});
