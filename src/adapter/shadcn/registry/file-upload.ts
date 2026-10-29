import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { fileUploadSchema } from '../../../schema/file-upload/file-upload.schema.js';
import { ShadcnFileUpload } from '../file-upload/file-upload.adapter.js';
export const fileUploadEntries = {
  FileUpload: renderEntry('FileUpload', fileUploadSchema, ShadcnFileUpload),
};
