import { AVATAR_DEFAULTS, AVATAR_POLICY } from './avatar-policy.js';

const SEGMENTER = new Intl.Segmenter(AVATAR_POLICY.locale, { granularity: 'grapheme' });
export function avatarGraphemes(text: string): string[] {
  return Array.from(SEGMENTER.segment(text), (part) => part.segment);
}
export function avatarInitials(name: string): string {
  const words = name.trim().split(/\s+/u);
  const multiple = words.length > AVATAR_POLICY.initialsPerWord;
  const selected = multiple
    ? words
        .slice(0, AVATAR_POLICY.initialsPerWord)
        .concat(words.slice(-AVATAR_POLICY.initialsPerWord))
    : words;
  const perWord = multiple ? AVATAR_POLICY.initialsPerWord : AVATAR_POLICY.maxInitials;
  const text = selected
    .map((word) => avatarGraphemes(word).slice(0, perWord).join(''))
    .join('')
    .toLocaleUpperCase(AVATAR_POLICY.locale);
  return (
    avatarGraphemes(text).slice(0, AVATAR_POLICY.maxInitials).join('') ||
    AVATAR_DEFAULTS.fallback
  );
}
