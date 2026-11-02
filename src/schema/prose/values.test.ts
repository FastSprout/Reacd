import { expect, it } from 'vitest';
import { proseColorSchema, safeProseUrl } from './values.js';
it('accepts safe local, relative, fragment and public network destinations', () => {
  for (const href of [
    '/guide/',
    '../guide/',
    '#heading',
    'https://example.com/',
    'http://example.com/',
    'mailto:owner@example.com',
  ]) {
    expect(safeProseUrl(href, false)).toBe(true);
  }
  expect(safeProseUrl('/image.svg', true)).toBe(true);
  expect(safeProseUrl('https://example.com/image.svg', true)).toBe(true);
});
it('rejects executable, protocol-relative, malformed and control-bearing URLs', () => {
  for (const href of [
    'javascript:alert(1)',
    'data:text/html,unsafe',
    '//example.com/',
    '/with space',
    '/back\\slash',
    '/control\u0000',
    'https://',
  ]) {
    expect(safeProseUrl(href, false)).toBe(false);
  }
  expect(safeProseUrl('mailto:owner@example.com', true)).toBe(false);
});
it('accepts only safe hexadecimal syntax color values', () => {
  for (const value of ['#abc', '#abcd', '#123456', '#12345678']) {
    expect(proseColorSchema.safeParse(value).success).toBe(true);
  }
  expect(proseColorSchema.safeParse('red;display:none').success).toBe(false);
});
