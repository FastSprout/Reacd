import { createElement } from 'react';
import { expect, it } from 'vitest';
import { chatPaletteSchema } from './chat-palette.schema.js';

it('keeps conversation/prompt slots closed and independent of overlay state', () => {
  expect(
    chatPaletteSchema.safeParse({
      label: 'Assistant palette',
      children: 'Example conversation',
      prompt: 'Example prompt',
    }).success,
  ).toBe(true);
  expect(chatPaletteSchema.safeParse({ label: 'Readonly palette' }).success).toBe(true);
  for (const change of [
    { label: '' },
    { prompt: createElement('form') },
    { children: createElement('div') },
    { open: true },
    { style: {} },
  ])
    expect(
      chatPaletteSchema.safeParse({ label: 'Assistant palette', ...change }).success,
    ).toBe(false);
});
