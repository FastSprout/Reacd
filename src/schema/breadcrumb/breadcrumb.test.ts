import { describe, expect, it } from 'vitest';
import { breadcrumbSchema } from './breadcrumb.schema.js';
describe('Breadcrumb contract', () => {
  it('accepts safe links, actions, disabled segments and plain current text', () => {
    expect(
      breadcrumbSchema.safeParse({
        label: 'Location',
        items: [
          { key: 'home', label: 'Home', href: '/' },
          { key: 'projects', label: 'Projects', onPress: () => undefined },
          { key: 'current', label: 'Current' },
        ],
      }).success,
    ).toBe(true);
  });
  it('rejects duplicate paths, missing names, ambiguous targets and styling', () => {
    const item = { key: 'home', label: 'Home' };
    for (const props of [
      { label: '', items: [item] },
      { label: 'Path', items: [] },
      { label: 'Path', items: [item, item] },
      { label: 'Path', items: [{ ...item, href: '/', onPress: () => undefined }] },
      { label: 'Path', items: [{ ...item, href: '//example.test' }] },
      { label: 'Path', items: [{ ...item, href: '/\\example.test' }] },
      { label: 'Path', items: [item], separator: 'custom' },
      { label: 'Path', items: [item], className: 'custom' },
    ])
      expect(breadcrumbSchema.safeParse(props).success).toBe(false);
  });
});
