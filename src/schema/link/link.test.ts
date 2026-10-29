import { describe, expect, it } from 'vitest';
import { linkSchema } from './link.schema.js';

describe('safe closed links', () => {
  it('accepts supported targets and logical state', () => {
    for (const href of [
      '/',
      '/orders?q=one',
      '#section',
      'https://reacd.dev/',
      'http://localhost:8000/',
      'mailto:hello@example.test',
    ]) {
      expect(
        linkSchema.safeParse({
          label: 'Reference',
          href,
          active: true,
          disabled: false,
          newWindow: true,
        }).success,
      ).toBe(true);
    }
  });

  it('rejects unsafe and malformed targets and native styling', () => {
    for (const href of [
      '//evil.test',
      'javascript:alert(1)',
      'data:text/html,x',
      '/\\evil.test',
      '/orders\u0000',
      'https://[bad',
      'ftp://host',
      '',
    ]) {
      expect(linkSchema.safeParse({ label: 'Reference', href }).success).toBe(false);
    }
    for (const properties of [
      { label: '' },
      { target: '_self' },
      { rel: 'opener' },
      { style: {} },
      { as: 'button' },
      { active: 'true' },
    ]) {
      expect(
        linkSchema.safeParse({
          label: 'Reference',
          href: '/',
          ...properties,
        }).success,
      ).toBe(false);
    }
  });
});
