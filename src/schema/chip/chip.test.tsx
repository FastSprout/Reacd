import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { chipSchema } from './chip.schema.js';
import { Text } from '../../components/text/text.js';

describe('Chip contract', () => {
  it('accepts dots, text, finite values, corners, and standalone indicators', () => {
    for (const properties of [
      { label: 'Online' },
      { label: 'Unread', text: 0, size: 'large' },
      { label: 'Unread', text: '99+', corner: 'bottom-start', inset: true },
      { label: 'Hidden', show: false, children: createElement(Text, null, 'Child') },
      { label: 'State', standalone: true, intent: 'danger', size: 'small' },
    ])
      expect(chipSchema.safeParse(properties).success).toBe(true);
  });
  it('rejects unknown props, invalid values, and native content', () => {
    for (const change of [
      { label: '' },
      { text: Number.NaN },
      { text: Infinity },
      { text: Number.MAX_VALUE },
      { standalone: true, children: createElement(Text, null, 'Hidden child') },
      { text: 'x'.repeat(10_001) },
      { corner: 'top-left' },
      { size: 'huge' },
      { className: 'custom' },
      { style: {} },
      { onClick: () => undefined },
      { children: createElement('div') },
    ])
      expect(chipSchema.safeParse({ label: 'State', ...change }).success).toBe(false);
  });
});
