import { describe, expect, it } from 'vitest';
import { checkboxGroupSchema } from './checkbox-group.schema.js';

const items = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
];
const valid = { label: 'Choices', items, value: [], onValueChange: () => undefined };
describe('CheckboxGroup contract', () => {
  it('accepts empty, multiple, disabled, required, and limited selections', () => {
    for (const change of [
      {},
      { value: ['one', 'two'] },
      { value: ['one'], max: 1 },
      { disabled: true, required: true, orientation: 'horizontal' },
    ])
      expect(checkboxGroupSchema.safeParse({ ...valid, ...change }).success).toBe(true);
  });
  it('rejects invalid selections, limits, and uncontrolled escapes', () => {
    for (const change of [
      { value: ['one', 'one'] },
      { value: ['unknown'] },
      { value: 'one' },
      { value: ['one', 'two'], max: 1 },
      { max: 0 },
      { max: 1.5 },
      { items: [] },
      { items: [items[0], items[0]] },
      { onValueChange: 'change' },
      { items: [{ value: 'one', label: 'One', html: 'unsafe' }] },
      { style: {} },
      { defaultValue: ['one'] },
    ])
      expect(checkboxGroupSchema.safeParse({ ...valid, ...change }).success).toBe(
        false,
      );
  });
});
