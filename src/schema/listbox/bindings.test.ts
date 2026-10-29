import { expect, it } from 'vitest';
import { listboxBindings } from './bindings.js';
import { nodeBindings } from '../generative-v2/binding-contracts.js';

const node = {
  type: 'Listbox',
  label: 'Choice',
  items: [{ value: '42', label: 'Answer' }],
  value: { state: 'choice', mode: 'readWrite' },
} as const;

it('declares constrained state without rejecting empty editing data', () => {
  const single = listboxBindings(node);
  expect(single[0]?.kinds).toEqual(['text']);
  expect(single[0]?.schema.safeParse('').success).toBe(true);
  expect(single[0]?.schema.safeParse('missing').success).toBe(false);
  const multiple = listboxBindings({ ...node, mode: 'multiple' });
  expect(multiple[0]?.kinds).toEqual(['selection']);
  expect(multiple[0]?.schema.safeParse([]).success).toBe(true);
  expect(multiple[0]?.schema.safeParse(['42', '42']).success).toBe(false);
  expect(nodeBindings(node)[0]?.property).toBe('value');
});
