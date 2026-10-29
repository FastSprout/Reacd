import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { bannerSchema } from './banner.schema.js';
import { Button } from '../../components/button/button.js';

const valid = { title: 'Maintenance', open: true, onOpenChange: () => undefined };
describe('Banner contract', () => {
  it('accepts controlled visibility, logical intent and safe actions', () => {
    expect(bannerSchema.parse(valid)).toEqual(valid);
    expect(
      bannerSchema.safeParse({
        ...valid,
        description: 'Save before midnight.',
        dismissible: true,
        intent: 'warning',
        closeLabel: 'Hide notice',
        actions: createElement(Button, { label: 'Save', onPress: () => undefined }),
      }).success,
    ).toBe(true);
  });
  it('rejects uncontrolled callbacks, native content and styling', () => {
    for (const change of [
      { title: '' },
      { open: 'yes' },
      { onOpenChange: undefined },
      { onOpenChange: 'close' },
      { closeLabel: '' },
      { intent: 'custom' },
      { actions: createElement('button') },
      { style: {} },
      { className: 'banner' },
      { onClick: () => undefined },
    ])
      expect(bannerSchema.safeParse({ ...valid, ...change }).success).toBe(false);
  });
});
