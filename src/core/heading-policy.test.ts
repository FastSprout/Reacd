import { expect, it } from 'vitest';
import {
  HEADING_LEVELS,
  nextHeadingLevel,
  sectionHeadingLevel,
} from './heading-policy.js';

it('bounds semantic heading progression without inventing HTML tags', () => {
  for (const level of HEADING_LEVELS) {
    expect(nextHeadingLevel(level)).toBe(Math.min(level + 1, 6));
    expect(sectionHeadingLevel(level)).toBe(Math.max(level, 2));
  }
});
