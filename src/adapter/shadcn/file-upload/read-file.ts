import { FILE_UPLOAD_ERRORS as E } from '../../../core/file-upload-policy.js';
export interface ReadTask {
  readonly promise: Promise<string>;
  readonly cancel: () => void;
}
export function readFile(file: File): ReadTask {
  const reader = new FileReader();
  const promise = new Promise<string>((resolve, reject) => {
    function fail(): void {
      reject(new Error(E.read));
    }
    reader.onerror = fail;
    reader.onabort = fail;
    reader.onload = () => {
      const result: unknown = reader.result;
      if (typeof result !== 'string') {
        fail();
        return;
      }
      const separator = result.indexOf(',');
      if (
        !result.startsWith('data:') ||
        separator < 0 ||
        !result.slice(0, separator).endsWith(';base64')
      ) {
        fail();
        return;
      }
      resolve(result.slice(separator + 1));
    };
    reader.readAsDataURL(file);
  }).finally(() => {
    reader.onload = null;
    reader.onerror = null;
    reader.onabort = null;
  });
  return { promise, cancel: () => reader.abort() };
}
