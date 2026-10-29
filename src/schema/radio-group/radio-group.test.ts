import { describe, expect, it } from 'vitest';
import { radioGroupSchema } from './radio-group.schema.js';

const items = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
];
const valid = { label: 'Choice', items, value: '', onValueChange: () => undefined };
describe('RadioGroup contract', () => {
  it('accepts unselected/selected values and described disabled choices', () => {
    expect(radioGroupSchema.safeParse(valid).success).toBe(true);
    expect(
      radioGroupSchema.safeParse({
        ...valid,
        value: 'two',
        required: true,
        orientation: 'horizontal',
        items: [{ ...items[0], description: 'Description', disabled: true }, items[1]],
      }).success,
    ).toBe(true);
  });
  it('rejects malformed, duplicate, and missing choices and styling escapes', () => {
    for (const change of [
      { label: '' },
      { items: [] },
      { items: [items[0], items[0]] },
      { value: 'missing' },
      { value: 1 },
      { onValueChange: false },
      { items: [{ value: '', label: 'Empty ID' }] },
      { orientation: 'diagonal' },
      { className: 'custom' },
      { style: {} },
      { defaultValue: 'one' },
    ])
      expect(radioGroupSchema.safeParse({ ...valid, ...change }).success).toBe(false);
  });
});
