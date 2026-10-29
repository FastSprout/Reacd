import { createElement } from 'react';
import { expect, it } from 'vitest';
import { scrollAreaSchema } from './scroll-area.schema.js';
import { Text } from '../../components/text/text.js';
it('accepts safe scroll content and logical extent choices', () => {
  expect(scrollAreaSchema.safeParse({ label: 'Messages' }).success).toBe(true);
  expect(
    scrollAreaSchema.safeParse({
      label: 'Messages',
      extent: 'large',
      orientation: 'horizontal',
      children: createElement(Text, null, 'Message'),
    }).success,
  ).toBe(true);
});
it('rejects native content and arbitrary dimensions', () => {
  for (const change of [
    { label: '' },
    { extent: 200 },
    { extent: 'huge' },
    { orientation: 'diagonal' },
    { children: createElement('p') },
    { style: {} },
    { className: 'scroll' },
    { height: 200 },
  ])
    expect(scrollAreaSchema.safeParse({ label: 'Messages', ...change }).success).toBe(
      false,
    );
});
