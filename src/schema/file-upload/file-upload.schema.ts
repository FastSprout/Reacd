import { z } from 'zod';
import {
  FILE_ACCEPT_GROUPS,
  FILE_UPLOAD_DEFAULTS as D,
  FILE_UPLOAD_POLICY as P,
} from '../../core/file-upload-policy.js';
import { acceptsUpload } from '../../core/file-upload-accept.js';
import type { FileAcceptGroup } from '../../core/file-upload-accept.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { fileListValueSchema } from './value.schema.js';
import type { UploadFile } from './upload-file.schema.js';
export interface FileUploadSettings {
  readonly multiple?: boolean | undefined;
  readonly maxFiles?: number | undefined;
  readonly accept?: FileAcceptGroup | undefined;
}
export function fileUploadLimit(settings: FileUploadSettings): number {
  return settings.multiple === false
    ? P.singleFileCount
    : (settings.maxFiles ?? P.maxFiles);
}
export function fileUploadValueSchema(settings: FileUploadSettings) {
  return fileListValueSchema.refine(
    (files) =>
      files.length <= fileUploadLimit(settings) &&
      files.every((file) => acceptsUpload(settings.accept ?? D.accept, file.mediaType)),
    'File payload does not satisfy the accepted type or cardinality.',
  );
}
export const fileUploadPropertiesSchema = z.strictObject({
  label: labelSchema,
  description: textSchema.optional(),
  name: stateKeySchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  multiple: z.boolean().optional(),
  maxFiles: z.number().int().min(P.singleFileCount).max(P.maxFiles).optional(),
  accept: z.enum(FILE_ACCEPT_GROUPS).optional(),
});
export const fileUploadSchema = fileUploadPropertiesSchema
  .extend({
    value: fileListValueSchema,
    onValueChange: z.custom<(files: readonly UploadFile[]) => void>(
      (value) => typeof value === 'function',
      'File changes require a callback.',
    ),
  })
  .refine(
    (props) =>
      props.multiple !== false ||
      props.maxFiles === undefined ||
      props.maxFiles === P.singleFileCount,
    'Single-file mode permits a maximum of one file.',
  )
  .refine(
    (props) => fileUploadValueSchema(props).safeParse(props.value).success,
    'Files must satisfy the configured cardinality and accepted type.',
  );
