import { describe, expect, it } from 'vitest';
import {
  appendTags,
  sameTags,
  splitTagDraft,
  tagValidationMessage,
} from './tag-entry.js';
const limits = { maxTags: 3, maxTagLength: 5 };
describe('tag entry policy', () => {
  it('normalizes selected delimiters and preserves Unicode', () => {
    expect(
      splitTagDraft(' Vue,\r\nReact; 東京 ', ['comma', 'semicolon', 'newline']),
    ).toEqual(['Vue', 'React', '東京']);
    expect(appendTags(['Vue'], ' React,東京 ', ['comma'], limits)).toEqual({
      success: true,
      values: ['Vue', 'React', '東京'],
    });
    expect(splitTagDraft('a;b', [])).toEqual(['a;b']);
  });
  it.each([
    { values: ['a', 'b', 'c', 'd'], message: 'maximum number' },
    { values: [''], message: 'Enter a tag' },
    { values: [' a'], message: 'whitespace' },
    { values: ['123456'], message: 'maximum allowed length' },
    { values: ['a', 'a'], message: 'unique' },
  ])('rejects invalid batches atomically: $message', ({ values, message }) => {
    expect(tagValidationMessage(values, limits)).toContain(message);
  });
  it('rejects empty/duplicate additions and compares controlled confirmations', () => {
    expect(appendTags([], ', ,', ['comma'], limits).success).toBe(false);
    expect(appendTags(['Vue'], 'Vue', ['comma'], limits).success).toBe(false);
    expect(sameTags(['a'], ['a'])).toBe(true);
    expect(sameTags(['a'], ['b'])).toBe(false);
    expect(sameTags(['a'], [])).toBe(false);
  });
});
