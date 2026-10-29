import { expect, it } from 'vitest';
import { createElement } from 'react';
import { fieldGroupSchema } from './field-group.schema.js';

it('accepts named logical grouping and rejects native or styling escapes', () => {
  expect(fieldGroupSchema.safeParse({ label: 'Search' }).success).toBe(true);
  for (const orientation of ['horizontal', 'vertical']) {
    expect(fieldGroupSchema.safeParse({ label: 'Search', orientation }).success).toBe(
      true,
    );
  }
  for (const properties of [
    {},
    { label: ' ' },
    { label: 'Search', orientation: 'diagonal' },
    { label: 'Search', children: createElement('input') },
    { label: 'Search', style: {} },
    { label: 'Search', className: 'custom' },
    { label: 'Search', onClick() {} },
    { label: 'Search', disabled: true },
  ])
    expect(fieldGroupSchema.safeParse(properties).success).toBe(false);
});
