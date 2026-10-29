import { z } from 'zod';
import { fileListValueSchema } from '../../file-upload/index.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const fileListStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('fileList'),
    initial: fileListValueSchema,
  })
  .readonly();
