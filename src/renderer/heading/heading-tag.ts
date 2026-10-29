import type { HeadingLevel } from '../../core/heading-policy.js';

const TAGS = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;

export function headingTag(level: HeadingLevel) {
  return TAGS[level];
}
