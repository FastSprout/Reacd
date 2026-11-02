import { sectionHeadingLevel } from './heading-policy.js';
import type { HeadingLevel } from './heading-policy.js';
import type { TextRole } from './policy.js';

export function textHeadingLevel(
  role: TextRole,
  scope: HeadingLevel,
): HeadingLevel | undefined {
  if (role === 'headline') return scope;
  if (role === 'subheadline') return sectionHeadingLevel(scope);
  return undefined;
}
