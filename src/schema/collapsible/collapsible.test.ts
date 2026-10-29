import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { collapsibleSchema } from './collapsible.schema.js';

const valid = { label: 'Details', open: false, onOpenChange: () => undefined };
describe('Collapsible contract', () => {
  it('accepts controlled, retained, and external-trigger panels', () => {
    expect(collapsibleSchema.safeParse(valid).success).toBe(true);
    expect(
      collapsibleSchema.safeParse({
        ...valid,
        retainContent: true,
        showTrigger: false,
        disabled: true,
      }).success,
    ).toBe(true);
  });
  it('rejects malformed state, callbacks, markup, and styling escapes', () => {
    for (const value of [
      { ...valid, label: '' },
      { ...valid, open: 'true' },
      { ...valid, onOpenChange: 1 },
      { ...valid, retainContent: 'true' },
      { ...valid, children: createElement('span') },
      { ...valid, className: 'custom' },
      { ...valid, style: {} },
      { ...valid, defaultOpen: true },
    ]) {
      expect(collapsibleSchema.safeParse(value).success).toBe(false);
    }
  });
});
