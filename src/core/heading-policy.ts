export const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export type HeadingLevel = (typeof HEADING_LEVELS)[number];

export const HEADING_POLICY = {
  root: 1,
  minimumSection: 2,
} as const;

const NEXT_HEADING_LEVEL = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 6,
} as const;

export function nextHeadingLevel(level: HeadingLevel): HeadingLevel {
  return NEXT_HEADING_LEVEL[level];
}

export function sectionHeadingLevel(level: HeadingLevel): HeadingLevel {
  return level === HEADING_POLICY.root ? HEADING_POLICY.minimumSection : level;
}
