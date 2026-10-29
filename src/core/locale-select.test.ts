import { expect, it } from 'vitest';
import { isCanonicalLocale } from './locale-select.js';

it('uses canonical BCP 47 identity rather than case aliases or invalid tags', () => {
  for (const code of ['en-US', 'pl-PL', 'ar', 'zh-Hant'])
    expect(isCanonicalLocale(code)).toBe(true);
  for (const code of ['EN-us', 'en_US', 'en-US\n', '', '<script>'])
    expect(isCanonicalLocale(code)).toBe(false);
});
