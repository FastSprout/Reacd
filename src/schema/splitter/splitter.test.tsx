import { describe, expect, it } from 'vitest';
import { splitterSchema, panelLayoutSchemaFor } from './splitter.schema.js';
import { panelLayoutValueSchema } from '../state/panel-layout/panel-layout.schema.js';
import { splitterNodeSchema } from './generative.schema.js';
import { z } from 'zod';

const panels = [
  { id: 'first', label: 'First', minShare: 20, maxShare: 80 },
  { id: 'second', label: 'Second', minShare: 20, maxShare: 80 },
];
const value = [
  { id: 'first', share: 50 },
  { id: 'second', share: 50 },
];
const declaration = {
  label: 'Workspace',
  panels,
  value,
  onValueChange: () => undefined,
};

describe('Splitter validated layout', () => {
  it('accepts constrained shares and safe default constraints', () => {
    expect(splitterSchema.safeParse(declaration).success).toBe(true);
    expect(
      splitterSchema.safeParse({
        ...declaration,
        panels: [
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ],
      }).success,
    ).toBe(true);
    expect(panelLayoutSchemaFor(panels).safeParse(value).success).toBe(true);
  });

  it('rejects malformed totals, identities and constraints', () => {
    for (const invalid of [
      [],
      [{ id: 'first', share: 100 }],
      [
        { id: 'first', share: 50 },
        { id: 'first', share: 50 },
      ],
      [
        { id: 'first', share: Number.NaN },
        { id: 'second', share: 50 },
      ],
      [
        { id: 'first', share: 30 },
        { id: 'second', share: 50 },
      ],
      [
        { id: 'second', share: 50 },
        { id: 'first', share: 50 },
      ],
      [
        { id: 'first', share: 10 },
        { id: 'second', share: 90 },
      ],
    ])
      expect(splitterSchema.safeParse({ ...declaration, value: invalid }).success).toBe(
        false,
      );
    expect(panelLayoutValueSchema.safeParse(value).success).toBe(true);
    expect(
      panelLayoutSchemaFor(panels).safeParse([...value, { id: 'extra', share: 0 }])
        .success,
    ).toBe(false);
  });

  it('rejects raw children, callbacks, escapes and impossible panel ranges', () => {
    for (const invalid of [
      { className: 'custom' },
      { style: { height: 10 } },
      { onValueChange: 'callback' },
      { orientation: 'diagonal' },
      { panels: [panels[0], panels[0]] },
      { panels: [{ id: 'first', label: 'First', content: <div /> }, panels[1]] },
      { panels: [{ ...panels[0], minShare: 90 }, panels[1]] },
      { panels: [{ ...panels[0], collapsedShare: 30 }, panels[1]] },
    ])
      expect(splitterSchema.safeParse({ ...declaration, ...invalid }).success).toBe(
        false,
      );
  });

  it('preserves range validation in generative transport', () => {
    const schema = splitterNodeSchema(z.string());
    const node = {
      type: 'Splitter',
      label: 'Workspace',
      panels: panels.map((panel) => ({ ...panel, content: ['Panel text'] })),
      value: { state: 'panels', mode: 'readWrite' },
    };
    expect(schema.safeParse(node).success).toBe(true);
    expect(
      schema.safeParse({
        ...node,
        panels: [{ ...panels[0], minShare: 90, content: [] }, node.panels[1]],
      }).success,
    ).toBe(false);
    expect(
      schema.safeParse({ ...node, panels: [node.panels[0], node.panels[0]] }).success,
    ).toBe(false);
  });
});
