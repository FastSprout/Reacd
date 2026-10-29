import { expect, it, vi } from 'vitest';
import { fileUploadSchema, fileUploadValueSchema } from './file-upload.schema.js';
import { readUploadBytes } from './read-bytes.js';
const FILE = {
  id: 'first',
  name: 'first.txt',
  mediaType: 'text/plain',
  size: 5,
  lastModified: 0,
  content: { encoding: 'base64', data: 'SGVsbG8=' },
};
it('restricts cardinality, closed properties, callbacks and accepted groups', () => {
  const props = { label: 'Files', value: [FILE], onValueChange: () => undefined };
  expect(fileUploadSchema.safeParse(props).success).toBe(true);
  for (const invalid of [
    { ...props, maxFiles: 0 },
    { ...props, maxFiles: 11 },
    { ...props, multiple: false, maxFiles: 2 },
    { ...props, multiple: false, value: [FILE, { ...FILE, id: 'second' }] },
    { ...props, accept: 'images' },
    { ...props, accept: 'script' },
    { ...props, onValueChange: 'save' },
    { ...props, style: {} },
  ])
    expect(fileUploadSchema.safeParse(invalid).success).toBe(false);
  expect(fileUploadValueSchema({ accept: 'text' }).safeParse([FILE]).success).toBe(
    true,
  );
  expect(fileUploadValueSchema({ accept: 'pdf' }).safeParse([FILE]).success).toBe(
    false,
  );
  expect(
    fileUploadValueSchema({ accept: 'images' }).safeParse([
      { ...FILE, mediaType: 'image/png' },
    ]).success,
  ).toBe(true);
  expect(
    fileUploadValueSchema({ accept: 'pdf' }).safeParse([
      { ...FILE, mediaType: 'application/pdf' },
    ]).success,
  ).toBe(true);
});
it('decodes validated real bytes without exposing native file objects', () => {
  expect(new TextDecoder().decode(readUploadBytes(FILE))).toBe('Hello');
  expect(
    readUploadBytes({ ...FILE, size: 0, content: { encoding: 'base64', data: '' } }),
  ).toEqual(new Uint8Array());
  expect(
    readUploadBytes({
      ...FILE,
      size: 3,
      content: { encoding: 'base64', data: 'AP+A' },
    }),
  ).toEqual(new Uint8Array([0, 255, 128]));
  expect(() => readUploadBytes({ ...FILE, size: 6 })).toThrow();
  expect(() =>
    readUploadBytes({
      ...FILE,
      size: 5,
      content: { encoding: 'base64', data: 'Zh======' },
    }),
  ).toThrow();
});
it('rejects hostile metadata before getter evaluation or decode', () => {
  const getter = vi.fn(() => {
    throw new Error('Unsafe metadata');
  });
  const input = Object.defineProperty({ ...FILE }, 'size', { get: getter });
  const decode = vi.spyOn(globalThis, 'atob');
  expect(() => readUploadBytes(input)).toThrow();
  expect(getter).not.toHaveBeenCalled();
  expect(decode).not.toHaveBeenCalled();
  decode.mockRestore();
});
