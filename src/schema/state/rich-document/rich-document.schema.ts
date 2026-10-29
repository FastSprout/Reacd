import { z } from 'zod';
import { editorDocumentSchema } from '../../editor/document/index.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const richDocumentStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('richDocument'),
    initial: editorDocumentSchema,
  })
  .readonly();
