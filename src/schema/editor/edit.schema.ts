import { z } from 'zod';
import { editorDocumentSchema } from './document/document.schema.js';
import {
  editorSelectionSchema,
  editorSelectionValueSchema,
} from './document/selection.schema.js';

export const editorEditSchema = z
  .strictObject({
    value: editorDocumentSchema,
    selection: editorSelectionValueSchema,
  })
  .refine(
    (edit) => editorSelectionSchema(edit.value).safeParse(edit.selection).success,
    'Editor selection must resolve to this document.',
  )
  .readonly();
