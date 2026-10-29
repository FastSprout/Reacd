import { expect, it } from 'vitest';
import { progressNodeSchema } from './generative.schema.js';
it('distinguishes bounded literal, indeterminate and read-bound progress', () => {
  expect(
    progressNodeSchema.safeParse({ type: 'Progress', label: 'Upload', value: 100 })
      .success,
  ).toBe(true);
  for (const value of [undefined, null, 0, 500, { state: 'progress', mode: 'read' }])
    expect(
      progressNodeSchema.safeParse({
        type: 'Progress',
        label: 'Upload',
        value,
        max: 500,
      }).success,
    ).toBe(true);
  expect(
    progressNodeSchema.safeParse({
      type: 'Progress',
      label: 'Upload',
      value: 501,
      max: 500,
    }).success,
  ).toBe(false);
});
