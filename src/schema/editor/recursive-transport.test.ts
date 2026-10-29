import { z } from 'zod';
import { expect, it } from 'vitest';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { editorToolbarNodeSchema } from '../editor-toolbar/generative.schema.js';
import { createEditorNodeSchema } from './generative.schema.js';
import type { EditorNode } from './generative.schema.js';

const text = z.strictObject({ type: z.literal('Text'), content: z.string() });
type TestNode =
  z.infer<typeof text> | z.infer<typeof editorToolbarNodeSchema> | EditorNode<TestNode>;
const recursive: z.ZodType<TestNode> = z.lazy(() =>
  z.union([text, editorToolbarNodeSchema, createEditorNodeSchema(recursive)]),
);
const nested = {
  type: 'Editor',
  label: 'Outer',
  value: { state: 'outer', mode: 'readWrite' },
  toolbar: [{ type: 'EditorToolbar', items: [{ command: 'bold' }] }],
  children: [
    { type: 'Text', content: 'Safe help' },
    {
      type: 'Editor',
      label: 'Inner',
      value: { state: 'inner', mode: 'read' },
      toolbar: [{ type: 'EditorToolbar', items: [{ command: 'italic' }] }],
    },
  ],
};

it('validates nested editor slots with the direct recursive interface', () => {
  const leaf = z.discriminatedUnion('type', [text, editorToolbarNodeSchema]);
  expect(leaf.safeParse({ type: 'EditorToolbar' }).success).toBe(true);
  expect(recursive.safeParse(nested).success).toBe(true);
  expect(
    recursive.safeParse({
      ...nested,
      children: [{ type: 'Editor', label: 'Broken', value: 'raw document' }],
    }).success,
  ).toBe(false);
  expect(
    recursive.safeParse({
      ...nested,
      toolbar: [{ type: 'EditorToolbar', items: [{ command: 'script' }] }],
    }).success,
  ).toBe(false);
  expect(
    recursive.safeParse({
      ...nested,
      toolbar: [{ type: 'EditorToolbar', items: [{ command: 'bold', onPress() {} }] }],
    }).success,
  ).toBe(false);
});

it('uses the existing document child budget for both recursive slots', () => {
  const children = Array.from({ length: DOCUMENT_POLICY.maxChildren + 1 }, () => ({
    type: 'Text',
    content: 'Safe help',
  }));
  expect(recursive.safeParse({ ...nested, children }).success).toBe(false);
  expect(recursive.safeParse({ ...nested, toolbar: children }).success).toBe(false);
});
