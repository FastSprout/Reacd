import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { headerSchema } from './header.schema.js';
import { footerSchema } from '../footer/footer.schema.js';

describe('shell slot safety', () => {
  it('rejects native elements in every shell slot', () => {
    for (const key of ['children', 'start', 'end', 'top', 'bottom']) {
      expect(
        headerSchema.safeParse({
          title: 'App',
          [key]: createElement('span'),
        }).success,
      ).toBe(false);
      expect(
        footerSchema.safeParse({
          [key]: createElement('span'),
        }).success,
      ).toBe(false);
    }
    expect(
      headerSchema.safeParse({
        title: 'App',
        menu: {
          content: createElement('div'),
          open: false,
          onOpenChange: () => undefined,
        },
      }).success,
    ).toBe(false);
  });

  it('rejects unsafe navigation, nameless controls and invalid callbacks', () => {
    for (const href of ['javascript:alert(1)', '//evil.test', '/\\evil.test']) {
      expect(headerSchema.safeParse({ title: 'App', href }).success).toBe(false);
    }
    for (const override of [
      { open: 'false' },
      { onOpenChange: null },
      { toggleLabel: '' },
      { closeLabel: '' },
      { mode: 'custom' },
    ]) {
      expect(
        headerSchema.safeParse({
          title: 'App',
          menu: {
            open: false,
            onOpenChange: () => undefined,
            ...override,
          },
        }).success,
      ).toBe(false);
    }
  });
});
