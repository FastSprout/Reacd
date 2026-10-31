import { expect, it } from 'vitest';
import { inspectNativeFiles, sameUploadFiles } from './intake-validation.js';
import type { UploadFile } from '../../../schema/file-upload/upload-file.schema.js';
const FILE: UploadFile = {
  id: 'same',
  name: 'same.txt',
  mediaType: 'text/plain',
  size: 1,
  lastModified: 0,
  content: { encoding: 'base64', data: 'eA==' },
};
it('rejects sparse native batches before native reads', () => {
  expect(inspectNativeFiles(new Array<File>(1), { value: [] }).success).toBe(false);
});
it('compares semantic payload fields to detect stale reads', () => {
  expect(sameUploadFiles([FILE], [{ ...FILE }])).toBe(true);
  for (const next of [
    { ...FILE, id: 'other' },
    { ...FILE, name: 'other' },
    { ...FILE, mediaType: 'text/csv' },
    { ...FILE, size: 2 },
    { ...FILE, lastModified: 1 },
    { ...FILE, content: { encoding: 'base64' as const, data: 'eQ==' } },
  ])
    expect(sameUploadFiles([FILE], [next])).toBe(false);
  expect(sameUploadFiles([FILE], new Array<UploadFile>(1))).toBe(false);
});
