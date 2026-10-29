import { z } from 'zod';
import type { EditorDocument } from '../../core/editor-document.js';
import type { EditorEdit } from '../../core/editor-edit.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';
import { editorDocumentSchema, editorSelectionSchema } from './document/index.js';
import { editorSelectionValueSchema } from './document/selection.schema.js';

export const editorOptionsSchema = z.strictObject({
  label: labelSchema,
  description: textSchema.optional(),
  placeholder: labelSchema.optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
});
const editorValueSchema = editorOptionsSchema.extend({
  value: editorDocumentSchema,
  toolbar: childrenSchema,
  children: childrenSchema,
});
const privateSelectionSchema = editorValueSchema.extend({
  onValueChange: z.custom<(document: EditorDocument) => void>(
    (value) => typeof value === 'function',
    FRAMEWORK_ERRORS.invalidCallback,
  ),
});
const controlledSelectionSchema = editorValueSchema
  .extend({
    selection: editorSelectionValueSchema,
    onEditChange: z.custom<(edit: EditorEdit) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
  })
  .refine(
    (properties) =>
      editorSelectionSchema(properties.value).safeParse(properties.selection).success,
    'Editor selection must resolve to this document.',
  );
export const editorSchema = z
  .union([privateSelectionSchema, controlledSelectionSchema])
  .readonly();
