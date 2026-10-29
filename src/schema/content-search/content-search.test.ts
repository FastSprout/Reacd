import { expect, it } from 'vitest';
import { contentSearchSchema } from './content-search.schema.js';
import { contentSearchButtonSchema } from '../content-search-button/index.js';

const properties = {
  title: 'Search docs',
  label: 'Query',
  open: false,
  onOpenChange: () => undefined,
  query: '',
  onQueryChange: () => undefined,
  groups: [
    {
      key: 'docs',
      label: 'Docs',
      items: [{ key: 'input', label: 'Input', href: '/' }],
    },
  ],
};

it('retains command target validation while adding closed dialog content', () => {
  expect(contentSearchSchema.safeParse(properties).success).toBe(true);
  for (const overrides of [
    { className: 'custom' },
    { title: '' },
    { open: 'true' },
    {
      groups: [{ key: 'docs', label: 'Docs', items: [{ key: 'none', label: 'None' }] }],
    },
  ])
    expect(contentSearchSchema.safeParse({ ...properties, ...overrides }).success).toBe(
      false,
    );
  expect(
    contentSearchButtonSchema.safeParse({
      open: false,
      onOpenChange: () => undefined,
      onClick: () => undefined,
    }).success,
  ).toBe(false);
});
