import { expect, it } from 'vitest';
import { timelineSchema } from './timeline.schema.js';

const item = { id: 'design', title: 'Design review' };
it('accepts readonly and controlled timeline declarations', () => {
  for (const properties of [
    { label: 'Delivery', items: [item] },
    {
      label: 'Delivery',
      items: [{ ...item, date: 'March 22', description: 'Review' }],
      value: 'design',
      onValueChange: () => undefined,
    },
    {
      label: 'Delivery',
      items: [{ ...item, disabled: true }],
      reverse: true,
      orientation: 'horizontal',
      intent: 'secondary',
    },
  ])
    expect(timelineSchema.safeParse(properties).success).toBe(true);
});
it('rejects duplicates, unknown current events and presentation escapes', () => {
  for (const change of [
    { items: [] },
    { items: [item, item] },
    { value: 'unknown' },
    { items: [{ id: '', title: 'Title' }] },
    { label: '' },
    { onValueChange: 'select' },
    { orientation: 'diagonal' },
    { intent: 'custom' },
    { className: 'custom' },
    { style: {} },
  ])
    expect(
      timelineSchema.safeParse({
        label: 'Delivery',
        items: [item],
        ...change,
      }).success,
    ).toBe(false);
});
