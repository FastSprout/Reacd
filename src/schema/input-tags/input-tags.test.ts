import { describe, expect, it } from 'vitest';
import { inputTagsSchema } from './input-tags.schema.js';
import { inputTagsNodeSchema } from './generative.schema.js';
const base = { label: 'Topics', value: ['React'], onValueChange() {} };
describe('InputTags contract', () => {
  it('accepts both transport binding modes and rejects callback transport', () => {
    for (const mode of ['read', 'readWrite']) {
      const node = {
        type: 'InputTags',
        label: 'Topics',
        value: { state: 'topics', mode },
      };
      expect(inputTagsNodeSchema.safeParse(node).success).toBe(true);
      expect(
        inputTagsNodeSchema.safeParse({ ...node, onValueChange() {} }).success,
      ).toBe(false);
    }
  });
  it('supports empty, Unicode and explicit logical behavior', () => {
    expect(inputTagsSchema.safeParse({ ...base, value: [] }).success).toBe(true);
    expect(
      inputTagsSchema.safeParse({
        ...base,
        value: ['東京', 'Vue'],
        maxTags: 2,
        maxTagLength: 4,
        delimiters: ['comma', 'newline'],
        addOnPaste: true,
        addOnBlur: true,
        addOnTab: true,
      }).success,
    ).toBe(true);
  });
  it.each([
    { value: ['React', 'React'] },
    { value: [''] },
    { value: [' React'] },
    { maxTags: 0 },
    { maxTags: 101 },
    { maxTagLength: 0 },
    { maxTagLength: 81 },
    { maxTagLength: 4 },
    { value: ['a', 'b'], maxTags: 1 },
    { delimiters: [] },
    { delimiters: ['comma', 'comma'] },
    { delimiters: ['space'] },
    { className: 'x' },
    { onValueChange: 'callback' },
  ])('rejects invalid tokens, limits and styling: %j', (properties) => {
    expect(inputTagsSchema.safeParse({ ...base, ...properties }).success).toBe(false);
  });
});
