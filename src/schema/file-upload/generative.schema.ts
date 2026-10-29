import { z } from 'zod';
import { stateBindingSchema } from '../state/binding.schema.js';
import { fileUploadPropertiesSchema } from './file-upload.schema.js';
import { FILE_UPLOAD_POLICY } from '../../core/file-upload-policy.js';
export const fileUploadNodeSchema = fileUploadPropertiesSchema
  .extend({
    type: z.literal('FileUpload'),
    value: stateBindingSchema,
  })
  .refine(
    (props) =>
      props.multiple !== false ||
      props.maxFiles === undefined ||
      props.maxFiles === FILE_UPLOAD_POLICY.singleFileCount,
    'Single-file mode permits a maximum of one file.',
  );
