import { describe, expect, it } from 'vitest';
import { avatarInitials, avatarGraphemes } from './avatar-text.js';

describe('avatar text', () => {
  it.each([
    ['Example Reader', 'ER'],
    ['Single', 'SI'],
    ['  first  middle last ', 'FL'],
    ['山田 太郎', '山太'],
    ['e\u0301mile', 'E\u0301M'],
    ['👩‍💻', '👩‍💻'],
    ['ßß', 'SS'],
    ['', '?'],
    [' ', '?'],
  ])('derives bounded graphemes from %s', (name, expected) => {
    expect(avatarInitials(name)).toBe(expected);
    expect(avatarGraphemes(avatarInitials(name)).length).toBeLessThanOrEqual(2);
  });
});
