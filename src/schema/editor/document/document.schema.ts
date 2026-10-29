import { z } from 'zod';
import { boundedEditor } from '../../../core/editor-budget.js';
import { editorBlockIds } from '../../../core/editor-blocks.js';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { editorBlockSchema } from './block.schema.js';

export const editorDocumentSchema = z
  .unknown()
  .refine(boundedEditor, {
    message: 'Editor document is not bounded JSON or contains a cyclic/shared graph.',
    abort: true,
  })
  .transform((input, context): unknown => {
    try {
      return structuredClone(input);
    } catch {
      context.addIssue({
        code: 'custom',
        message: 'Editor data must be cloneable JSON.',
      });
      return z.NEVER;
    }
  })
  .pipe(
    z
      .strictObject({
        version: z.literal(EDITOR_POLICY.version),
        blocks: z
          .array(editorBlockSchema)
          .min(1)
          .max(EDITOR_POLICY.maxChildren)
          .readonly(),
      })
      .readonly(),
  )
  .refine((document) => {
    const ids = editorBlockIds(document);
    return new Set(ids).size === ids.length;
  }, 'Editor block and list-item identifiers must be globally unique.');
