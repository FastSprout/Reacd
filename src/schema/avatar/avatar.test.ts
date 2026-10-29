import { describe, expect, it } from 'vitest';
import { avatarSchema } from './avatar.schema.js';

describe('Avatar contract', () => {
  it('accepts named images, relative sources, and grapheme-safe fallbacks', () => {
    for (const props of [
      { name: 'Example' },
      { name: 'Reader', src: '/avatar.png' },
      { name: 'Reader', src: 'https://example.com/avatar.png', size: 'small' },
      { name: 'Reader', src: 'http://127.0.0.1/image.png', size: 'large' },
      { name: 'Developer', fallback: '👩‍💻' },
      { name: 'Reader', fallback: '+1' },
    ])
      expect(avatarSchema.safeParse(props).success).toBe(true);
  });
  it('rejects invalid identity, sources, text, and native styling escape', () => {
    for (const change of [
      { name: '' },
      { src: '' },
      { src: '//example.com/x' },
      { src: 'javascript:alert(1)' },
      { src: 'data:image/svg+xml,markup' },
      { src: 'https://user:password@example.com/x' },
      { src: 'https://:password@example.com/x' },
      { src: 'http://' },
      { src: '/\\example.com/x' },
      { src: '/has space.png' },
      { src: '/has\u0000nul' },
      { fallback: '' },
      { fallback: 'Long' },
      { size: 'huge' },
      { onError: () => undefined },
      { style: {} },
      { className: 'custom' },
    ])
      expect(avatarSchema.safeParse({ name: 'Example', ...change }).success).toBe(
        false,
      );
  });
});
