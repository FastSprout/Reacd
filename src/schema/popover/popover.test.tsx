import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { popoverSchema } from './popover.schema.js';
import { Text } from '../../components/text/text.js';
const BASE = {
  title: 'Details',
  triggerLabel: 'Open details',
  open: false,
  onOpenChange: () => undefined,
};
describe('Popover contract', () => {
  it('accepts controlled semantic content and logical popup behavior', () => {
    for (const change of [
      {},
      { mode: 'hover', openDelay: 'none', closeDelay: 'brief' },
      {
        description: 'Details description',
        footer: createElement(Text, null, 'Footer'),
      },
      { placement: 'inline-start', align: 'end', retainContent: true },
      { dismissible: false, modal: true, disabled: true, arrow: true },
    ])
      expect(popoverSchema.safeParse({ ...BASE, ...change }).success).toBe(true);
  });
  it('rejects missing state, unknown props, and native content', () => {
    for (const change of [
      { title: '' },
      { triggerLabel: '' },
      { open: undefined },
      { onOpenChange: 'code' },
      { onOpenChange: undefined },
      { children: createElement('div') },
      { footer: createElement('button') },
      { placement: 'absolute' },
      { openDelay: 500 },
      { mode: 'cursor' },
      { className: 'custom' },
      { style: {} },
      { onClick: () => undefined },
    ])
      expect(popoverSchema.safeParse({ ...BASE, ...change }).success).toBe(false);
  });
});
