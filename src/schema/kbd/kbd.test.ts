import { describe, expect, it } from 'vitest';
import { kbdSchema } from './kbd.schema.js';
describe('Kbd contract', () => {
  it('accepts keys and closed logical presentation choices', () => {
    for (const props of [
      { value: 'K' },
      { value: 'meta', platform: 'apple', size: 'large' },
      {
        value: 'F12',
        label: 'Developer shortcut',
        variant: 'solid',
        intent: 'primary',
      },
    ])
      expect(kbdSchema.safeParse(props).success).toBe(true);
  });
  it('rejects empty labels, browser props, and arbitrary markup', () => {
    for (const change of [
      { value: '' },
      { value: ' ' },
      { label: '' },
      { platform: 'auto' },
      { size: 'huge' },
      { variant: 'neon' },
      { children: 'HTML' },
      { style: {} },
      { className: 'custom' },
      { onKeyDown: () => undefined },
    ])
      expect(kbdSchema.safeParse({ value: 'K', ...change }).success).toBe(false);
  });
});
