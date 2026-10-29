import { describe, expect, it } from 'vitest';
import { appSchema } from './app.schema.js';

describe('application direction contract', () => {
  it('accepts explicit reading direction and language', () => {
    for (const language of ['en', 'en-GB', 'zh-Hant-TW', 'ar']) {
      expect(appSchema.safeParse({ language, direction: 'rtl' }).success).toBe(true);
    }
  });

  it('rejects invalid language and arbitrary rendering options', () => {
    for (const value of [
      { language: '' },
      { language: 'not a language' },
      { direction: 'vertical' },
      { portal: document.body },
      { style: {} },
    ])
      expect(appSchema.safeParse(value).success).toBe(false);
  });
});
