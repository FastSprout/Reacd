import { z } from 'zod';
import { EDITOR_MARKS, EDITOR_POLICY } from '../../../core/editor-policy.js';
import { linkSchema } from '../../link/link.schema.js';
import { stateKeySchema } from '../../state/shared/definition.js';
import { labelSchema } from '../../shared/values.js';

export const editorInlineSchema = z
  .discriminatedUnion('type', [
    z
      .strictObject({
        type: z.literal('text'),
        text: z.string().min(1).max(EDITOR_POLICY.maxTextLength),
        marks: z
          .array(z.enum(EDITOR_MARKS))
          .max(EDITOR_POLICY.maxMarks)
          .refine(
            (marks) => new Set(marks).size === marks.length,
            'Editor text marks must be unique.',
          )
          .transform((marks) => EDITOR_MARKS.filter((mark) => marks.includes(mark)))
          .pipe(z.array(z.enum(EDITOR_MARKS)).max(EDITOR_POLICY.maxMarks))
          .readonly()
          .optional(),
        link: linkSchema.shape.href.optional(),
      })
      .refine(
        (text) =>
          !text.marks?.includes('code') ||
          (text.marks.length === 1 && text.link === undefined),
        'Inline code cannot carry other marks or a link.',
      ),
    z.strictObject({
      type: z.literal('mention'),
      id: stateKeySchema,
      label: labelSchema,
    }),
    z.strictObject({
      type: z.literal('emoji'),
      name: stateKeySchema,
      value: z.string().min(1).max(EDITOR_POLICY.maxEmojiLength),
    }),
    z.strictObject({ type: z.literal('hardBreak') }),
  ])
  .readonly();
