import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { emptySchema } from './empty.schema.js';

describe('Empty contract', () => {
  it('accepts named empty states and safe composition slots', () => {
    for (const props of [
      { title: 'No orders' },
      { title: 'No matches', description: 'Change the query.', variant: 'soft' },
      { title: 'Busy', loading: true, loadingLabel: 'Refreshing records' },
      { title: 'Safe content', children: 'Body', leading: null, footer: 'Help' },
    ])
      expect(emptySchema.safeParse(props).success).toBe(true);
  });
  it('rejects missing names, unsafe slots, and native properties', () => {
    for (const props of [
      { title: '' },
      { title: ' ' },
      { loadingLabel: '' },
      { size: 'huge' },
      { variant: 'gradient' },
      { style: {} },
      { className: 'custom' },
      { onClick: () => undefined },
    ])
      expect(emptySchema.safeParse({ title: 'Empty', ...props }).success).toBe(false);
    expect(emptySchema.safeParse({}).success).toBe(false);
    for (const slot of ['leading', 'children', 'actions', 'footer']) {
      expect(
        emptySchema.safeParse({
          title: 'Unsafe',
          [slot]: createElement('div', {}, 'Native content'),
        }).success,
      ).toBe(false);
    }
  });
});
