import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { tooltipSchema } from './tooltip.schema.js';
import { Text } from '../../components/text/text.js';

describe('Tooltip contract', () => {
  it('accepts automatic or paired controlled state and safe content', () => {
    for (const properties of [
      { text: 'Hint', children: createElement(Text, null, 'Anchor') },
      { text: 'Hint', open: true, onOpenChange: () => undefined },
      { text: 'Hint', delay: 'none', placement: 'inline-start', arrow: true },
      { text: 'Hint', disabled: true, shortcuts: ['Control', 'S'] },
      { text: 'Hint', onOpenChange: () => undefined },
    ])
      expect(
        tooltipSchema.safeParse({
          children: createElement(Text, null, 'Anchor'),
          ...properties,
        }).success,
      ).toBe(true);
  });
  it('rejects incomplete state, native content, and vendor escapes', () => {
    for (const change of [
      { text: '' },
      { children: undefined },
      { children: null },
      { children: [] },
      { open: true },
      { onOpenChange: 'code' },
      { placement: 'absolute' },
      { delay: -1 },
      { shortcuts: [''] },
      { children: createElement('button') },
      { render: () => null },
      { className: 'custom' },
      { style: {} },
      { onFocus: () => undefined },
    ])
      expect(
        tooltipSchema.safeParse({
          text: 'Hint',
          children: createElement(Text, null, 'Anchor'),
          ...change,
        }).success,
      ).toBe(false);
  });
});
