import { describe, expect, it } from 'vitest';
import { accordionSchema } from './accordion.schema.js';

const properties = {
  label: 'Sections',
  value: [],
  items: [{ value: 'one', label: 'One', content: 'Content' }],
  onValueChange: () => undefined,
};
describe('Accordion contract', () => {
  it('accepts single, multiple, and non-collapsible selections', () => {
    for (const props of [
      properties,
      { ...properties, value: ['one'] },
      { ...properties, value: ['one'], collapsible: false },
      { ...properties, mode: 'multiple', collapsible: false },
    ]) {
      expect(accordionSchema.safeParse(props).success).toBe(true);
    }
  });
  it('rejects unknown or duplicate values and invalid component content', () => {
    for (const props of [
      { ...properties, value: ['missing'] },
      { ...properties, value: ['one', 'one'] },
      { ...properties, collapsible: false },
      { ...properties, items: [...properties.items, ...properties.items] },
      { ...properties, items: [] },
      { ...properties, className: 'escape' },
      { ...properties, onValueChange: 'bad' },
      { ...properties, items: [{ value: 'a', label: 'A', content: {} }] },
      {
        ...properties,
        value: ['one', 'two'],
        items: [...properties.items, { value: 'two', label: 'Two' }],
      },
    ])
      expect(accordionSchema.safeParse(props).success).toBe(false);
  });
});
