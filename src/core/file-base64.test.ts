import { expect, it } from 'vitest';
import * as fc from 'fast-check';
import { FILE_UPLOAD_POLICY } from './file-upload-policy.js';
import { encodedBase64Length, isCanonicalBase64 } from './file-base64.js';
it('validates canonical binary encodings with every alphabet range', () => {
  for (const [value, bytes] of [
    ['', 0],
    ['AA==', 1],
    ['AAA=', 2],
    ['AAAA', 3],
    ['AZaz09+/', 6],
  ] as const)
    expect(isCanonicalBase64(value, bytes)).toBe(true);
  expect(encodedBase64Length(FILE_UPLOAD_POLICY.maxFileBytes)).toBe(
    FILE_UPLOAD_POLICY.maxEncodedCharacters,
  );
  fc.assert(
    fc.property(fc.uint8Array({ maxLength: 128 }), (bytes) => {
      expect(
        isCanonicalBase64(Buffer.from(bytes).toString('base64'), bytes.length),
      ).toBe(true);
    }),
  );
});
it('rejects padding, unused bits and invalid lengths before decoding', () => {
  for (const [value, bytes] of [
    ['Zh==', 1],
    ['Zm9=', 2],
    ['AA=A', 1],
    ['AA=+', 1],
    ['A=AA', 1],
    ['AA-A', 3],
    ['AA_A', 3],
    ['AA A', 3],
    ['AAĄA', 3],
    ['AA\nA', 3],
    ['AA==', 0],
    ['AA', 1],
    ['AA==', 2],
    ['AA==', 3],
    ['====', 1],
    ['', -1],
    ['', 1.5],
    ['', NaN],
    ['', Infinity],
    ['', FILE_UPLOAD_POLICY.maxFileBytes + 1],
  ] as const)
    expect(isCanonicalBase64(value, bytes)).toBe(false);
});
