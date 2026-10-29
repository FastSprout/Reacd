import { z } from 'zod';
import {
  FILE_UPLOAD_POLICY as P,
  FILE_UPLOAD_ERRORS,
} from '../../core/file-upload-policy.js';
import { isCanonicalBase64 } from '../../core/file-base64.js';
import { stateKeySchema } from '../state/shared/definition.js';
function noWhitespace(value: string): boolean {
  return !/\s/u.test(value);
}
const filename = z
  .string()
  .min(1)
  .max(P.maxFilenameLength)
  .regex(/^[^\p{Cc}\u2028\u2029/\\]+(?![\s\S])/u)
  .refine((name) => name !== '.' && name !== '..', 'File name cannot be a path.');
export const uploadMetadataSchema = z.strictObject({
  id: stateKeySchema.refine(noWhitespace, 'File identifiers cannot use whitespace.'),
  name: filename,
  mediaType: z
    .string()
    .min(1)
    .max(P.maxMediaTypeLength)
    .regex(/^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/)
    .refine(noWhitespace, 'MIME types cannot use whitespace.'),
  size: z.number().int().min(0).max(P.maxFileBytes),
  lastModified: z.number().int().min(-P.maximumTimestamp).max(P.maximumTimestamp),
});
export const uploadFileSchema = uploadMetadataSchema
  .extend({
    content: z
      .strictObject({
        encoding: z.literal('base64'),
        data: z.string().max(P.maxEncodedCharacters),
      })
      .readonly(),
  })
  .refine(
    (file) => isCanonicalBase64(file.content.data, file.size),
    FILE_UPLOAD_ERRORS.canonical,
  )
  .readonly();
export type UploadFile = z.infer<typeof uploadFileSchema>;
