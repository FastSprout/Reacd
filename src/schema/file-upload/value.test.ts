import { expect, it, vi } from 'vitest';
import { FILE_UPLOAD_POLICY as P } from '../../core/file-upload-policy.js';
import { fileListValueSchema } from './value.schema.js';
import { uploadFileSchema } from './upload-file.schema.js';
const FILE = {
  id: 'sample',
  name: 'sample.txt',
  mediaType: 'text/plain',
  size: 5,
  lastModified: 0,
  content: { encoding: 'base64', data: 'SGVsbG8=' },
};
it('returns immutable plain DTOs containing canonical actual content', () => {
  const result = fileListValueSchema.parse([FILE]);
  expect(result).toEqual([FILE]);
  expect(Object.isFrozen(result)).toBe(true);
  expect(Object.isFrozen(result[0])).toBe(true);
  expect(Object.isFrozen(result[0]?.content)).toBe(true);
  expect(Object.getPrototypeOf(result[0])).toBe(Object.prototype);
  expect(fileListValueSchema.safeParse([]).success).toBe(true);
  expect(
    fileListValueSchema.safeParse([
      { ...FILE, size: 0, content: { encoding: 'base64', data: '' } },
    ]).success,
  ).toBe(true);
});
it('rejects unknown shapes, unsafe metadata, duplicates and noncanonical bytes', () => {
  const invalid = [
    null,
    {},
    [null],
    [undefined],
    new Array(1),
    [new File(['Hello'], 'native.txt', { lastModified: 0 })],
    [FILE, FILE],
    [{ ...FILE, html: '<script>' }],
    [{ ...FILE, id: 'bad/id' }],
    [{ ...FILE, id: 1 }],
    [{ ...FILE, id: 'x'.repeat(P.maxIdLength + 1) }],
    [{ ...FILE, name: 1 }],
    [{ ...FILE, mediaType: 1 }],
    [{ ...FILE, mediaType: 'x'.repeat(P.maxMediaTypeLength + 1) }],
    [{ ...FILE, name: '.' }],
    [{ ...FILE, name: '..' }],
    [{ ...FILE, name: '../sample.txt' }],
    [{ ...FILE, name: 'bad\nname' }],
    [{ ...FILE, name: '' }],
    [{ ...FILE, mediaType: '' }],
    [{ ...FILE, mediaType: 'TEXT/PLAIN' }],
    [{ ...FILE, size: -1 }],
    [{ ...FILE, size: NaN }],
    [{ ...FILE, size: Infinity }],
    [{ ...FILE, size: 1.5 }],
    [{ ...FILE, lastModified: 'now' }],
    [{ ...FILE, lastModified: 1.5 }],
    [{ ...FILE, size: 1, content: { encoding: 'base64', data: 'Zh==' } }],
    [{ ...FILE, content: { encoding: 'utf8', data: 'Hello' } }],
    [{ ...FILE, content: { encoding: 'base64', data: 1 } }],
    [{ ...FILE, content: { encoding: 'base64', unknown: 'SGVsbG8=' } }],
    [{ ...FILE, content: { encoding: 'base64', data: 'SGVsbG8=', html: '' } }],
    [{ ...FILE, content: null }],
    [{ ...FILE, name: 'x'.repeat(P.maxFilenameLength + 1) }],
  ];
  for (const value of invalid)
    expect(fileListValueSchema.safeParse(value).success).toBe(false);
});
it('checks budgets before platform decoding, metadata getters or data copies', () => {
  const getter = vi.fn(() => {
    throw new Error('Metadata was evaluated.');
  });
  const hostile = Object.defineProperty({}, 'size', { get: getter });
  const decode = vi.spyOn(globalThis, 'atob');
  expect(
    fileListValueSchema.safeParse(Array.from({ length: P.maxFiles + 1 }, () => hostile))
      .success,
  ).toBe(false);
  expect(fileListValueSchema.safeParse([hostile]).success).toBe(false);
  expect(getter).not.toHaveBeenCalled();
  expect(
    fileListValueSchema.safeParse([{ ...FILE, size: P.maxFileBytes + 1 }]).success,
  ).toBe(false);
  expect(
    fileListValueSchema.safeParse([{ ...FILE, size: P.maxFileBytes }]).success,
  ).toBe(false);
  const large = 'A'.repeat(P.maxEncodedCharacters - 1) + '=';
  expect(
    fileListValueSchema.safeParse(
      Array.from({ length: 3 }, (_, index) => ({
        ...FILE,
        id: `sample${index}`,
        size: P.maxFileBytes,
        content: { encoding: 'base64', data: large },
      })),
    ).success,
  ).toBe(false);
  expect(decode).not.toHaveBeenCalled();
  decode.mockRestore();
});
it('rejects accessor arrays and broken object-inspection ports safely', () => {
  const getter = vi.fn(() => FILE);
  const array = Object.defineProperty([FILE], '0', { get: getter });
  expect(fileListValueSchema.safeParse(array).success).toBe(false);
  expect(getter).not.toHaveBeenCalled();
  const broken = new Proxy(
    {},
    {
      ownKeys: () => {
        throw new Error('Unavailable');
      },
    },
  );
  expect(fileListValueSchema.safeParse([broken]).success).toBe(false);
  const { id: _id, ...partial } = FILE;
  expect(
    fileListValueSchema.safeParse([{ ...partial, [Symbol('id')]: 'sample' }]).success,
  ).toBe(false);
  expect(
    fileListValueSchema.safeParse([{ ...partial, unknown: 'sample' }]).success,
  ).toBe(false);
});
it('rejects trailing line terminators in canonical metadata', () => {
  for (const ending of ['\n', '\r', '\u2028', '\u2029']) {
    for (const value of [
      { ...FILE, mediaType: `text/plain${ending}` },
      { ...FILE, name: `sample.txt${ending}` },
      { ...FILE, id: `sample${ending}` },
    ]) {
      expect(uploadFileSchema.safeParse(value).success).toBe(false);
      expect(fileListValueSchema.safeParse([value]).success).toBe(false);
    }
  }
});
it('rejects trailing MIME line terminators through the file-list boundary', () => {
  expect(
    fileListValueSchema.safeParse([{ ...FILE, mediaType: 'text/plain\n' }]).success,
  ).toBe(false);
});

it('keeps printable Unicode filenames and rejects control separators', () => {
  for (const name of ['résumé.txt', '報告書🌍.txt', 'a file with spaces.txt'])
    expect(uploadFileSchema.safeParse({ ...FILE, name }).success).toBe(true);
  const forbiddenCodepoints = [0, 31, 127, 159, 0x2028, 0x2029];
  for (const codepoint of forbiddenCodepoints) {
    const name = `before${String.fromCodePoint(codepoint)}after.txt`;
    expect(uploadFileSchema.safeParse({ ...FILE, name }).success).toBe(false);
  }
});
