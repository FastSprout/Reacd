import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { headerNodeSchema } from './generative.schema.js';
import { footerNodeSchema } from '../footer/generative.schema.js';
import { mainNodeSchema } from '../main/generative.schema.js';
import { containerNodeSchema } from '../container/generative.schema.js';
import { separatorNodeSchema } from '../separator/generative.schema.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';

const text = z.strictObject({ type: z.literal('Text'), content: z.string() });
const child = { type: 'Text', content: 'Safe content' };

describe('generative structural shells', () => {
  it('validates and bounds every recursive shell slot', () => {
    const footer = footerNodeSchema(text);
    const header = headerNodeSchema(text);
    for (const schema of [
      containerNodeSchema(text),
      mainNodeSchema(text),
      separatorNodeSchema(text),
      footer,
      header,
    ]) {
      const type = schema.shape.type.value;
      const base = { type, children: [child], title: 'App' };
      const valid = type === 'Header' ? base : { type, children: [child] };
      expect(schema.safeParse(valid).success).toBe(true);
      expect(
        schema.safeParse({
          ...valid,
          children: Array(DOCUMENT_POLICY.maxChildren + 1).fill(child),
        }).success,
      ).toBe(false);
    }
    for (const key of ['start', 'end', 'top', 'bottom']) {
      expect(
        footer.safeParse({
          type: 'Footer',
          children: [],
          [key]: [child],
        }).success,
      ).toBe(true);
      expect(
        header.safeParse({
          type: 'Header',
          title: 'App',
          children: [],
          [key]: [child],
        }).success,
      ).toBe(true);
    }
  });

  it('requires writable state references instead of executable callbacks', () => {
    const schema = headerNodeSchema(text);
    const base = {
      type: 'Header',
      title: 'App',
      children: [],
      menu: { content: [child], open: { state: 'menuOpen', mode: 'readWrite' } },
    };
    expect(schema.safeParse(base).success).toBe(true);
    for (const open of [true, { state: 'menuOpen', mode: 'read' }]) {
      expect(
        schema.safeParse({
          ...base,
          menu: { ...base.menu, open },
        }).success,
      ).toBe(false);
    }
    expect(
      schema.safeParse({
        ...base,
        menu: { ...base.menu, onOpenChange: () => undefined },
      }).success,
    ).toBe(false);
  });
});
