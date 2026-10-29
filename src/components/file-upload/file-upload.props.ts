import type { z } from 'zod';
import type { fileUploadSchema } from '../../schema/file-upload/file-upload.schema.js';
export type FileUploadProps = z.infer<typeof fileUploadSchema>;
