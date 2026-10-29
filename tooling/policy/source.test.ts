import { describe, expect, it } from 'vitest';
import { checkSource } from './source.js';
import { SOURCE_POLICY } from '../../src/core/policy.js';

describe('source limits', () => {
  it('accepts boundary values, Unicode characters, and final newlines', () => {
    expect(checkSource('a.ts', '  value\n')).toEqual([]);
    expect(checkSource('a.ts', '')).toEqual([]);
    expect(checkSource('a.ts', '🙂'.repeat(SOURCE_POLICY.maxColumns))).toEqual([]);
    expect(checkSource('a.ts', '\n'.repeat(SOURCE_POLICY.maxLines))).toEqual([]);
    expect(checkSource('a.md', '1. Item\n   Markdown continuation')).toEqual([]);
  });

  it('reports line, column, tab, and indentation violations', () => {
    expect(checkSource('a.ts', '\n'.repeat(SOURCE_POLICY.maxLines + 1))).toEqual([
      expect.objectContaining({ rule: 'lines' }),
    ]);
    expect(checkSource('a.ts', 'x'.repeat(SOURCE_POLICY.maxColumns + 1))).toEqual([
      expect.objectContaining({ rule: 'columns' }),
    ]);
    expect(checkSource('a.ts', '\tvalue').map((issue) => issue.rule)).toContain('tabs');
    expect(checkSource('a.ts', ' value')).toEqual([
      expect.objectContaining({ rule: 'indent' }),
    ]);
  });
});
