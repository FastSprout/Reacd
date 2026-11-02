import { z } from 'zod';
import type { ProseBlock } from '../../core/prose.js';
import { PROSE_POLICY } from '../../core/prose-policy.js';
import { proseInlineNodesSchema } from './inline.schema.js';
import {
  proseColorSchema,
  proseIdSchema,
  proseImageSchema,
  proseTextSchema,
} from './values.js';

const tokensSchema = z
  .array(
    z
      .array(
        z.strictObject({
          text: proseTextSchema,
          light: proseColorSchema,
          dark: proseColorSchema,
        }),
      )
      .readonly(),
  )
  .max(PROSE_POLICY.maxCodeLines)
  .readonly();
const codeSchema = z
  .strictObject({
    type: z.literal('code'),
    language: z
      .string()
      .max(PROSE_POLICY.maxLanguageLength)
      .regex(/^[\w+-]*$/),
    content: proseTextSchema,
    tokens: tokensSchema.optional(),
  })
  .refine(
    (value) =>
      value.tokens === undefined ||
      value.tokens
        .map((line) => line.map((token) => token.text).join(''))
        .join('\n') === value.content,
    PROSE_POLICY.tokenMessage,
  )
  .transform(({ tokens, ...value }) =>
    tokens === undefined ? value : { ...value, tokens },
  );
const tableSchema = z
  .strictObject({
    type: z.literal('table'),
    header: z
      .array(proseInlineNodesSchema)
      .min(1)
      .max(PROSE_POLICY.maxTableColumns)
      .readonly(),
    rows: z
      .array(
        z.array(proseInlineNodesSchema).max(PROSE_POLICY.maxTableColumns).readonly(),
      )
      .max(PROSE_POLICY.maxTableRows)
      .readonly(),
  })
  .refine(
    (value) => value.rows.every((row) => row.length === value.header.length),
    PROSE_POLICY.tableMessage,
  );

export const proseBlockSchema: z.ZodType<ProseBlock> = z.lazy(() =>
  z.union([
    z.strictObject({
      type: z.literal('heading'),
      level: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
      ]),
      id: proseIdSchema,
      children: proseInlineNodesSchema,
    }),
    z.strictObject({ type: z.literal('paragraph'), children: proseInlineNodesSchema }),
    z
      .strictObject({
        type: z.literal('list'),
        ordered: z.boolean(),
        start: z.number().int().min(0).max(PROSE_POLICY.maximumListStart).optional(),
        items: z
          .array(
            z
              .strictObject({
                children: proseBlocksSchema,
                checked: z.boolean().optional(),
              })
              .transform(({ checked, ...value }) =>
                checked === undefined ? value : { ...value, checked },
              ),
          )
          .max(PROSE_POLICY.maxListItems)
          .readonly(),
      })
      .transform(({ start, ...value }) =>
        start === undefined ? value : { ...value, start },
      ),
    codeSchema,
    tableSchema,
    z.strictObject({ type: z.literal('quote'), children: proseBlocksSchema }),
    z.strictObject({ type: z.literal('thematicBreak') }),
    z
      .strictObject({
        type: z.literal('image'),
        src: proseImageSchema,
        alt: proseTextSchema,
        title: proseTextSchema.optional(),
      })
      .transform(({ title, ...value }) =>
        title === undefined ? value : { ...value, title },
      ),
  ]),
);
export const proseBlocksSchema = z
  .array(proseBlockSchema)
  .max(PROSE_POLICY.maxBlocks)
  .readonly();
