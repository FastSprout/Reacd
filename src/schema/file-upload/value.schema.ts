import { z } from 'zod';
import { FILE_UPLOAD_POLICY } from '../../core/file-upload-policy.js';
import { inspectFileList } from './preflight.js';
import { uploadFileSchema } from './upload-file.schema.js';
export const fileListValueSchema = z
  .unknown()
  .transform((input, context): unknown => {
    const checked = inspectFileList(input);
    if (!checked.success) {
      for (const issue of checked.issues)
        context.addIssue({
          code: 'custom',
          message: issue.message,
          path: [issue.path],
        });
      return z.NEVER;
    }
    return checked.data;
  })
  .pipe(
    z
      .array(uploadFileSchema)
      .max(FILE_UPLOAD_POLICY.maxFiles)
      .refine(
        (files) => new Set(files.map((file) => file.id)).size === files.length,
        'File identifiers must be unique.',
      )
      .readonly(),
  );
