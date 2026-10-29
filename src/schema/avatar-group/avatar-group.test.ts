import { describe, expect, it } from 'vitest';
import { avatarGroupSchema } from './avatar-group.schema.js';

const valid = { label: 'Reviewers', items: [{ id: 'reader', name: 'Example Reader' }] };
describe('AvatarGroup contract', () => {
  it('accepts empty, bounded, and described identities', () => {
    expect(avatarGroupSchema.safeParse(valid).success).toBe(true);
    expect(
      avatarGroupSchema.safeParse({ ...valid, items: [], emptyMessage: 'No people.' })
        .success,
    ).toBe(true);
    expect(
      avatarGroupSchema.safeParse({ ...valid, max: 1, size: 'large' }).success,
    ).toBe(true);
  });
  it('rejects duplicate IDs, malformed items, limits, and styling props', () => {
    for (const change of [
      { items: [valid.items[0], valid.items[0]] },
      { max: 0 },
      { max: 1.5 },
      { items: [{ id: 'reader', name: '' }] },
      { items: [{ name: 'Missing ID' }] },
      { items: [{ id: 'reader', name: 'Reader', size: 'large' }] },
      { style: {} },
      { children: 'unsafe' },
    ])
      expect(avatarGroupSchema.safeParse({ ...valid, ...change }).success).toBe(false);
  });
});
