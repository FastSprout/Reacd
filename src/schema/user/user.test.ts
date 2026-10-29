import { describe, expect, it } from 'vitest';
import { userSchema } from './user.schema.js';

describe('User contract', () => {
  it('accepts identity, safe avatar, links and exclusive controlled actions', () => {
    for (const properties of [
      { name: 'Ada Lovelace' },
      { name: 'Ada', description: 'Engineer', avatar: { fallback: 'AL' } },
      { name: 'Ada', avatar: { src: '/ada.png' }, size: 'small' },
      { name: 'Ada', href: '/people/ada', orientation: 'vertical' },
      { name: 'Ada', onPress: () => undefined, disabled: true },
    ])
      expect(userSchema.safeParse(properties).success).toBe(true);
  });

  it('rejects unsafe targets, conflicting actions and native escape hatches', () => {
    for (const change of [
      { name: '' },
      { avatar: { src: 'javascript:alert(1)' } },
      { avatar: { fallback: 'ABC' } },
      { href: 'javascript:alert(1)' },
      { href: '/ada', onPress: () => undefined },
      { disabled: true },
      { onPress: 'open' },
      { className: 'custom' },
      { style: {} },
      { onClick: () => undefined },
      { size: 'huge' },
      { avatar: { size: 'small' } },
    ])
      expect(userSchema.safeParse({ name: 'Ada', ...change }).success).toBe(false);
  });
});
