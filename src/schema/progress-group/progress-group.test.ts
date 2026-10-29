import { describe, expect, it } from 'vitest';
import { progressGroupSchema } from './progress-group.schema.js';

const item = { id: 'used', label: 'Used', value: 24 };
describe('ProgressGroup contract', () => {
  it('accepts bounded finite values, semantic intents and custom maximum', () => {
    for (const properties of [
      { label: 'Storage', items: [item] },
      { label: 'Storage', items: [{ ...item, value: -10 }], max: 128 },
      { label: 'Storage', items: [{ ...item, value: 512, intent: 'danger' }] },
      { label: 'Storage', items: [item], showStatus: false },
    ])
      expect(progressGroupSchema.safeParse(properties).success).toBe(true);
  });
  it('rejects invalid numbers, identities, items and styling', () => {
    for (const change of [
      { max: 0 },
      { max: -1 },
      { max: Infinity },
      { items: [] },
      { items: [item, item] },
      { items: [{ ...item, value: Infinity }] },
      { items: [{ ...item, value: Number.NaN }] },
      { items: [{ ...item, intent: 'orange' }] },
      { items: [{ ...item, id: '' }] },
      { label: '' },
      { className: 'wide' },
      { style: {} },
    ])
      expect(
        progressGroupSchema.safeParse({
          label: 'Storage',
          items: [item],
          ...change,
        }).success,
      ).toBe(false);
  });
});
