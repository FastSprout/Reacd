import { expect, it } from 'vitest';
import { iconSchema } from './icon.schema.js';

it('requires names and accessible labels or explicit decorative mode', () => {
  expect(iconSchema.safeParse({ name: 'search', label: 'Search' }).success).toBe(true);
  expect(iconSchema.safeParse({ name: 'check', decorative: true }).success).toBe(true);
  for (const change of [
    { name: 'native-svg', label: 'Invalid' },
    { name: 'search' },
    { name: 'search', label: '' },
    { name: 'search', label: 'Search', decorative: true },
    { name: 'check', decorative: false },
    { name: 'check', decorative: true, size: 48 },
    { name: 'check', decorative: true, style: {} },
    { name: 'check', decorative: true, className: 'icon' },
    { name: 'check', decorative: true, onClick: () => undefined },
  ])
    expect(iconSchema.safeParse(change).success).toBe(false);
});
