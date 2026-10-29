import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { modalSchema } from './modal.schema.js';

const valid = {
  title: 'Title',
  description: 'Description',
  open: false,
  onOpenChange: () => undefined,
};
describe('Modal contract', () => {
  it('accepts closed, controlled, and optional presentation properties', () => {
    expect(modalSchema.safeParse(valid).success).toBe(true);
    expect(
      modalSchema.safeParse({
        ...valid,
        modal: false,
        overlay: false,
        fullscreen: true,
        retainContent: true,
        footer: 'Footer',
      }).success,
    ).toBe(true);
  });
  it('rejects missing labels, invalid state, callbacks, and native content', () => {
    for (const input of [
      { ...valid, title: '' },
      { ...valid, description: '' },
      { ...valid, open: 'false' },
      { ...valid, onOpenChange: false },
      { ...valid, children: createElement('div') },
      { ...valid, style: {} },
      { ...valid, footer: createElement('span') },
    ]) {
      expect(modalSchema.safeParse(input).success).toBe(false);
    }
  });
});
