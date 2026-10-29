import { uploadFileSchema } from './upload-file.schema.js';
import { inspectFileList } from './preflight.js';
import { FILE_UPLOAD_ERRORS } from '../../core/file-upload-policy.js';
export function readUploadBytes(input: unknown): Uint8Array {
  const inspected = inspectFileList([input]);
  if (!inspected.success) throw new Error(FILE_UPLOAD_ERRORS.metadata);
  const file = uploadFileSchema.parse(inspected.data.at(0));
  const binary = atob(file.content.data);
  const bytes = new Uint8Array(file.size);
  for (let index = 0; index < bytes.length; index += 1)
    bytes[index] = binary.charCodeAt(index);
  return bytes;
}
