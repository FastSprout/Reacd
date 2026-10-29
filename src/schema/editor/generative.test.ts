import { z } from 'zod';
import { expect, expectTypeOf, it } from 'vitest';
import { EDITOR_POLICY } from '../../core/editor-policy.js';
import { editorDocumentSchema } from './document/index.js';
import { createEditorNodeSchema, editorNodeBindings } from './generative.schema.js';
import type { EditorNode } from './generative.schema.js';

const child = z.strictObject({ type: z.literal('Text'), content: z.string() });
const schema = createEditorNodeSchema(child);
const base = {
  type: 'Editor',
  label: 'Document',
  value: { state: 'document', mode: 'readWrite' },
};

it('declares closed editor state references and readonly recursive slots', () => {
  const value = schema.parse({
    ...base,
    description: 'Business text',
    placeholder: 'Write a draft',
    disabled: false,
    readOnly: false,
    toolbar: [{ type: 'Text', content: 'Formatting' }],
    children: [{ type: 'Text', content: 'Document help' }],
  });
  expect(Object.isFrozen(value)).toBe(true);
  expect(Object.isFrozen(value.toolbar)).toBe(true);
  expect(Object.isFrozen(value.children)).toBe(true);
  expect(schema.safeParse(base).success).toBe(true);
  expect(
    schema.safeParse({ ...base, value: { state: 'document', mode: 'read' } }).success,
  ).toBe(true);
  for (const extra of [
    { className: 'escape' },
    { style: { color: 'red' } },
    { value: { state: 'document', mode: 'write' } },
    { disabled: { state: 'flag', mode: 'read' } },
    { readOnly: { state: 'flag', mode: 'read' } },
    { onValueChange() {} },
    { selection: null },
    { onSelectionChange() {} },
    { toolbar: '<div>Toolbar</div>' },
    { children: [{ type: 'div' }] },
    { toolbar: [{ type: 'Text', content: 'Formatting', style: 'escape' }] },
  ])
    expect(schema.safeParse({ ...base, ...extra }).success).toBe(false);
  expectTypeOf<typeof value>().toExtend<EditorNode<z.infer<typeof child>>>();
});

it('bounds both slots and binds only exact validated rich documents', () => {
  const slots = Array.from({ length: EDITOR_POLICY.maxChildren + 1 }, () => ({
    type: 'Text',
    content: 'Help',
  }));
  expect(schema.safeParse({ ...base, toolbar: slots }).success).toBe(false);
  expect(schema.safeParse({ ...base, children: slots }).success).toBe(false);
  const value = schema.parse(base);
  const contracts = editorNodeBindings(value);
  expect(contracts).toHaveLength(1);
  expect(contracts[0]?.kinds).toEqual(['richDocument']);
  expect(contracts[0]?.property).toBe('value');
  expect(contracts[0]?.mode).toBe('readWrite');
  expect(contracts[0]?.reference).toEqual(base.value);
  expect(contracts[0]?.schema).toBe(editorDocumentSchema);
  const reader = schema.parse({ ...base, value: { state: 'document', mode: 'read' } });
  expect(editorNodeBindings(reader)[0]?.mode).toBe('read');
  expect(contracts[0]?.schema.safeParse('<p>Raw HTML</p>').success).toBe(false);
});
