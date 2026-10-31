import type { Result } from '@fastsprout/reacd/adapter-runtime/core/result.js';
import {
  FILE_UPLOAD_DEFAULTS as D,
  FILE_UPLOAD_ERRORS as E,
  FILE_UPLOAD_POLICY as P,
} from '@fastsprout/reacd/adapter-runtime/core/file-upload-policy.js';
import { acceptsUpload } from
  '@fastsprout/reacd/adapter-runtime/core/file-upload-accept.js';
import { fileUploadLimit } from
  '@fastsprout/reacd/adapter-runtime/schema/file-upload/index.js';
import type { FileUploadSettings } from
  '@fastsprout/reacd/adapter-runtime/schema/file-upload/index.js';
import { uploadMetadataSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/file-upload/index.js';
import type { UploadFile } from
  '@fastsprout/reacd/adapter-runtime/schema/file-upload/index.js';
export interface IntakeSettings extends FileUploadSettings {
  readonly value: readonly UploadFile[];
}
export function inspectNativeFiles(
  input: ArrayLike<File>,
  settings: IntakeSettings,
): Result<readonly File[]> {
  function fail(message: string): Result<never> {
    return { success: false, issues: [{ path: 'files', message }] };
  }
  const existing = settings.multiple === false ? [] : settings.value;
  if (input.length + existing.length > fileUploadLimit(settings)) return fail(E.count);
  let total = existing.reduce((sum, file) => sum + file.size, 0);
  const files: File[] = [];
  for (let index = 0; index < input.length; index += 1) {
    const file = input[index];
    if (file === undefined) return fail(E.metadata);
    const metadata = uploadMetadataSchema.safeParse({
      id: P.idPrefix,
      name: file.name,
      mediaType: file.type || D.mediaType,
      size: file.size,
      lastModified: file.lastModified,
    });
    if (!metadata.success) return fail(E.metadata);
    if (!acceptsUpload(settings.accept ?? D.accept, metadata.data.mediaType))
      return fail(E.accept);
    total += file.size;
    if (total > P.maxTotalBytes) return fail(E.total);
    files.push(file);
  }
  return { success: true, data: files };
}
export function sameUploadFiles(
  left: readonly UploadFile[],
  right: readonly UploadFile[],
): boolean {
  return (
    left.length === right.length &&
    left.every((file, index) => {
      const other = right[index];
      return (
        other !== undefined &&
        file.id === other.id &&
        file.name === other.name &&
        file.mediaType === other.mediaType &&
        file.size === other.size &&
        file.lastModified === other.lastModified &&
        file.content.data === other.content.data
      );
    })
  );
}
