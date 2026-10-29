import type { Result } from '../../core/result.js';
import { isRecord } from '../../core/value.js';
import {
  FILE_UPLOAD_POLICY as P,
  FILE_UPLOAD_ERRORS as E,
} from '../../core/file-upload-policy.js';
import { encodedBase64Length } from '../../core/file-base64.js';
import type { UploadFile } from './upload-file.schema.js';
const FILE_KEYS = ['id', 'name', 'mediaType', 'size', 'lastModified', 'content'];
const CONTENT_KEYS = ['encoding', 'data'];
function ownValue(value: object, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  const data: unknown = descriptor?.value;
  return data;
}
function hasKeys(value: unknown, allowed: readonly string[]): value is object {
  if (!isRecord(value)) return false;
  const keys = Reflect.ownKeys(value);
  return (
    keys.length === allowed.length &&
    keys.every((key) => typeof key === 'string' && allowed.includes(key))
  );
}
function metadata(input: unknown): UploadFile | undefined {
  if (!hasKeys(input, FILE_KEYS)) return undefined;
  const id = ownValue(input, 'id');
  const name = ownValue(input, 'name');
  const mediaType = ownValue(input, 'mediaType');
  const size = ownValue(input, 'size');
  const lastModified = ownValue(input, 'lastModified');
  const content = ownValue(input, 'content');
  if (
    typeof id !== 'string' ||
    id.length > P.maxIdLength ||
    typeof name !== 'string' ||
    name.length > P.maxFilenameLength ||
    typeof mediaType !== 'string' ||
    mediaType.length > P.maxMediaTypeLength ||
    typeof size !== 'number' ||
    !Number.isInteger(size) ||
    size < 0 ||
    size > P.maxFileBytes ||
    typeof lastModified !== 'number' ||
    !Number.isSafeInteger(lastModified) ||
    !hasKeys(content, CONTENT_KEYS)
  )
    return undefined;
  const encoding = ownValue(content, 'encoding');
  const data = ownValue(content, 'data');
  if (
    encoding !== 'base64' ||
    typeof data !== 'string' ||
    data.length !== encodedBase64Length(size)
  )
    return undefined;
  return { id, name, mediaType, size, lastModified, content: { encoding, data } };
}
function failure(message: string): Result<never> {
  return { success: false, issues: [{ path: 'files', message }] };
}
export function inspectFileList(input: unknown): Result<UploadFile[]> {
  try {
    if (!Array.isArray(input) || input.length > P.maxFiles) return failure(E.count);
    const files: UploadFile[] = [];
    let total = 0;
    for (let index = 0; index < input.length; index += 1) {
      const file = metadata(ownValue(input, String(index)));
      if (file === undefined) return failure(E.metadata);
      total += file.size;
      if (total > P.maxTotalBytes) return failure(E.total);
      files.push(file);
    }
    return { success: true, data: files };
  } catch {
    return failure(E.inspect);
  }
}
