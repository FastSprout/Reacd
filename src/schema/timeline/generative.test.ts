import { expect, it } from 'vitest';
import { timelineNodeSchema } from './generative.schema.js';
import { timelineValueSchema } from './value.schema.js';
const items = [{ id: 'design', title: 'Design' }];
it('supports literal and writable timeline state within existing events', () => {
  for (const value of [undefined, 'design', { state: 'step', mode: 'readWrite' }])
    expect(
      timelineNodeSchema.safeParse({
        type: 'Timeline',
        label: 'Delivery',
        items,
        value,
      }).success,
    ).toBe(true);
  for (const value of ['unknown', { state: 'step', mode: 'read' }])
    expect(
      timelineNodeSchema.safeParse({
        type: 'Timeline',
        label: 'Delivery',
        items,
        value,
      }).success,
    ).toBe(false);
  expect(timelineValueSchema(items).safeParse('design').success).toBe(true);
  expect(timelineValueSchema(items).safeParse('unknown').success).toBe(false);
});
