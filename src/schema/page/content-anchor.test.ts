import { expect, it } from 'vitest';
import { pageSchema } from './page.schema.js';
import { PROSE_POLICY } from '../../core/prose-policy.js';

it('accepts safe numeric and Unicode title anchors', () => {
  for (const anchor of ['2026-release', 'zażółć']) {
    expect(pageSchema.safeParse({ title: 'Release', anchor }).success).toBe(true);
  }
  for (const anchor of [
    '',
    'bad anchor',
    '#fragment',
    '/path',
    'a'.repeat(PROSE_POLICY.maxIdLength + 1),
  ]) {
    expect(pageSchema.safeParse({ title: 'Release', anchor }).success).toBe(false);
  }
});
