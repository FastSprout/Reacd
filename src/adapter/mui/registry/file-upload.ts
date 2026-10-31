import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { fileUploadSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/file-upload/file-upload.schema.js';
import { MuiFileUpload } from '../file-upload/file-upload.adapter.js';
export const fileUploadEntries = {
  FileUpload: renderEntry('FileUpload', fileUploadSchema, MuiFileUpload),
};
